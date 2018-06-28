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
    {name: 'user', label: 'Usuários'},
    {name: 'menu', label: 'Menus'},
    {name: 'article', label: 'Artigos'},
    {name: 'product', label: 'Produtos'}
];

var inputAcl = meta => ({tag: 'div', className: 'acl-wrp', children: screens.map(screen => {
    return {tag: 'div', className: 'col-md-3', children: [
        {tag: 'label', children: [
            {tag: 'input', attrs: {type: 'checkbox', name: `acl_${screen.name}`, skipbind: 1, acl: 1}},
            {tag: 'span', textContent: screen.label}
        ]}
    ]}
})})

const emitter = mitt();

const addEvent = (evt, fn) =>  {
    emitter.on(evt, fn);
};

const emitEvent = (evt, data) => {
    emitter.emit(evt, data);
};

document.body.addEventListener('click', () => {
    getEls(document.body, '.dismissable').forEach(el => killEl(el));
});

const defaults = {
    // onChange: html => console.log(html),
    defaultParagraphSeparator: 'div',
    styleWithCSS: false,
    actions: [
        'bold',
        'underline',
        'italic',
        'olist',
        'ulist',
        'line',
        'link',
        'heading1',
        'heading2',
        {
            name: 'image',
            icon: 'Imagem',
            title: 'Adicionar imagem',
            result: () => {
                selectImage({
                    btnOkText: 'OK', 
                    btnCancelText: 'Cancel',
                    forceFile: true,
                    selectDeviceText: 'Select device'
                }).then(image => {
                    var img = new Image();
                    img.src = image;
                    const contentElement = element.querySelector('.pell-content');
                    contentElement.appendChild(img);
                });
            }
        }
    ],

    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    }
};

var wysiwyg = (el, name, options) => {
    const data = Object.assign({}, defaults);

    if (options) {
        Object.assign(data, options);
    }

    data.element = el;
    pell.init(data);
    addEvent('form:edit', data => {
        if (el && el.parentElement && (! data[name])) {
            return;
        }
        el.innerHTML = data[name];
    });
}

var icon = (name, width, height, events) => ({
    tag: 'img',
    attrs: {
        src: `img/${name}.svg`,
        width: width || 16,
        height: height || 16
    },
    on: events
});

var singleEntity = field => {
    let ddMenu;

    if (! field.service) {
        console.error(field, 'You forgot the service');
        return {tag: 'div'};
    }

    if (! field.descriptionField) {
        console.error(field, 'You forgot the descriptionField');
        return {tag: 'div'};
    }

    const elements = {};

    function cleanInput() {
        elements.input.value = '';
        elements.input.disabled = false;
        elements.mainEl.dataset.value = '';
        addClass(elements.remove, 'hidden');
        elements.input.focus();
    }
    
    return {
        tag: 'div', 
        className: 'row',
        children: [
            {tag: 'div', className: 'col-md-10', children: [
                {tag: 'input', className: 'form-control', bootstrap(el) {
                    elements.input = el;
                }}
            ]},
            {tag: 'div', className: 'col-md-2 hidden', 
                children: [icon('delete', 16, 16)], bootstrap(el) {
                elements.remove = el;
                el.addEventListener('click', () => cleanInput());
                addEvent('form:reset', () => cleanInput());
            }}
        ],
        bootstrap(el) {
            elements.mainEl = el;
            el.dataset.name = field.name;

            function addItem(item) {
                const textContent = item[field.descriptionField];
                killEl(ddMenu);
                el.dataset.value = item.id;
                elements.input.disabled = true;
                elements.input.value = textContent;
                removeClass(elements.remove, 'hidden');
            }

            addEvent('form:edit', data => {
                const obj = data[field.name];
                if (obj && obj.id) {
                    addItem(obj);
                }
            });

            elements.input.addEventListener('keyup', () => {
                window.inputSearchDebounce && window.clearTimeout(window.inputSearchDebounce);
                window.inputSearchDebounce = setTimeout(async () => {
                    if (ddMenu) {
                        killEl(ddMenu);
                    }

                    if (! elements.input.value) {
                        return;
                    }

                    let list = await field.service.retrieve(elements.input.value);  
                    
                    if (! list.length) {
                        return;
                    }

                    ddMenu = createEls('div', 'dropdown-menu show dismissable', el, list.map(item => {
                        const textContent = item[field.descriptionField];
                        return {
                            tag: 'a', 
                            className: 'dropdown-item', 
                            attrs: {href: 'javascript:;'}, 
                            textContent,
                            on: ['click', () => addItem(item)]
                        }
                    }));
                }, 600);
            });
        }
    };
}

var imageList = (el, field) => {
    let imageContainer;

    const mainWrp = createEls('div', 'row', el, [
        {tag: 'div', className: 'col-md-10'},
        {tag: 'div', className: 'col-md-2', children: [
            {tag: 'span', textContent: 'Add', on: ['click', () => {
                selectImage({
                    btnOkText: 'OK', 
                    btnCancelText: 'Cancel',
                    forceFile: true,
                    selectDeviceText: 'Select device'
                }).then(image => {
                    const imageWrp = createEls('div', '', imageContainer, [
                        {tag: 'div', bootstrap(el) {
                            el.style.position = 'absolute';
                        }, children: [
                            {tag: 'span', bootstrap(el) {
                                el.style.background = 'rgba(255, 255, 255, 0.6)';
                                el.style.padding = '1rem';
                                el.style.cursor = 'pointer';
                            }, children: [
                                icon('delete', 16, 16)
                            ], on: ['click', () => {
                                emitEvent('form:multiple-images-delete', field);
                                killEl(imageWrp);
                            }]}
                        ]},
                        {tag: 'img', attrs: {src: image}, bootstrap(el) {
                            el.dataset.fieldName = field.name;
                            el.style.height = `180px`;
                        }}
                    ]);
                    
                    imageWrp.style.overflowX = `hidden`;
                    imageWrp.style.width = `100%`;
                    imageWrp.style.maxWidth = `180px`;
                    imageWrp.style.display = `inline-block`;
                    imageWrp.style.marginRight = `1rem`;
                });
            }]}
        ]},

        {tag: 'div', className: 'col-md-12 p-1'},

        {tag: 'div', className: 'col-md-12', bootstrap: el => imageContainer = el}
    ]);

    el.appendChild(mainWrp);
}

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-outline-success mr-2', attrs: {type: 'submit', 
                            value: meta.label, placeholder: meta.placeholder || ''}};
        case 'cancel':
            return {tag: 'button', className: 'btn btn-outline-secondary', attrs: {type: 'reset', 
                            placeholder: meta.placeholder || ''}, textContent: meta.label};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', 
                            name: meta.name, placeholder: meta.placeholder || ''}};
        case 'wysiwyg':
            return {tag: 'div', className: 'input-wysiwyg border', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                wysiwyg(el, meta.name);
            }};

        case 'single-entity':
            return {tag: 'div', className: 'single-entity', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                createEls('div', 'single-entity-container', el, [singleEntity(meta)]);
            }};

        case 'image-list':
            return {tag: 'div', className: 'image-list', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                imageList(el, meta);
            }};

        case 'acl':
            return inputAcl(meta);
            
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder || ''}};
    }
}

var form = ({fields, fieldCol, onSubmit}) => ({
    tag: 'form', 
    className: 'row p-2', 
    children: fields.map(f => {
        if (f.type === 'submit') {
            return {tag: 'div', className: 'col-md-12', children: [
                createField(f),
                createField({type: 'cancel', label: 'Cancelar'})
            ]};
        }

        return {tag: 'div', className: `form-group col-md-${f.fieldCol || fieldCol || 4}`, children: [
            {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
            createField(f)
        ]};
    }), 

    bootstrap: el => {
        el.addEventListener('reset', () => emitEvent('form:reset'));
        el.addEventListener('submit', e => {
            e.preventDefault();
            let data = {};        
            const fields = getEls(el, 'input, select, textarea').filter(el => el.type !== 'submit');

            fields.filter(input => !input.dataset.skipbind).forEach(input => {
                data[input.name] = input.value || input.innerHTML;
            });

            let acl = '';
            fields.filter(input => input.getAttribute('acl')).forEach(input => {
                acl += input.checked ? `${input.name.replace('acl_', '')};` : '';
            });
            if (acl) {
                data.acl = acl;
            }

            onSubmit(data, e);
        });
    }
})

var config = {
    API_URL: 'http://localhost:3000'
}

const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
};

if (sessionStorage.token) {
    headers['Auth-Token'] = sessionStorage.token;
}

var service = {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.email) {
            errors += ' Informe o e-mail.';
        }

        if (! data.phone) {
            errors += ' Informe o telefone.';
        }

        if (! data.password) {
            errors += ' Informe a senha.';
        }

        return errors;
    },

    login: async auth => {
        const response = await fetch(`${config.API_URL}/cms/login`, {
            headers,
            method: 'POST',
            body: JSON.stringify(auth)
        });        
        const json = await response.json();
        if (! json.token) {
            return null;
        }
        sessionStorage.user = JSON.stringify(json);
        sessionStorage.token = json.token;
        
        return json;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/user/${encodeURIComponent(search)}`, {headers});
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
            params[`${i}`] = user[i];
        }
        const response = await fetch(`${config.API_URL}/cms/user/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/user/${id}`, {
        headers,
        method: 'DELETE'
    })

}

var msg = (txt, type) => {
    const alert = createEls('div', `alert alert-${type} fade show`, document.body, [], txt);
    alert.style.position = 'fixed';
    alert.style.zIndex = '99999';
    alert.style.right = '13px';
    alert.style.bottom = '13px';
    setTimeout(() => document.body.removeChild(alert), 5e3);
}

var error = txt => msg(txt, 'danger')

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
                            onSubmit(auth) {                                
                                service.login(auth).then(user => {
                                    if (! user.token) {
                                        return error('Usuário ou senha inválidos');
                                    }
                                    window.location.reload();
                                });
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

var topnav = menus => ({
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

let currentUser;

function getCurrentUser() {
    if (! currentUser) {
        currentUser = JSON.parse(sessionStorage.user);
    }

    return currentUser;
}

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
    }}
];

var menuService = {

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

var template = (child, currentMenuId = '') => {
    const menus = menuService.getMainMenu();
    menus.forEach(m => m.active = false);
    const currentMenu = menus.find(m => m.id === currentMenuId);
    
    if (currentMenu) {
        currentMenu.active = true;
    }

    return createEls('div', 'app-wrp', document.body, [    
        topnav(menus),    
        {tag: 'div', className: 'container', children: [
            {tag: 'div', className: 'p-3', bootstrap(el) {
                el.appendChild(child);
            }}
        ]}    
    ])
}

var grid = async ({columns, loadData, onEdit, onDelete}) => {
    const table = document.createElement('table');
    table.className = 'table table-bordered table-stripped';

    table.innerHTML = `
        <thead class="thead-dark">
            <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
                <th></th>
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
            editLink.href = 'javascript:;';
            editLink.style.marginRight = '13px';
            editLink.textContent = 'Editar';
            editLink.addEventListener('click', e => {
                e.preventDefault();
                onEdit(item);
            });
            actionsTableData.appendChild(editLink);
        }

        if (onDelete) {
            const deleteLink = document.createElement('a');
            deleteLink.href = 'javascript:;';
            deleteLink.style.marginRight = '13px';
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

    // ACLs
    const checkboxes = Array.from(form.querySelectorAll('input[type=checkbox]')).filter(input => {
        return input.name.indexOf('acl_') === 0;
    });
    if (checkboxes.length) {
        checkboxes.forEach(chk => chk.checked = false);
        const acls = (data.acl || '').split(';');
        acls.forEach(acl => {
            const checkbox = checkboxes.find(chk => chk.name === `acl_${acl}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    // Multiple images
    Array.from(form.querySelectorAll('.image-list')).forEach(imageWrp => {
        Array.from(imageWrp.querySelectorAll('img[data-field-name]')).forEach(img => {
            data[img.dataset.fieldName] = data[img.dataset.fieldName] || [];
            data[img.dataset.fieldName].push(img.src);
        });
    });
    
    emitEvent(`form:edit`, data);
};

const render = appEl => {
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
            const errors = service.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Usuário atualizado com sucesso'
                    });
                    window.location.reload();
                });
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
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de usuários'},
        formObj,
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [
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
                return loadData();
            },
    
            onEdit(user) {
                dataToForm(user, formEl);
                formEl.dataset.id = user.id;
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

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'user'));
};

var users = {
    route: '#/users',
    render(el) {
        render(el);
    }
}

var menuSrv = {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/menu/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/menu/`, {
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
            params[`${i}`] = user[i];
        }
        const response = await fetch(`${config.API_URL}/cms/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/menu/${id}`, {
        headers,
        method: 'DELETE'
    })

}

const render$1 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'Descrição', name: 'description'},
            {type: 'number', label: 'Ordem', name: 'order'},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            const errors = menuSrv.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                menuSrv.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Menu atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                menuSrv.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Menu salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de menus do site'},
        formObj,
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ]);

    formEl = mainEl.querySelector('form');
    const loadData = () => menuSrv.retrieve(searchInput.value);    

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: menu => menu.name },
                {label: 'Descrição', prop: menu => menu.description },
                {label: 'Ordem', prop: menu => menu.order }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(menu) {
                dataToForm(menu, formEl);
                formEl.dataset.id = menu.id;
            },
    
            onDelete(menu) {
                menuSrv.destroy(menu.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Menu excluído com sucesso'
                    });
                    window.location.reload();    
                });
            }
        });
        mainEl.appendChild(gridEl);
    };

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'menu'));
};

var menus$1 = {
    route: '#/menus',
    render(el) {
        render$1(el);
    }
}

var service$1 = {

    validate(data) {
        let errors = '';

        if (! data.title) {
            errors += ' Informe o título.';
        }

        if (! data.description) {
            errors += ' Informe a descrição.';
        }

        if (! data.text) {
            errors += ' Digite um texto.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/article/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/article/`, {
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
            params[`${i}`] = user[i];
        }
        const response = await fetch(`${config.API_URL}/cms/article/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/article/${id}`, {
        headers,
        method: 'DELETE'
    })

}

const render$2 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'Descrição', name: 'description'},
            {type: 'single-entity', label: 'Menu', name: 'menu', etity: 'menu', service: menuSrv, descriptionField: 'name'},
            {type: 'wysiwyg', name: 'text', fieldCol: 12},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            const errors = service$1.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service$1.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Artigo atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service$1.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Artigo salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Artigos'},
        formObj,
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$1.retrieve(searchInput.value);    

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: article => article.name },
                {label: 'Descrição', prop: article => article.description },
                {label: 'Menu', prop: article => (article.menu || {}).name || '' }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(article) {
                dataToForm(article, formEl);
                formEl.dataset.id = article.id;
            },
    
            onDelete(article) {
                service$1.destroy(article.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'article excluído com sucesso'
                    });
                    window.location.reload();    
                });
            }
        });
        mainEl.appendChild(gridEl);
    };

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'article'));
};

var articles = {
    route: '#/articles',
    render(el) {
        render$2(el);
    }
}

var homePage = appEl => {
    const wrpEl = document.createElement('div');

    createEls('div', 'home-page', wrpEl, [
        {tag: 'h1', textContent: 'Bem vindo'},
        {tag: 'p', textContent: 'Através deste sistema você poderá modificar as informações que serão exibidas no website.'},
        {tag: 'p', textContent: 'Utilize a ferramenta com prudência.'}
    ]);

    appEl.appendChild(template(wrpEl, 'home'));
}

var home = {
    home: true,
    route: '#/home',
    render(el) {
       homePage(el);
    }
}

var service$2 = {

    validate(data) {
        let errors = '';

        if (! data.name) {
            errors += ' Informe o nome.';
        }

        if (! data.short_description) {
            errors += ' Informe a descrição curta.';
        }

        if (! (data.photos && data.photos.length)) {
            errors += ' Selecione uma foto.';
        }

        return errors;
    },

    retrieve: async search => {
        let response = await fetch(`${config.API_URL}/cms/product/${encodeURIComponent(search)}`, {headers});
        let json = await response.json();
        return json;
    },


    create: async user => {
        const response = await fetch(`${config.API_URL}/cms/product/`, {
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
            params[`${i}`] = user[i];
        }
        const response = await fetch(`${config.API_URL}/cms/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = await response.json();

        return newUser;
    },


    destroy: async id => fetch(`${config.API_URL}/cms/product/${id}`, {
        headers,
        method: 'DELETE'
    }),

    destroyImage: async id => fetch(`${config.API_URL}/cms/product/image/${id}`, {
        headers,
        method: 'DELETE'
    })

}

const render$3 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [
            {type: 'text', label: 'Nome', name: 'name'},
            {type: 'text', label: 'Descrição', name: 'short_description'},
            {type: 'wysiwyg', name: 'long_description', fieldCol: 12},
            {type: 'image-list', name: 'photos', label: 'Fotos', fieldCol: 12},
            {type: 'submit', label: 'Salvar'}
        ],
        onSubmit(data, e) {
            const errors = service$2.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service$2.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Produto atualizado com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service$2.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Produto salvo com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });
        
    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [
        {tag: 'h2', textContent: 'Cadastro de Produtos'},
        formObj,
        {tag: 'div', className: 'row', children: [
            {tag: 'div', className: 'col-md-8'},
            {tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [
                {tag: 'input', className: 'form-control', attrs: {placeholder: 'Pesquisar'},
                    bootstrap: el => searchInput = el}
            ]}
        ]}
    ]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$2.retrieve(searchInput.value);    

    const renderGrid = async () => {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = await grid({
            columns: [
                {label: 'Nome', prop: product => product.name },
                {label: 'Descrição curta', prop: product => product.description }
            ],

            loadData() {
                return loadData();
            },
    
            onEdit(product) {
                dataToForm(product, formEl);
                formEl.dataset.id = product.id;
            },
    
            onDelete(product) {
                service$2.destroy(product.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'product excluído com sucesso'
                    });
                    window.location.reload();    
                });
            }
        });
        mainEl.appendChild(gridEl);
    };

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'product'));
};

var products = {
    route: '#/products',
    render(el) {
        render$3(el);
    }
}

var routes = [
    login$1,
    users,
    menus$1,
    articles,
    products,
    home
]

function routeChange (el, hasRouteChange) {
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
    };

    if (! render) {
        return console.error('Route not found');
    }

    render(el);

    if (! hasRouteChange) {
        window.addEventListener('hashchange', e => {
            el.innerHTML = '';
            routeChange(el, true);
        });
    }
}

return routeChange;

}());
