import icon from './icon';

const fixedItems = [
    {tag: 'li', className: 'nav-item menu-toggle pt-3 pl-4 mb-3 hidden-desktop', children: [
        icon('menu', 32, 24)
    ], bootstrap: el => {
        el.addEventListener('click', () => {
            el.parentElement.classList.toggle('mobile-open');
        });
    }},

    {tag: 'li', className: 'nav-item menu-close pt-3 pl-4 mb-3 hidden-desktop', children: [
        icon('cancel', 32, 24)
    ], bootstrap: el => {
        el.addEventListener('click', () => {
            el.parentElement.classList.toggle('mobile-open');
        });
    }}
];

export default menus => ({
    tag: 'ul',
    className: 'nav nav-tabs bg-primary',
    children: fixedItems.concat(menus.map(menu => ({
        tag: 'li',
        className: 'nav-item',
        children: [
            {tag: 'a', className: `nav-link ${menu.active ? 'active' : ''}`, 
                textContent: menu.name,
                attrs: {href: 'javascript:;'}, on: ['click', menu.onclick], title: menu.tooltip}
        ]
    })))
})

