import config from '../config';
import headers from './headers'

export default {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.email) {
            errors += ' Informe o e-mail.';
        }

        if (! data.phone) {
            errors += ' Informe o telefone.';
        }

        if (! data.password) {
            errors += ' Informe a senha.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/user/${encodeURIComponent(search)}`);
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/user/`, {
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
            params[`user_${i}`] = user[i];
        }
        const response = await fetch(config.API_URL, {
            method: 'PUT',
            body: JSON.stringify(params)
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/user/${id}`, {
        headers,
        method: 'DELETE'
    })

}