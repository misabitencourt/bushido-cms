import getCurrentUser from '../common/current-user';

const menus = [
    {id: 'user', name: 'Usuários', tooltip: 'Cadastro de usuários', onclick() {
        window.location = '#/users';
    }},

    {id: 'menu', name: 'Menus', tooltip: 'Cadastro de menus', onclick() {
        window.location = '#/menus';
    }},

    {id: 'article', name: 'Artigos', tooltip: 'Cadastro de artigos', onclick() {
        window.location = '#/articles';
    }},

    {id: 'product', name: 'Produtos', tooltip: 'Cadastro de produtos', onclick() {
        window.location = '#/products';
    }},

    {id: 'macros', name: 'Macros', tooltip: 'Textos gerais', onclick() {
        window.location = '#/macros';
    }}
];

export default {

    getAcl() {
        if (! this.acl) {
            this.acl = getCurrentUser().acl.split(';').filter(acl => !!acl);
        }

        return this.acl;
    },

    getMainMenu() {
        const acl = this.getAcl();
        return menus.filter(menu => acl.indexOf(menu.id) !== -1);
    }

}