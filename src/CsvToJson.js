module.exports = class CsvConverter {
    constructor(separator = null) {
        this.separator = separator;

        this._jsonKeys = [];
        this._possibleSeparators = [',', ';', '|', '\t', ' '];
    }

    setJsonKeys(unsplitStr) {
        if (!this.separator) {
            this.separator = this._detectSeparator(unsplitStr);
        }

        this._jsonKeys = unsplitStr.split(this.separator);
    }

    getJsonFrom(unsplitStr) {
        const parsedStr = unsplitStr.split(this.separator);
        const resultJson = {};

        this._jsonKeys.forEach((key, idx) => { resultJson[key] = parsedStr[idx]; });

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
            let nextStrSymbol = null;
            let matchCount = 0;

            for (let i = 0; i < unsplitStr.length; i += 1) {
                previousStrSymbol = unsplitStr[i - 1];
                currentStrSymbol = unsplitStr[i];
                nextStrSymbol = unsplitStr[i + 1];

                if (currentStrSymbol === separator && previousStrSymbol !== separator && nextStrSymbol !== separator) {
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
