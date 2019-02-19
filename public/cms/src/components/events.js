import template from './template';
import form from '../components/form';
import service from '../service/events';
import articleSrv from '../service/articles';
import error from '../dialogs/error';
import calendar from './calendar';

const render = appEl => {
    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Endereço', name: 'address'},
            {type: 'text', label: 'Descrição curta', name: 'description'},
            {type: 'single-entity', label: 'Artigo explicativo', name: 'article_id', etity: 'article', service: articleSrv, descriptionField: 'title'},
            {type: 'datetime', label: 'Início', name: 'start'},
            {type: 'datetime', label: 'Fim', name: 'end'},
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
            {tag: 'div', className: 'col-md-12', bootstrap(el) {
                const monthSelected = new Date();

                const renderCalendar = config => {
                    calendar(el, config);
                };

                renderCalendar({
                    onSelectDay: () => console.log('teste'),
                    onChangeMonth: (month, year) => {
                        monthSelected.setMonth(month);
                        monthSelected.setMonth(year);
                    },
                    month: monthSelected.getMonth(),
                    year: monthSelected.getFullYear(),
                    items: []
                });
            }}
        ]}
    ]);
    wrpEl.appendChild(mainEl);
    appEl.appendChild(template(wrpEl, 'event'));
};


export default render;