import template from './template';
import form from './form';
import service from '../service/team-members';
import grid from './grid';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';

const render = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'Cargo', name: 'role'},
            {type: 'text', label: 'Link (rede social, LinkedIn)', name: 'social_media'},
            {type: 'spacing'},
            {type: 'single-image', label: 'Foto de perfil', name: 'avatar'},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            const errors = service.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Perfil atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Perfil salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Equipe'},
        formObj,
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ])    

    formEl = mainEl.querySelector('form')
    const loadData = () => service.retrieve(searchInput.value)    

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            oldGrid.parentElement.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: member => member.name },
                {label: 'Cargo', prop: member => member.role }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(member) {
                service.findById(member.id).then(member => {
                    dataToForm(member, formEl);
                    formEl.querySelector('input').focus();
                    formEl.dataset.id = member.id;
                });
            },
    
            onDelete(member) {
                service.destroy(member.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Perfil excluído com sucesso'
                    });
                    window.location.reload();    
                });
            }
        })
        mainEl.appendChild(gridEl);
    };

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'member'));
};


export default render;