import template from './template';
import form from './form';
import service from '../service/documents';
import grid from './grid';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';

const render = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Descrição', name: 'description'},
            {type: 'text', label: 'Categoria', name: 'category'},
            {type: 'single-file', label: 'Arquivo PDF', name: 'doc', accept: 'application/pdf'},
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
                        msg: 'Documento atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Documento salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Documentos'},
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
        try {
            const oldGrid = mainEl.querySelector('table');
            if (oldGrid && oldGrid.parentElement) {
                oldGrid.parentElement.removeChild(oldGrid);
            }
            const gridEl = await grid({
                columns: [
                    {label: 'Descrição', prop: doc => doc.description },
                    {label: 'Categoria', prop: doc => doc.category }
                ],

                loadData() {
                    return loadData();
                },
        
                onEdit(doc) {
                    service.findById(doc.id).then(doc => {
                        dataToForm(doc, formEl);
                        formEl.querySelector('input').focus();
                        formEl.dataset.id = doc.id;
                    });
                },
        
                onDelete(doc) {
                    service.destroy(doc.id).then(() => {
                        sessionStorage.flash = JSON.stringify({
                            type: 'success',
                            msg: 'Documento excluído com sucesso'
                        });
                        window.location.reload();    
                    });
                }
            })
            mainEl.appendChild(gridEl);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid().catch(err => console.error(err));
    appEl.appendChild(template(wrpEl, 'documents'));
};


export default render;