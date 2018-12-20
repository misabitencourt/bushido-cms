


module.exports = {

    storage: {},

    put(k, v) {
        this.storage[k] = v;
    },

    get(k, v) {
        if (this.storage[k] === 0) {
            return 0;
        }

        if (this.storage[k] === false) {
            return false;
        }

        return this.storage[k] || null;
    },

    clean() {
        this.storage = {};
    },

    getAll() {
        const arrKv = [];
        for (let i in this.storage) {
            arrKv.push({k: i, v: this.storage[i]});
        }

        return arrKv;
    }
}