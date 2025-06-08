import { Readable } from 'node:stream'

export class ExportTasksCsvStream extends Readable {
    #tasks
    #isHeaderWrite = true
    #index = -1;

    static TASK_EXPORT_FIELDS = ['title', 'description']

    constructor(tasks, options) {
        super(options)
        this.#tasks = tasks
    }

    _read() {
        if ( this.#isHeaderWrite ) {
            this.#isHeaderWrite = false;
            const header_fields = ExportTasksCsvStream.TASK_EXPORT_FIELDS
            this.push(header_fields.join(','))
            return;
        }

        this.#index++

        if ( this.#index < this.#tasks.length ) {
            const task = this.#tasks[this.#index]
            const row_fields = ExportTasksCsvStream.TASK_EXPORT_FIELDS.reduce((current_row_fields, field) => {
                const task_field_value = task[field] 
                if ( !task_field_value) {
                    return current_row_fields
                }
                return [
                    ...current_row_fields,
                    task_field_value
                ]
            }, [])

            if ( !row_fields.length ) {
                return 
            }

            this.push('\n' + row_fields.join(','))
        } else {
            this.push(null)
        }
        
    }
}