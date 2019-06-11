module.exports = class {
    constructor(separator = null) {
        this.separator = separator;

        this._keys = [];
    }

    setKeys(str) {
        if (!this.separator) {
            this.separator = this._detectSeparator(str);
        }

        this._keys = str.split(this.separator);
    }

    getJson(str) {
        const values = str.split(this.separator);
        const object = {};

        this._keys.forEach((key, idx) => { object[key] = values[idx]; });

        return object;
    }

    _detectSeparator(str) {
        const separators = [',', ';', '|', '\t', ' '];

        const detectedSeparator = {
            separator: null,
            matchCount: 0
        };

        separators.forEach((separator) => {
            let previous = null;
            let current = null;
            let next = null;
            let matchCount = 0;

            for (let i = 0; i < str.length; i += 1) {
                previous = str[i - 1];
                current = str[i];
                next = str[i + 1];

                if (current === separator && previous !== separator && next !== separator) {
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
