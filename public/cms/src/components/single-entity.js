import icon from './icon'

export default field => {
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
                children: [icon('remove', 32, 32)], bootstrap(el) {
                elements.remove = el;
            }}
        ],
        bootstrap() {
            elements.input.addEventListener('keyup', () => {
                window.inputSearchDebounce && window.clearTimeout(window.inputSearchDebounce);
                window.inputSearchDebounce = setTimeout(async () => {
                    let list = await field.service.retrieve(elements.input.value);

                }, 600);
            })
        }
    };
}