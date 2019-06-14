module.exports = class CsvConverter {
    constructor(separator = null) {
        this.separator = separator;

        this._csvHeaders = [];
        this._possibleSeparators = [',', ';', '|', '\t', ' '];
    }

    setHeaders(unsplitCsv) {
        if (!this.separator) {
            this.separator = this._detectSeparator(unsplitCsv);
        }

        this._csvHeaders = unsplitCsv.split(this.separator);
    }

    getJson(unsplitCsv) {
        const parsedCsv = unsplitCsv.split(this.separator);
        const resultJson = {};

        this._csvHeaders.forEach((key, index) => { resultJson[key] = parsedCsv[index]; });

        return resultJson;
    }

    _detectSeparator(unsplitStr) {
        const detectedSeparator = {
            separator: null,
            matchCount: 0
        };

        this._possibleSeparators.forEach((separator) => {
            let previousStrSymbol = null;
            let currentStrSymbol = null;
            let matchCount = 0;

            for (let i = 0; i < unsplitStr.length; i += 1) {
                previousStrSymbol = unsplitStr[i - 1];
                currentStrSymbol = unsplitStr[i];

                if (currentStrSymbol === separator && previousStrSymbol !== separator) {
                    matchCount += 1;
                }
            }

            if (detectedSeparator.matchCount < matchCount) {
                detectedSeparator.separator = separator;
                detectedSeparator.matchCount = matchCount;
            }
        });

        return detectedSeparator.separator;
    }
};
