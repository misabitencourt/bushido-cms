import config from '../config';
import headers from './headers'

export default {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.short_description) {
            errors += ' Informe a descrição curta.';
        }

        if (! (data.photos && data.photos.length)) {
            errors += ' Selecione uma foto.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/product/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/product/`, {
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
        const response = await fetch(`${config.API_URL}/cms/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/product/${id}`, {
        headers,
        method: 'DELETE'
    }),

    destroyImage: async id => fetch(`${config.API_URL}/cms/product/image/${id}`, {
        headers,
        method: 'DELETE'
    })

}