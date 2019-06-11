module.exports = class {
    constructor(separator = null) {
        this.separator = separator;

        this._keys = [];
    }

    setKeys(str) {
        this._keys = str.split(this.separator);
    }

    getJson(str) {
        const values = str.split(this.separator);
        const object = {};

        this._keys.forEach((key, idx) => { object[key] = values[idx]; });

        return object;
    }
};
