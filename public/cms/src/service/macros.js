import config from '../config';
import headers from './headers'

export default {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe um nome único';
        }

        if (! (data.strval && data.textval)) {
            errors += ' Informe a descrição.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/macros/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async macro => {
        const response = await fetch(`${config.API_URL}/cms/macros/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(macro)
        });

        let newUser = await response.json();

        return newUser;
    },


    update: async (id, macro) => {
        const params = {id};
        for (let i in macro) {
            params[`${i}`] = macro[i];
        }
        const response = await fetch(`${config.API_URL}/cms/macros/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/macros/${id}`, {
        headers,
        method: 'DELETE'
    })

}