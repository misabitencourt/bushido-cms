import template from './template';
import form from '../components/form';
import service from '../service/events';
import articleSrv from '../service/articles';
import error from '../dialogs/error';
import calendar from './calendar';
import { dataToForm } from '../common/form-bind'
import { commonToPtBr } from '../common/date-format';

const render = appEl => {
    let formEl;
    let deleteBtn;
    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Endereço', name: 'address'},
            {type: 'text', label: 'Descrição curta', name: 'description'},
            {type: 'single-entity', label: 'Artigo explicativo', name: 'article_id', etity: 'article', service: articleSrv, descriptionField: 'title'},
            {type: 'datetime', label: 'Início', name: 'start'},
            {type: 'datetime', label: 'Fim', name: 'end'},
            {type: 'single-image', label: 'Foto de capa', name: 'cover'},
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
                        msg: 'Evento atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Evento salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Eventos'},
        formObj,
        {tag: 'h3', textContent: 'Eventos'},
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-12', async bootstrap(el) {
                const start = new Date();
                start.setDate(1);
                const end = new Date();
                let events = await service.findByRange(start, end);
                const monthSelected = new Date();

                const renderCalendar = config => {
                    calendar(el, config);
                };
                const eventFormatter = e => ({
                    id: e.id,
                    date: new Date(e.start),
                    description: e.description
                });

                const params = {
                    onChangeMonth: async (month, year) => {
                        monthSelected.setMonth(month);
                        monthSelected.setFullYear(year);
                        events = await service.findByRange(start, end);
                        params.month = monthSelected.getMonth();
                        params.year = monthSelected.getFullYear();
                        params.items = events.map(eventFormatter);
                        el.innerHTML = '';
                        renderCalendar(params);
                    },
                    month: monthSelected.getMonth(),
                    year: monthSelected.getFullYear(),
                    items: events.map(eventFormatter),
                    onItemClick: async item => {
                        const event = await service.findById(item.id);
                        event.start = new Date(event.start);
                        event.end = new Date(event.end);
                        event.article_id = event.article;
                        dataToForm(event, formEl);
                        formEl.querySelector('input').focus();
                        formEl.dataset.id = event.id;
                        deleteBtn.style.display = 'inherit';
                    }
                };

                renderCalendar(params);
            }}
        ]}
    ]);
    wrpEl.appendChild(mainEl);
    formEl = mainEl.querySelector('form');
    createEls('div', 'col-md-12', formEl, [
        {tag: 'button', className: 'btn btn-danger', attrs: {type: 'button'}, textContent: 'Deletar', bootstrap: el => {
            deleteBtn = el;
            el.style.display = 'none';
            el.addEventListener('click', async () => {
                await service.destroy(formEl.dataset.id);
                sessionStorage.flash = JSON.stringify({
                    type: 'success',
                    msg: 'Evento excluído com sucesso'
                });
                window.location.reload();
            });
        }}
    ]);
    formEl.addEventListener('reset', () => deleteBtn.style.display = 'none');
    appEl.appendChild(template(wrpEl, 'event'));
};


export default render;