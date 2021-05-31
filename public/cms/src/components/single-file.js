import { addEvent } from '../common/event';
import fileOpen from '../common/file-open';

const render = (el, meta) => {
    let value = el.dataset.value;

    el.innerHTML = '';

    addEvent('form:edit', data => {
        const file = data[meta.name];
        value = file;
        if (file) {
            render(el, meta, img);
        }
    });

    addEvent('form:reset', () => {
        value = null;
        render(el, meta);
    });

    const innerEl = createEls('div', 'input-single-file-inner', el, [
        
        value ? (
            {tag: 'a', attrs: {href:'javascript:;'}, textContent: 'Baixar arquivo', on: ['click', () => {
                // TODO
            }]}
        ) : (
            {tag: 'label', textContent: 'Selecionar arquivo'}
        ),
        
        {
            tag: 'button', 
            className: 'btn btn-outline-primary ml-2', 
            attrs: {type: 'button'},
            textContent: value ? 'Trocar arquivo' : 'Abrir', 
            on: ['click', () => {
                fileOpen(meta.accept).then(file => {
                    el.dataset.value = file;
                    value = file;
                    innerEl.replaceWith(render(el, meta));
                }).catch(err => console.error(err));
            }]
        }
    ]);

    return innerEl;
}

export default render;