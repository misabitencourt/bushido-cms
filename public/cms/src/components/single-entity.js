import icon from './icon'
import { createCredentials } from 'crypto';

export default field => {
    let ddMenu;

    if (! field.service) {
        console.error(field, 'You forgot the service');
        return {tag: 'div'};
    }

    if (! field.descriptionField) {
        console.error(field, 'You forgot the descriptionField');
        return {tag: 'div'};
    }

    const elements = {};
    
    return {
        tag: 'div', 
        className: 'row',
        children: [
            {tag: 'div', className: 'col-md-10', children: [
                {tag: 'input', className: 'form-control', bootstrap(el) {
                    elements.input = el;
                }}
            ]},
            {tag: 'div', className: 'col-md-2 hidden', 
                children: [icon('delete', 16, 16)], bootstrap(el) {
                elements.remove = el;
                el.addEventListener('click', () => {
                    elements.input.value = '';
                    elements.input.disabled = false;
                    elements.mainEl.dataset.value = '';
                    addClass(el, 'hidden');
                    elements.input.focus();
                });
            }}
        ],
        bootstrap(el) {
            elements.mainEl = el;
            el.dataset.name = field.name;

            function addItem(item) {
                killEl(ddMenu);
                el.dataset.value = item.id;
                elements.input.disabled = true;
                elements.input.value = textContent;
                removeClass(elements.remove, 'hidden');
            }

            elements.input.addEventListener('keyup', () => {
                window.inputSearchDebounce && window.clearTimeout(window.inputSearchDebounce);
                window.inputSearchDebounce = setTimeout(async () => {
                    if (ddMenu) {
                        killEl(ddMenu);
                    }

                    if (! elements.input.value) {
                        return;
                    }

                    let list = await field.service.retrieve(elements.input.value);  
                    
                    if (! list.length) {
                        return;
                    }

                    ddMenu = createEls('div', 'dropdown-menu show dismissable', el, list.map(item => {
                        const textContent = item[field.descriptionField];
                        return {
                            tag: 'a', 
                            className: 'dropdown-item', 
                            attrs: {href: 'javascript:;'}, 
                            textContent,
                            on: ['click', () => addItem(item)]
                        }
                    }));
                }, 600);
            })
        }
    };
}