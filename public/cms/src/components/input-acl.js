const screens = [
    {name: 'user', label: 'Usuários'}
]

export default meta => ({tag: 'div', className: 'acl-wrp', children: screens.map(screen => {
    return {tag: 'div', className: 'col-md-3', children: [
        {tag: 'label', children: [
            {tag: 'input', attrs: {type: 'checkbox', name: screen.name}, bootstrap(el) {
                el.dataset.skipbind = '1'
                el.dataset.acl = '1'
            }},
            {tag: 'span', textContent: screen.label}
        ]}
    ]}
})})