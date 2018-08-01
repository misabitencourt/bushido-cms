import template from './template';
import form from '../components/form';
import service from '../service/articles';
import menuSrv from '../service/menus';
import grid from '../components/grid';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';

const render = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Título', name: 'title'},
            {type: 'text', label: 'Descrição', name: 'description'},
            {type: 'single-entity', label: 'Menu', name: 'menu', etity: 'menu', service: menuSrv, descriptionField: 'name'},
            {type: 'wysiwyg', name: 'text', fieldCol: 12},
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
                        msg: 'Artigo atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Artigo salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Artigos'},
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
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Título', prop: article => article.title },
                {label: 'Descrição', prop: article => article.description },
                {label: 'Menu', prop: article => (article.menu || {}).name || '' }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(article) {
                dataToForm(article, formEl);
                formEl.dataset.id = article.id;
            },
    
            onDelete(article) {
                service.destroy(article.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'article excluído com sucesso'
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
    appEl.appendChild(template(wrpEl, 'article'));
};


export default render;