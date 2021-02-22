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
    }},

    {id: 'new', name: 'Notícias', tooltip: 'Notícias do portal', onclick() {
        window.location = '#/news';
    }},

    {id: 'cover', name: 'Capas', tooltip: 'Fotos de capa', onclick() {
        window.location = '#/covers';
    }},

    {id: 'event', name: 'Eventos', tooltip: 'Calendário de eventos', onclick() {
        window.location = '#/events';
    }},

    {id: 'team-member', name: 'Equipe', tooltip: 'Cadastrar perfis da equipe', onclick() {
        window.location = '#/team-members';
    }},

    {id: 'galleries', name: 'Galerias', tooltip: 'Cadastrar galerias de fotos', onclick() {
        window.location = '#/galleries';
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