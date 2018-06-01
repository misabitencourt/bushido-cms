

export default menus => ({
    tag: 'ul',
    className: 'nav nav-tabs bg-primary',
    children: menus.map(menu => ({
        tag: 'li',
        className: 'nav-item',
        children: [
            {tag: 'a', className: `nav-link ${menu.active ? 'active' : ''}`, 
                textContent: menu.name,
                attrs: {href: 'javascript:;'}, on: ['click', menu.onclick], title: menu.tooltip}
        ]
    }))
})

