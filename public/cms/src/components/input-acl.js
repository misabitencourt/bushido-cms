const screens = [
    {name: 'user', label: 'Usuários'},
    {name: 'menu', label: 'Menus'},
    {name: 'article', label: 'Artigos'},
    {name: 'product', label: 'Produtos'}
];

export default meta => ({tag: 'div', className: 'col-md-12', children: screens.map(screen => {
    return {tag: 'label', className: 'mr-5', children: [
        {tag: 'input', attrs: {type: 'checkbox', name: `acl_${screen.name}`, skipbind: 1, acl: 1}, className: 'mr-1'},
        {tag: 'span', textContent: screen.label}
    ]};
})});