import template from './template';
import form from '../components/form';
import service from '../service/users';
import grid from '../components/grid';
import {dataToForm, formToData} from '../common/form-bind';
import error from '../dialogs/error'

const render = appEl => {
    let formEl, searchInput;

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
            const errors = service.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                // TODO
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário salvo com sucesso'
                    });
                    window.location.reload();                    
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de usuários'},
        formObj,
        {tag: 'div', className: 'p-4'},
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ])

    formEl = mainEl.querySelector('form')

    const loadData = () => service.retrieve(searchInput.value)

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table')
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: user => user.name },
                {label: 'E-mail', prop: user => user.email },
                {label: 'Telefone', prop: user => user.phone }
            ],

            loadData() {
                return loadData() 
            },
    
            onEdit(user) {
                dataToForm(user, formEl)
            },
    
            onDelete(user) {
                console.log(user)
                service.destroy(user.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário excluído com sucesso'
                    });
                    window.location.reload();    
                })
            }
        })
        mainEl.appendChild(gridEl)
    }

    renderGrid()
    appEl.appendChild(template(wrpEl, 'users'));
};


export default render;