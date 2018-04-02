import config from '../config';


export default {

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/user/${encodeURIComponent(search)}`);
        let json = await response.json();
        return json;
    },


    create: async user => {
        let data = '';
        for (let i in user) {
            data += `${i}=${encodeURIComponent(user[i])}&`;
        }

        const response = await fetch(`${config.API_URL}/cms/user/`, {
            method: 'POST',
            body: data
        });

        console.log(user);

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


    destroy: async id => fetch(`${config.API_URL}/${id}`, {
        method: 'DELETE'
    })

}