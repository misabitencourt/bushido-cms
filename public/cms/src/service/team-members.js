import config from '../config';
import headers from './headers'

export default {

    async findById(id) {
        let response = await fetch(`${config.API_URL}/cms/team-member/id/${id}`, {headers});
        let json = await response.json();
        return json;
    },

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o título (nome).';
        }

        if (! data.role) {            
            errors += ' Informe o cargo.';
        }

        if (! data.avatar) {
            errors += ' Selecione uma foto de perfil.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/team-member/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async teamMember => {
        const response = await fetch(`${config.API_URL}/cms/team-member/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(teamMember)
        });

        let newTeamMember = await response.json();

        return newTeamMember;
    },


    update: async (id, teamMember) => {
        const params = {id};
        for (let i in teamMember) {
            params[`${i}`] = teamMember[i];
        }
        const response = await fetch(`${config.API_URL}/cms/team-member/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newTeamMember = await response.json();

        return newTeamMember;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/team-member/${id}`, {
        headers,
        method: 'DELETE'
    })

}