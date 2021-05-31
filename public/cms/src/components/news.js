import template from './template';
import form from '../components/form';
import service from '../service/news';
import grid from '../components/grid';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';
import menuSrv from '../service/menus';
import { commonToPtBr } from '../common/date-format';

const render = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Título', name: 'title'},
            {type: 'text', label: 'Descrição', name: 'description'},
            {type: 'text', label: 'Autor', name: 'author'},
            {type: 'date', label: 'Data de publicação', name: 'published_at'},
            {type: 'single-entity', label: 'Menu', name: 'menu', etity: 'menu', service: menuSrv, descriptionField: 'name'},
            {type: 'wysiwyg', label: 'Resumo', name: 'abstract', fieldCol: '12'},
            {type: 'wysiwyg', label: 'Texto', name: 'text', fieldCol: '12'},
            {type: 'single-image', label: 'Capa', name: 'cover'},
            {type: 'spacing'},
            {type: 'spacing'},
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
                        msg: 'Notícia atualizada com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia salva com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Notícias'},
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
                {label: 'Data', prop: notice => commonToPtBr(notice.published_at)},
                {label: 'Nome', prop: notice => notice.title }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(notice) {
                service.findById(notice.id).then(notice => {
                    dataToForm(notice, formEl);
                    formEl.querySelector('input').focus();
                    formEl.dataset.id = notice.id;
                });
            },
    
            onDelete(notice) {
                service.destroy(notice.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia excluída com sucesso'
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
    appEl.appendChild(template(wrpEl, 'new'));
};


export default render;