import { Writable } from 'node:stream'
import fs from 'node:fs'
import { parse as csv_parse } from 'csv-parse'

export class ImportTasksCsvStream extends Writable {
    static TASK_IMPORT_FIELDS = ['title', 'description']

    constructor (csv_file_path, options) {
        super({ ...options, objectMode: true })
        fs.createReadStream(csv_file_path).pipe(csv_parse({
            delimiter: ',',
            from_line: 2,
            columns: ImportTasksCsvStream.TASK_IMPORT_FIELDS
        })).pipe(this)
    }

    _write(chunk, _, cb) {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            body: JSON.stringify(chunk)
        })
        .catch(e => console.error('An error as ocurred importing a task', e))
        .finally(cb)
    }
}