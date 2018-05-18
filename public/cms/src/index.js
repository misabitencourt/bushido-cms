import '../../../node_modules/npm-dom-helper/index'
import routes from './routes/index'

export default function routeChange (el, routeChange) {
    let route = window.location.hash;
    const currentUser = window.sessionStorage.user;

    // if (! currentUser) {
    //     route = '#/login';
    // }

    const render = (routes.find(r => r.route === route) || {}).render;
    if (! render) {
        return console.error('Route not found');
    }

    render(el);

    if (routeChange) {
        window.addEventListener('hashchange', e => routeChange(el, true));
    }
}

