import template from './template';
import icon from './icon';
import form from '../components/form';
import service from '../service/menus';
import {dataToForm} from '../common/form-bind';
import error from '../dialogs/error';

const render = appEl => {
    const wrpEl = document.createElement('div');
    createEls('div', 'row', wrpEl, [
        {tag: 'div', className: 'col-md-9', children: [
            {tag: 'h2', textContent: 'Cadastro de textos gerais', className: 'mb-3'}
        ]},
        {tag: 'div', className: 'col-md-3', children: [
            {tag: 'a', className: 'pt-2', attrs: {href: 'javascript:;'}, children: [
                icon('add', 32, 32, ['click', () => {
                    // TODO
                }])
            ]}
        ]}
    ]);

    appEl.innerHTML = '';
    appEl.appendChild(template(wrpEl, 'menu'));
};


export default render;