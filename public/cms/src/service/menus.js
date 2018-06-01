import config from '../config';
import headers from './headers'

export default {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/menu/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/menu/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });

        let newUser = await response.json();

        return newUser;
    },


    update: async (id, user) => {
        const params = {id};
        for (let i in user) {
            params[`${i}`] = user[i];
        }
        const response = await fetch(`${config.API_URL}/cms/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/menu/${id}`, {
        headers,
        method: 'DELETE'
    })

}