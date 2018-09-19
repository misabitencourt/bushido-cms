import config from '../config';
import headers from './headers'

export default {

    async findById(id) {
        let response = await fetch(`${config.API_URL}/cms/cover/id/${id}`, {headers});
        let json = await response.json();
        return json;
    },

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o título (nome).';
        }

        if (! data.description) {            
            errors += ' Informe a descrição.';
        }

        if (! data.group) {
            errors += ' Selecione um grupo.';
        }

        if (! data.cover) {
            errors += ' Selecione uma foto de capa.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/cover/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async cover => {
        const response = await fetch(`${config.API_URL}/cms/cover/`, {
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
        const response = await fetch(`${config.API_URL}/cms/cover/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newCover = await response.json();

        return newCover;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/cover/${id}`, {
        headers,
        method: 'DELETE'
    })

}