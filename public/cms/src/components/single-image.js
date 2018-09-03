import icon from './icon';

const render = (el, selected=null) => {
    el.innerHTML = '';

    return createEls('div', 'input-image-inner', el, [
        selected ? {} : {tag: 'span'},

        {tag: 'div', className: 'pt-2 text-md-center', children: [
            {tag: 'button', className: 'btn btn-sm btn-primary', on: ['click', () => {
                // TODO
            }], children: [icon('add', 24, 24)]},

            {tag: 'button', className: 'btn btn-sm btn-primary', on: ['click', () => {
                // TODO
            }], children: [icon('remove', 24, 24)]}
        ]}
    ]);
}


export default render;