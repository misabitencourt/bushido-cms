
const menus = [
    {id: 'users', name: 'Usuários', tooltip: 'Cadastro de usuários', onclick() {
        window.location = '#/';
    }}
];

export default {

    getMainMenu() {
        return menus;
    }

}