import http from 'node:http'
import { Router } from './middlewares/router.js'
import { Database } from './database/database.js'
import { randomUUID } from 'node:crypto'
import { ExportTasksCsvStream } from './streams/export-tasks-csv.js'
import { ImportTasksCsvStream } from './streams/import-tasks-csv.js'

const db     = new Database()
const router = new Router()

/**
 * Task {
 *  - `id` - Identificador único de cada task
 *  - `title` - Título da task
 *  - `description` - Descrição detalhada da task
 *  - `completed_at` - Data de quando a task foi concluída. O valor inicial deve ser `null`
 *  - `created_at` - Data de quando a task foi criada.
 *  - `updated_at` - Deve ser sempre alterado para a data de quando a task foi atualizada.
 * }
 */

/**
 * Route to create a new task.
 */
router.POST('/tasks', async (req, res) => {
    const { title, description } = req.body

    if ( !title ) {
        return res.writeHead(400).end('A Task title field is required.')
    } 

    const new_task = {
        id: randomUUID(),
        title, 
        description,
        created_at: new Date,
        updated_at: null,
        completed_at: null
    }

    await db.insert('tasks', new_task)

    return res.writeHead(201).end(JSON.stringify({ id: new_task.id }))
})

/**
 * Route to list all tasks based on filters.
 */
router.GET('/tasks', async (req, res) => {
    /** @type {URLSearchParams} */
    const query_params = req.query

    const filterable_fields = ['title', 'description']

    const where_filters = query_params.entries().reduce((filters, [ field_filter, field_value ]) => {
        if ( filterable_fields.includes(field_filter) && field_value ) {
            if ( !filters ) filters = {}

            filters[field_filter] = {
                operator: 'ilike',
                condition: 'OR',
                value: field_value
            }
        };

        return filters
    }, undefined)

    const tasks = await db.select('tasks', where_filters)
    return res.writeHead(200).end(JSON.stringify(tasks))
})

/**
 * Route to update fields of task on specific id.
 */
router.PUT('/tasks/:id', async (req, res) => {
    const { id } = req.params

    let task_with_id = await db.select('tasks', { id: { value: id } })

    if ( task_with_id.length == 0 ) {
        return res.writeHead(404).end(`No task founded with id ${id}`)
    }

    const payload = req.body
    await db.update('tasks', {
        ...payload,
        updated_at: new Date
    }, { id: { value: id } })

    return res.writeHead(204).end()
})

/**
 * Route to delete task for specific id.
 */
router.DELETE('/tasks/:id', async (req, res) => {
    const { id } = req.params

    let task_with_id = await db.select('tasks', { id: { value: id } })

    if ( task_with_id.length == 0 ) {
        return res.writeHead(404).end(`No task founded with id ${id}`)
    }

    await db.delete('tasks', { id: { value: id } })

    return res.writeHead(204).end()
})

/**
 * Route to complete task for specific id.
 */
router.PATCH('/tasks/:id/complete', async (req, res) => {
    const { id } = req.params

    let task_with_id = await db.select('tasks', { id: { value: id } })

    if ( task_with_id.length == 0 ) {
        return res.writeHead(404).end(`No task founded with id ${id}`)
    }

    const task_to_complete = {
        ...task_with_id.at(0),
        completed_at: task_with_id.at(0).completed_at ? null : new Date,
        updated_at: new Date
    }

    await db.update('tasks', task_to_complete, { id: { value: id } })
    return res.writeHead(204).end()
})

/**
 * Route to import tasks from csv file.
 */
router.POST('/tasks/import', async (_, res) => {
    const fake_csv_uploaded_path = new URL(`../src/uploads/tasks.csv`, import.meta.url)
    const import_csv_tasks_stream = new ImportTasksCsvStream(fake_csv_uploaded_path)
    import_csv_tasks_stream.on('finish', () => {
        res.writeHead(201).end()
    })
    import_csv_tasks_stream.on('error', (e) => {
        console.error(e)
        res.writeHead(500).end('A problem as ocurred when importing tasks')
    })
})

/**
 * Route to export tasks in a csv file format.
 */
router.GET('/tasks/export', async (req, res) => {
    /** @type {URLSearchParams} */
    const query_params = req.query

    const filterable_fields = ['title', 'description']

    const where_filters = query_params.entries().reduce((filters, [ field_filter, field_value ]) => {
        if ( filterable_fields.includes(field_filter) && field_value ) {
            if ( !filters ) filters = {}

            filters[field_filter] = {
                operator: 'ilike',
                condition: 'OR',
                value: field_value
            }
        };

        return filters
    }, undefined)

    const tasks = await db.select('tasks', where_filters)

    const export_csv_tasks_stream = new ExportTasksCsvStream(tasks)

    res.writeHead(200, {
        'Content-Type'       : 'text/csv',
        'Content-Disposition': 'attchment; filename=tasks.csv',
    })

    return export_csv_tasks_stream.pipe(res)

})

const server = http.createServer(async (req, res) => router.execute(req, res, server))

server.listen(3000, () => {
    console.log('Servidor HTTP rodando em http://localhost:3000 🚀')
}) 