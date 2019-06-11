const { Transform } = require('stream');

const CsvToJson = require('./CsvToJson');

module.exports = class extends Transform {
    constructor(separator) {
        super();

        this.isHeader = true;
        this.isFirstDataRow = true;
        this.rawDataHub = '';

        this.csvToJson = new CsvToJson(separator);
    }

    _transform(chunk, encoding, callback) {
        const nextRowSeparator = '\r';

        const rawData = this.rawDataHub + chunk.toString();
        const lastRowIndex = rawData.lastIndexOf(nextRowSeparator);

        let data;

        if (rawData.endsWith(nextRowSeparator)) {
            this.rawDataHub = '';
            data = rawData.split(nextRowSeparator);
        } else {
            this.rawDataHub = rawData.substring(lastRowIndex + 1);
            data = rawData.substring(0, lastRowIndex)
                .split(nextRowSeparator);
        }

        data.forEach((row) => {
            if (this.isHeader) {
                this.isHeader = false;

                this.csvToJson.setKeys(row);
                this.push('[');
            } else if (this.isFirstDataRow) {
                this.isFirstDataRow = false;

                this.push(JSON.stringify(this.csvToJson.getJson(row)));
            } else {
                this.push(`, ${JSON.stringify(this.csvToJson.getJson(row))}`);
            }
        });

        return callback();
    }

    _flush(callback) {
        this.push(']');

        return callback();
    }
};
