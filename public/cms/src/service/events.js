import config from '../config';
import headers from './headers'

export default {

    async findById(id) {
        let response = await fetch(`${config.API_URL}/cms/event/${id}`, {headers});
        let json = await response.json();
        return json;
    },

    validate(data) {
        let errors = '';

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        if (! data.start) {
            errors += ' Informe o início.';
        }

        if (! data.end) {
            errors += ' Informe o término.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/event/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },

    findByRange: async (start, end) => {
        const dateRange = `${encodeURIComponent(start+'')}/${encodeURIComponent(end+'')}`;
        let response = await fetch(`${config.API_URL}/cms/event/date-range/${dateRange}`, {headers});
        let json = await response.json();
        return json;
    },

    create: async event => {
        const response = await fetch(`${config.API_URL}/cms/event/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(event)
        });

        let newData = await response.json();

        return newData;
    },


    update: async (id, event) => {
        const params = {id};
        for (let i in event) {
            params[`${i}`] = event[i];
        }
        const response = await fetch(`${config.API_URL}/cms/event/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newData = await response.json();

        return newData;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/event/${id}`, {
        headers,
        method: 'DELETE'
    })

}