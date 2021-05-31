import config from '../config';
import headers from './headers';

export default {

    async findById(id) {
        let response = await fetch(`${config.API_URL}/cms/documents/id/${id}`, {headers});
        let json = await response.json();
        return json;
    },

    validate(data) {
        let errors = '';

        console.log(data);

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        if (! data.doc) {
            errors += ' Envie um arquivo.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/documents/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async cover => {
        const response = await fetch(`${config.API_URL}/cms/documents/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(cover)
        });

        let newCover = await response.json();

        return newCover;
    },


    update: async (id, cover) => {
        const params = {id};
        for (let i in cover) {
            params[`${i}`] = cover[i];
        }
        const response = await fetch(`${config.API_URL}/cms/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newCover = await response.json();

        return newCover;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/documents/${id}`, {
        headers,
        method: 'DELETE'
    })

}