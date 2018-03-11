var cms = (function () {
'use strict';

window.getEl = (el, ref) => {
    el = el || window.document.body;
    let result = el.querySelector(`[data-ref='${ref || ''}']`);
    if (result) {
        return result
    }

    return el.querySelector(ref)
};

window.getParent = (el, selector) => {
    if (! (el && selector)) {
        return null;
    }

    let parent = el.parentElement;
    do {
        if (! parent) {
            return null;
        } else if (parent.matches(selector)) {
            return parent;
        }
        parent = parent.parentElement;
    } while (true);
};

window.getParents = (el, selector) => {
    let result = [];

    if (! (el && selector)) {
        return result;
    }

    let parent = el.parentElement;
    while (parent) {        
        parent.matches(selector) && result.push(parent);        
        parent = parent.parentElement;
    }

    return result;
};

window.elUpLevel = (el, levels) => {
    if (!(el && levels) || isNaN(levels) || levels<0) {
        return el
    }

    let result = el;
    for (let i=0; i<levels; i++) {
        result = result.parentElement || result;
    }

    return result;
};

window.limitText = (str, size, onlyXs, removeDots) => {
    if (onlyXs && (window.innerWidth > 600)) {
        size *= 2;
    }

    if (str.length < size) {
        return str
    }

    return `${str.substr(0, size-1)}${removeDots ? '' : '...'}`
};

window.elClassToggle = (el, className) => {
    if (! (el && className)) {
        return
    }
    if (el.classList && el.classList.toggle) {
        return el.classList.toggle(className)
    }
    
    // Damn IE10
    el.className = el.className.indexOf(className) === -1 ?
                    (el.className += ` ${className}`) :
                    el.className.split(className).join('');
};

window.hasClass = (el, className) => {
    return (el.className || '').indexOf(className) !== -1
};

window.addClasses = (els, className) => {
    els.forEach((el) => addClass(el, className));
};

window.removeClasses = (els, className) => {
    els.forEach((el) => removeClass(el, className));
};

window.addClass = (el, className) => {
    if (! (el && className)) {
        return;
    }

    el.className = el.className || '';
    el.className += ` ${className}`;

    return el;
};

window.removeClass = (el, className) => {
    if (! (el && className)) {
        return;
    }

    el.className = el.className || '';
    el.className = el.className.split(className).join('');

    return el;
};

window.getEls = (el, selector) => {
    if (! (el && selector)) {
        return;
    }

    let result = [];
    let els = el.querySelectorAll(selector);
    for (let i=0; i<els.length; i++) {
        result.push(els[i]);
    }

    return result
};

window.killEl = (el) => {
    if (! (el && el.parentElement)) {
        return;
    }

    el.parentElement.removeChild(el);
};

window.killEls = (els) => {
    els.forEach((el) => killEl(el));
};

window.createEl = (tagName, className, parent, textContent) => {
    let el = document.createElement(tagName);
    el.className = className || '';
    if (textContent) {
        el.textContent = textContent;
    }
    parent.appendChild(el);

    return el;
};

window.createEls = (tagName, className, parent, childs, textContent) => {
    let el = createEl(tagName, className, parent, textContent);

    (parent || document.body).appendChild(el);
    (childs || []).forEach((child) => {
        let childEl = createEls(child.tag, child.className, 
                                el, child.children, child.textContent);
        if (child.bootstrap) {
            child.bootstrap(childEl);
        }
        if (child.on && child.on.length === 2) {
            childEl.addEventListener(child.on[0], child.on[1].bind(child));
        }
        if (child.type) {
            childEl.type = child.type;
            childEl.name = child.name;
        }
        if (child.attrs) {
            for (let i in child.attrs) {
                childEl.setAttribute(i, child.attrs[i]);
            }
        }
    });
    
    return el
};

window.elRemoveEvt = (el) => {
    let clone = el.cloneNode();
    clone.innerHTML = el.innerHTML;
    if (! el.parentNode) {
        return null
    }
    el.parentNode.replaceChild(clone, el);

    return clone
};

var card = ({title, body}) => ({tag: 'div', className: 'card', children: [
    {tag: 'div', className: 'card-body', children: [
        {tag: 'h5', className: 'card-title', textContent: title},
        {tag: 'div', className: 'card-body', children: body}
    ]}
]})

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-success', attrs: {type: 'submit', value: meta.label, placeholder: meta.placeholder}};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', name: meta.name, placeholder: meta.placeholder}};
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder}};
    }
}

var form = ({fields, fieldCol, onSubmit}) => ({tag: 'form', children: fields.map(f => {
    if (f.type === 'submit') {
        return createField(f);
    }

    return {tag: 'div', className: `form-group col-md-${fieldCol || 4}`, children: [
        {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
        createField(f)
    ]};
}), bootstrap(el) {
    el.addEventListener('submit', e => {
        e.preventDefault();
        onSubmit();
    });
}})

var login = el => createEls('div', 'app-wrp container', el, [
    {tag: 'div', className: 'login-wrp', children: [
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-4'},
            {tag: 'div', className: 'col-md-4 text-md-center', children: [
                card({
                    title: 'Login',
                    body: [
                        form({
                            fieldCol: 12,
                            fields: [
                                {type: 'email', name: 'email', placeholder: 'E-mail', required: true},
                                {type: 'password', name: 'passwd', placeholder: 'Senha', required: true},
                                {type: 'submit', name: 'submit', label: 'Entrar'}
                            ],
                            onSubmit() {
                                
                            }
                        })
                    ]
                })
            ]},            
            {tag: 'div', className: 'col-md-4'}
        ]}
    ], bootstrap(el) {
        if (window.innerHeight > 500) {
            el.style.paddingTop = '13%';
        }
    }}
]);


// <div class="card" style="width: 18rem;">
//   <div class="card-body">
//     <h5 class="card-title">Card title</h5>
//     <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//     <a href="#" class="card-link">Card link</a>
//     <a href="#" class="card-link">Another link</a>
//   </div>
// </div>

var login$1 = {
    route: '#/login',
    render(el) {
        login(el);
    }
}

var routes = [
    login$1
]

var index$1 = (el, routeChange) => {
    let route = window.location.hash;
    const currentUser = window.sessionStorage.user;

    if (! currentUser) {
        route = '#/login';
    }

    const render = (routes.find(r => r.route === route) || {}).render;
    if (! render) {
        return console.error('Route not found');
    }

    render(el);

    if (routeChange) {
        window.addEventListener('hashchange', e => routeChange(el, true));
    }
}

return index$1;

}());
