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

const screens = [
    {name: 'user', label: 'Usuários'}
];

var inputAcl = meta => ({tag: 'div', className: 'acl-wrp', children: screens.map(screen => {
    return {tag: 'div', className: 'col-md-3', children: [
        {tag: 'label', children: [
            {tag: 'input', attrs: {type: 'checkbox', name: screen.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                el.dataset.acl = '1';
            }},
            {tag: 'span', textContent: screen.label}
        ]}
    ]}
})})

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-success', attrs: {type: 'submit', value: meta.label, placeholder: meta.placeholder || ''}};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', name: meta.name, placeholder: meta.placeholder || ''}};
        case 'acl':
            return inputAcl(meta);
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder || ''}};
    }
}

var form = ({fields, fieldCol, onSubmit}) => ({
    tag: 'form', 
    className: 'row', 
    children: fields.map(f => {
        if (f.type === 'submit') {
            return {tag: 'div', className: 'col-md-12', children: [
                createField(f)
            ]};
        }

        return {tag: 'div', className: `form-group col-md-${fieldCol || 4}`, children: [
            {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
            createField(f)
        ]};
    }), 

    bootstrap: el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            let data = {};        
            const fields = getEls(el, 'input, select, textarea').filter(el => el.type !== 'submit');

            fields.filter(input => !input.dataset.skipbind).forEach(input => {
                data[input.name] = input.value || input.innerHTML;
            });

            let acl = '';
            fields.filter(input => input.dataset.acl).forEach(input => {
                acl += input.checked ? `${input.name};` : '';
            });
            if (acl) {
                data.acl = acl;
            }

            onSubmit(data, e);
        });
    }
})

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

var login$1 = {
    route: '#/login',
    render(el) {
        login(el);
    }
}

var menus = [
    {id: 'users', name: 'Usuários', location: '#/users'}
]

var template = (el, children) => createEls('div', 'app-wrp', el, [
    
    // TODO menu
    {tag: 'nav', className: 'navbar navbar-dark bg-dark', children: [
        {tag: 'div', className: 'collapse navbar-collapse', children: [
            {tag: 'ul', className: 'navbar-nav mr-auto', children: menus.map(menu => {
                return {tag: 'li', className: 'nav-item', children: [
                    {tag: 'a', className: 'nav-link', attrs: {href: menu.href}, textContent: menu.name}
                ], bootstrap: el => el.dataset.menu = menu.id}
            })}
        ]}
    ]},


    {tag: 'div', className: 'container mt-3', children: children}

]);



/*

<div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
    </ul>
    <span class="navbar-text">
      Navbar text with an inline element
    </span>
  </div>

*/

var config = {
    API_URL: 'http://localhost:3000'
}

var headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

var service = {

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/user/${encodeURIComponent(search)}`);
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/user/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });

        let newUser = await response.json();

        return newUser;
    },


    update: async (id, user) => {
        const params = {id};
        for (let i in user) {
            params[`user_${i}`] = user[i];
        }
        const response = await fetch(config.API_URL, {
            method: 'PUT',
            body: JSON.stringify(params)
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/user/${id}`, {
        headers,
        method: 'DELETE'
    })

}

var grid = async ({columns, loadData, onEdit, onDelete}) => {
    const table = document.createElement('table');
    table.className = 'table table-bordered table-stripped';

    table.innerHTML = `
        <thead>
            <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
            </tr>
        </thead>
        <tbody>            
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    let data = await loadData();

    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach(column => {
            const tableData = document.createElement('td');
            tableData.textContent = column.prop(item);
            row.appendChild(tableData);
        });

        const actionsTableData = document.createElement('td');

        if (onEdit) {
            const editLink = document.createElement('a');
            editLink.textContent = 'Editar';
            editLink.addEventListener('click', e => {
                e.preventDefault();
                onEdit(item);
            });
            actionsTableData.appendChild(editLink);
        }

        if (onDelete) {
            const deleteLink = document.createElement('a');
            deleteLink.textContent = 'Deletar';
            deleteLink.addEventListener('click', e => {
                e.preventDefault();
                onDelete(item);
            });
            actionsTableData.appendChild(deleteLink);
        }

        row.appendChild(actionsTableData);
        tbody.appendChild(row);
    });

    return table;
}

const dataToForm = (data, form) => {
    for (let i in data) {
        let input = form.querySelector(`[name="${i}"]`);
        if (! input) {
            continue;
        }
        if (input.tagName === 'TEXTAREA') {
            input.innerHTML = data[i];
        } else {
            input.value = data[i];
        }
    }

};

const render = el => {
    template(el);

    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'E-mail', name: 'email'},
            {type: 'text', label: 'Telefone', name: 'phone'},
            {type: 'text', label: 'Senha', name: 'password'},
            {type: 'acl', label: 'Acesso', name: 'acl'},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            if (e.target.dataset.id) {
                // TODO
            } else {
                service.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário salvo com sucesso'
                    });
                    window.location.reload();                    
                });
            }
        }
    });
        
    const mainEl = createEls('div', '', el, [
        {tag: 'h2', textContent: 'Cadastro de usuários'},
        formObj,
        {tag: 'div', className: 'p-4'},
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ]);

    formEl = mainEl.querySelector('form');

    const loadData = () => service.retrieve(searchInput.value);

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: user => user.name },
                {label: 'E-mail', prop: user => user.email },
                {label: 'Telefone', prop: user => user.phone }
            ],

            loadData() {
                return loadData() 
            },
    
            onEdit(user) {
                dataToForm(user, formEl);
                user.acl.split(';').forEach(resource => {
                    const el = getEls(formEl, 'input[type="checkbox"]').find(input => {
                        return input.dataset.acl && input.name === resource;
                    });
                    if (el) {
                        el.checked = true;
                    }
                });
            },
    
            onDelete(user) {
                service.destroy(user.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário excluído com sucesso'
                    });
                    window.location.reload();    
                });
            }
        });
        mainEl.appendChild(gridEl);
    };

    renderGrid();
};

var users = {
    route: '#/users',
    render(el) {
        render(el);
    }
}

var routes = [
    login$1,
    users
]

var index$1 = (el, routeChange) => {
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

return index$1;

}());
