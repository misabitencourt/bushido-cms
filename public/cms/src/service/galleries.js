import config from '../config';
import headers from './headers'

export default {

    async findById(id) {
        let response = await fetch(`${config.API_URL}/cms/galleries/id/${id}`, {headers});
        let json = await response.json();
        return json;
    },

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
        let response = await fetch(`${config.API_URL}/cms/galleries/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async product => {
        const response = await fetch(`${config.API_URL}/cms/galleries/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(product)
        });

        let newUser = await response.json();

        return newUser;
    },


    update: async (id, product) => {
        const params = {id};
        for (let i in product) {
            params[`${i}`] = product[i];
        }
        const response = await fetch(`${config.API_URL}/cms/galleries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/galleries/${id}`, {
        headers,
        method: 'DELETE'
    }),

    createImage: async (id, image) => fetch(`${config.API_URL}/cms/galleries/image`, {
        body: JSON.stringify({id, image}),
        headers,
        method: 'POST'
    }).then(res => res.json()),

    destroyImage: async id => fetch(`${config.API_URL}/cms/galleries/image/${id}`, {
        headers,
        method: 'DELETE'
    })

}