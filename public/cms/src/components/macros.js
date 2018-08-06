import template from './template';
import icon from './icon';
import macro from './macro';
import { addEvent } from '../common/event';

const render = appEl => {
    const wrpEl = document.createElement('div');
    const render = (macros=[]) => {
        wrpEl.innerHTML = '';
        createEls('div', '', wrpEl, [
            {tag: 'div', className: 'row', children: [
                {tag: 'div', className: 'col-md-9', children: [
                    {tag: 'h2', textContent: 'Cadastro de textos gerais', className: 'mb-3'}
                ]},
                {tag: 'div', className: 'col-md-3 pt-2 text-md-right', children: [
                    {tag: 'a', attrs: {href: 'javascript:;'}, children: [
                        icon('add', 32, 32, ['click', () => {
                            macros.push({});
                            render();
                        }])
                    ]}
                ]}
            ]},
            macro(macros)
        ]);
        addEvent('macros:refresh', macros => render(macros));
    };
        
    appEl.appendChild(template(wrpEl, 'macros'));
    render();
};

export default render;
