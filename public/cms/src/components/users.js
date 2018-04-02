import template from './template';
import form from '../components/form';
import service from '../service/users';

const render = el => {
    template(el);

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'E-mail', name: 'email'},
            {type: 'text', label: 'Telefone', name: 'phone'},
            {type: 'text', label: 'Senha', name: 'password'},
            {type: 'acl', label: 'Acesso', name: 'acl'},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            if (e.target.dataset.id) {
                // TODO
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário salvo com sucesso'
                    });
                    // window.location.reload();
                });
            }
        }
    });
    
    createEls('div', '', el, [
        {tag: 'h2', textContent: 'Cadastro de usuários'},

        formObj
    ])
};


export default render;