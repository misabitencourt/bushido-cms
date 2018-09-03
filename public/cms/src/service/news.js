import config from '../config';
import headers from './headers'

export default {

    validate(data) {
        let errors = '';

        if (! data.title) {
            errors += ' Informe o título.';
        }

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        if (! data.abstract) {
            errors += ' Digite um resumo.';
        }

        if (! data.text) {
            errors += ' Digite um texto.';
        }

        if (! data.cover) {
            errors += ' Selecione uma foto de capa.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/new/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async notice => {
        const response = await fetch(`${config.API_URL}/cms/new/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(notice)
        });

        let newNotice = await response.json();

        return newNotice;
    },


    update: async (id, notice) => {
        const params = {id};
        for (let i in notice) {
            params[`${i}`] = notice[i];
        }
        const response = await fetch(`${config.API_URL}/cms/new/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newNotice = await response.json();

        return newNotice;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/new/${id}`, {
        headers,
        method: 'DELETE'
    })

}