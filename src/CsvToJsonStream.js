const { Transform } = require('stream');

const CsvConverter = require('./CsvToJson');

module.exports = class CsvToJsonStream extends Transform {
    constructor(separator) {
        super();

        this.isHeader = true;
        this.isFirstCsvRow = true;
        this.csvStringHub = '';

        this.csvConverter = new CsvConverter(separator);
    }

    _transform(chunk, encoding, callback) {
        const csvRowSeparator = '\r';

        const csvString = this.csvStringHub + chunk;
        const csvLastCorrectRowIndex = csvString.lastIndexOf(csvRowSeparator);

        let splitCsv;

        if (csvString.endsWith(csvRowSeparator)) {
            this.csvStringHub = '';
            splitCsv = csvString.split(csvRowSeparator);
        } else {
            this.csvStringHub = csvString.substring(csvLastCorrectRowIndex + 1);
            splitCsv = csvString
                .substring(0, csvLastCorrectRowIndex)
                .split(csvRowSeparator);
        }

        splitCsv.forEach((csvRow) => {
            if (this.isHeader) {
                this.isHeader = false;

                this.csvConverter.setJsonKeys(csvRow);
                this.push('[');
            } else if (this.isFirstCsvRow) {
                this.isFirstCsvRow = false;

                this.push(JSON.stringify(this.csvConverter.getJsonFrom(csvRow)));
            } else {
                this.push(`, ${JSON.stringify(this.csvConverter.getJsonFrom(csvRow))}`);
            }
        });

        return callback();
    }

    _flush(callback) {
        if (this.csvStringHub) {
            this.push(`, ${JSON.stringify(this.csvConverter.getJsonFrom(this.csvStringHub))}`);
        }

        this.push(']');

        return callback();
    }
};
