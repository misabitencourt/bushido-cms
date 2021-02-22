import template from './template';
import form from './form';
import service from '../service/galleries';
import grid from './grid';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';
import { priceFormat } from '../common/number';

const render = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'Descrição', name: 'short_description'},
            {type: 'text', label: 'Grupo (categoria)', name: 'group'},
            {type: 'wysiwyg', name: 'long_description', fieldCol: 12},
            {type: 'image-list', name: 'photos', label: 'Fotos', fieldCol: 12, service},
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
                        msg: 'Galeria atualizada com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Galeria salva com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Galerias'},
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
                {label: 'Nome', prop: gallery => gallery.name },
                {label: 'Descrição curta', prop: gallery => gallery.short_description },
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(gallery) {
                service.findById(gallery.id).then(gallery => {
                    dataToForm(gallery, formEl);
                    formEl.querySelector('input').focus();
                    formEl.dataset.id = gallery.id;
                });
            },
    
            onDelete(gallery) {
                service.destroy(gallery.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Galeria excluída com sucesso'
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
    appEl.appendChild(template(wrpEl, 'gallery'));
};


export default render;