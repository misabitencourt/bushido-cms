import '../../../node_modules/npm-dom-helper/index'
import routes from './routes/index'
import msg from './dialogs/msg'

export default function routeChange (el, routeChange) {
    let route = window.location.hash;
    const currentUser = window.sessionStorage.user;

    if (! currentUser) {
        route = '#/login';
    }

    const render = el => {
        const routeFn = routes.find(r => r.route === route);
        if (! routeFn) {
            return window.location = '#/home';
        }
        routeFn.render(el);
        if (sessionStorage.flash) {            
            const msgData = JSON.parse(sessionStorage.flash);
            msg(msgData.msg, msgData.type);
            sessionStorage.flash = '';
        }
    }

    if (! render) {
        return console.error('Route not found');
    }

    render(el);

    if (routeChange) {
        window.addEventListener('hashchange', e => routeChange(el, true));
    }
}

