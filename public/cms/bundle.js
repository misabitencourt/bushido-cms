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

var card = (({ title, body, footer, img }) => ({ tag: 'div', className: 'card', children: [{ tag: 'div', className: 'card-body', children: [{ tag: 'h5', className: 'card-title', textContent: title }, { tag: 'div', className: 'card-body', children: body }, img ? { tag: 'img', attrs: { src: img }, className: 'card-img-top' } : { tag: 'span' }, footer ? { tag: 'div', className: 'card-footer', children: footer } : { tag: 'span' }] }] }));

const screens = [{ name: 'user', label: 'Usuários' }, { name: 'menu', label: 'Menus' }, { name: 'article', label: 'Artigos' }, { name: 'product', label: 'Produtos' }, { name: 'macros', label: 'Macros' }, { name: 'new', label: 'Notícias' }, { name: 'cover', label: 'Capas' }];

var inputAcl = (meta => ({ tag: 'div', className: 'col-md-12', children: screens.map(screen => {
        return { tag: 'label', className: 'mr-5', children: [{ tag: 'input', attrs: { type: 'checkbox', name: `acl_${screen.name}`,
                    skipbind: 1, acl: 1 }, className: 'mr-1' }, { tag: 'span', textContent: screen.label }] };
    }) }));

const emitter = mitt();

const addEvent = (evt, fn) => {
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
    actions: ['bold', 'underline', 'italic', 'olist', 'ulist', 'line', 'link', 'heading1', 'heading2'],

    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    }
};

var wysiwyg = ((el, name, options) => {
    const data = Object.assign({}, defaults);

    data.actions = data.actions.slice();
    data.actions.push({
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
                img.style.maxWidth = '100%';
                const contentElement = el.querySelector('.pell-content');
                contentElement.appendChild(img);
            });
        }
    });

    if (options) {
        Object.assign(data, options);
    }

    data.element = el;
    pell.init(data);
    addEvent('form:edit', data => {
        if (el && el.parentElement && !data[name]) {
            return;
        }
        getEl(el, '[contenteditable]').innerHTML = data[name];
    });

    addEvent('form:reset', data => getEl(el, '[contenteditable]').innerHTML = '');
});

function __async(g) {
  return new Promise(function (s, j) {
    function c(a, x) {
      try {
        var r = g[x ? "throw" : "next"](a);
      } catch (e) {
        j(e);return;
      }r.done ? s(r.value) : Promise.resolve(r.value).then(c, d);
    }function d(e) {
      c(e, 1);
    }c();
  });
}

var icon = ((name, width, height, events) => ({
    tag: 'img',
    attrs: {
        src: `img/${name}.svg`,
        width: width || 16,
        height: height || 16
    },
    on: events
}));

var singleEntity = (field => {
    let ddMenu;

    if (!field.service) {
        console.error(field, 'You forgot the service');
        return { tag: 'div' };
    }

    if (!field.descriptionField) {
        console.error(field, 'You forgot the descriptionField');
        return { tag: 'div' };
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
        children: [{ tag: 'div', className: 'col-md-10', children: [{ tag: 'input', className: 'form-control', bootstrap(el) {
                    elements.input = el;
                } }] }, { tag: 'div', className: 'col-md-2 hidden',
            children: [icon('delete', 16, 16)], bootstrap(el) {
                elements.remove = el;
                el.addEventListener('click', () => cleanInput());
                addEvent('form:reset', () => cleanInput());
            } }],
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
                window.inputSearchDebounce = setTimeout(() => __async(function* () {
                    if (ddMenu) {
                        killEl(ddMenu);
                    }

                    if (!elements.input.value) {
                        return;
                    }

                    let list = yield field.service.retrieve(elements.input.value);

                    if (!list.length) {
                        return;
                    }

                    ddMenu = createEls('div', 'dropdown-menu show dismissable', el, list.map(item => {
                        const textContent = item[field.descriptionField];
                        return {
                            tag: 'a',
                            className: 'dropdown-item',
                            attrs: { href: 'javascript:;' },
                            textContent,
                            on: ['click', () => addItem(item)]
                        };
                    }));
                }()), 600);
            });
        }
    };
});

function createCanvas(dimension) {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = '-99999px';
    canvas.width = dimension.width;
    canvas.height = dimension.height;

    return canvas;
}
var imageResize = ((src, dimension, compress) => new Promise((callback, error) => {
    const image = new Image();

    image.onerror = () => error();

    image.onload = function () {
        let canvas,
            ctx,
            ratio,
            image = this,
            realWidth = image.width,
            realHeight = image.height;

        dimension = dimension || {};
        if (dimension.width > dimension.height) {
            image.width = dimension.width || 800;
            ratio = image.width * 100 / realWidth;
            image.height = realHeight * (ratio / 100);
        } else {
            image.height = dimension.height || 600;
            ratio = image.height * 100 / realHeight;
            image.width = realWidth * (ratio / 100);
        }
        canvas = createCanvas({ width: image.width, height: image.height });
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        callback(canvas.toDataURL('image/jpeg', compress || '0.5'));
        document.body.removeChild(canvas);
    };

    image.src = src;
}));

var imageList = ((el, field) => {
    let imageContainer;
    let inEdition;

    const createImage = (image, id = null) => {
        if (!id && inEdition && field.service && field.service.createImage) {
            field.service.createImage(inEdition, image).then(created => {
                id = created.slice().pop();
            });
        }

        const imageWrp = createEls('div', '', imageContainer, [{ tag: 'div', bootstrap(el) {
                el.style.position = 'absolute';
                el.style.marginTop = '1rem';
            }, children: [{ tag: 'span', bootstrap(el) {
                    el.style.background = 'rgba(255, 255, 255, 0.6)';
                    el.style.padding = '1rem';
                    el.style.cursor = 'pointer';
                }, children: [icon('delete', 16, 16)], on: ['click', () => {
                    emitEvent('form:multiple-images-delete', field);
                    killEl(imageWrp);
                    if (id && field.service && field.service.createImage) {
                        field.service.destroyImage(id);
                    }
                }] }] }, { tag: 'img', attrs: { src: image }, bootstrap(el) {
                el.dataset.fieldName = field.name;
                el.style.height = `180px`;
            } }]);

        imageWrp.style.overflowX = `hidden`;
        imageWrp.style.width = `100%`;
        imageWrp.style.maxWidth = `180px`;
        imageWrp.style.display = `inline-block`;
        imageWrp.style.marginRight = `1rem`;
    };

    const mainWrp = createEls('div', 'row', el, [{ tag: 'div', className: 'col-md-12', bootstrap: el => imageContainer = el }, { tag: 'div', className: 'col-md-12 mt-2 mb-5', children: [{ tag: 'a', attrs: { href: 'javascript:;' }, on: ['click', () => {
                selectImage({
                    btnOkText: 'OK',
                    btnCancelText: 'Cancel',
                    forceFile: true,
                    selectDeviceText: 'Select device'
                }).then(image => {
                    imageResize(image, { width: 800, height: 400 }, 1).then(image => {
                        createImage(image);
                    });
                });
            }], children: [icon('add', 32, 32)] }] }]);

    el.appendChild(mainWrp);

    addEvent('form:reset', () => imageContainer.innerHTML = '');
    addEvent('form:edit', data => {
        inEdition = null;
        if (data.id) {
            inEdition = data.id;
        }
        imageContainer.innerHTML = '';
        const list = data[field.name] || [];
        list.filter(image => image.data).forEach(image => createImage(image.data, image.id));
    });
});

const render = (el, meta, selected = null) => {
    el.innerHTML = '';

    addEvent('form:edit', data => {
        const img = data[meta.name];
        if (img) {
            render(el, meta, img);
        }
    });

    return createEls('div', 'input-image-inner', el, [card({
        img: selected,
        footer: [{ tag: 'div', className: 'pt-2 text-md-center', children: [{ tag: 'button', attrs: { type: 'button' }, className: 'btn btn-sm btn-primary', on: ['click', () => {
                    selectImage({
                        btnOkText: 'OK',
                        btnCancelText: 'Cancel',
                        forceFile: true,
                        selectDeviceText: 'Select device'
                    }).then(image => {
                        imageResize(image, { width: 800, height: 400 }, 1).then(image => {
                            render(el, meta, image);
                        });
                    });
                }], children: [icon('add', 24, 24)] }, { tag: 'button', attrs: { type: 'button' }, className: 'btn btn-sm btn-primary', on: ['click', () => {
                    render(el, meta);
                }], children: [icon('delete', 24, 24)] }] }]
    })]);
};

const ptBrToCommon = str => {
    const split = str.split('/');
    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}-${split[1]}-${split[0]}`;
};

const commonToPtBr = str => {
    const split = str.split('-');
    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}/${split[1]}/${split[0]}`;
};

var inputDate = (meta => ({
    tag: 'input',
    className: 'form-control date',
    attrs: {
        type: 'text',
        placeholder: 'DD/MM/YYYY',
        name: meta.name,
        'data-format': 'DD/MM/YYYY'
    },
    bootstrap(el) {
        addEvent('form:edit', data => {
            const value = data[meta.name];
            if (value) {
                el.value = commonToPtBr(value);
            }
        });

        el.addEventListener('change', e => {
            const dateStr = e.target.value;
            const dateArr = dateStr.split('/');
            if (dateArr.length !== 3) {
                return e.target.value = '';
            }
            const date = new Date(dateArr[0] * 1, dateArr[1] * 1, dateArr[2] * 1);
            if (isNaN(date.getTime())) {
                return e.target.value = '';
            }
        });

        el.addEventListener('keyup', e => {
            if (!el.value) {
                return;
            }

            if ([2, 5].indexOf(el.value.length) === -1) {
                return;
            }

            el.value += '/';
        });
    }
}));

function createField(meta) {
    switch (meta.type) {
        case 'date':
            return inputDate(meta);
        case 'spacing':
            return { tag: 'div' };
        case 'single-image':
            return { tag: 'div', className: 'single-image', attrs: { 'data-attr': meta.name }, bootstrap(el) {
                    el.dataset.skipbind = '1';
                    render(el, meta);
                } };
        case 'number':
            return { tag: 'input', className: 'form-control', attrs: { type: 'number',
                    value: meta.label, placeholder: meta.placeholder || '',
                    min: meta.min, max: meta.max, step: meta.step, name: meta.name } };
        case 'submit':
            return { tag: 'input', className: 'btn btn-outline-success mr-2', attrs: { type: 'submit',
                    value: meta.label, placeholder: meta.placeholder || '' } };
        case 'cancel':
            return { tag: 'button', className: 'btn btn-outline-secondary', attrs: { type: 'reset',
                    placeholder: meta.placeholder || '' }, textContent: meta.label };
        case 'password':
            return { tag: 'input', className: 'form-control', attrs: { type: 'password',
                    name: meta.name, placeholder: meta.placeholder || '' } };
        case 'wysiwyg':
            return { tag: 'div', className: 'input-wysiwyg border', attrs: { 'data-attr': meta.name }, bootstrap(el) {
                    el.dataset.skipbind = '1';
                    wysiwyg(el, meta.name);
                } };

        case 'single-entity':
            return { tag: 'div', className: 'single-entity', attrs: { 'data-attr': meta.name }, bootstrap(el) {
                    el.dataset.skipbind = '1';
                    createEls('div', 'single-entity-container', el, [singleEntity(meta)]);
                } };

        case 'image-list':
            return { tag: 'div', className: 'image-list', attrs: { 'data-attr': meta.name }, bootstrap(el) {
                    el.dataset.skipbind = '1';
                    imageList(el, meta);
                } };

        case 'acl':
            return inputAcl(meta);

        default:
            return { tag: 'input', className: 'form-control', attrs: { type: 'text', name: meta.name, placeholder: meta.placeholder || '' } };
    }
}

var form = (({ fields, fieldCol, onSubmit, hideCancel = false }) => ({
    tag: 'form',
    className: 'row p-2',
    children: fields.map(f => {
        if (f.type === 'submit') {
            return { tag: 'div', className: 'col-md-12', children: [createField(f), hideCancel ? { tag: 'span' } : createField({ type: 'cancel', label: 'Cancelar' })] };
        }

        return { tag: 'div', className: `form-group col-md-${f.fieldCol || fieldCol || 4}`, children: [{ tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label }, createField(f)] };
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

            getEls(el, '[data-value]').forEach(el => data[el.dataset.name] = el.dataset.value);
            getEls(el, '.input-wysiwyg').forEach(el => {
                const contentEditable = getEl(el, '[contenteditable]');
                if (contentEditable) {
                    data[el.dataset.attr] = contentEditable.innerHTML;
                }
            });
            getEls(el, '.image-list img').filter(el => el.dataset.fieldName).forEach(el => {
                data[el.dataset.fieldName] = data[el.dataset.fieldName] || [];
                data[el.dataset.fieldName].push(el.src);
            });
            getEls(el, '.single-image').forEach(imageWrp => {
                const img = getEl(imageWrp, 'img');
                if (!img) {
                    return;
                }
                data[imageWrp.dataset.attr] = img.src;
            });
            getEls(el, 'input.date').forEach(inputDate$$1 => {
                data[inputDate$$1.name] = ptBrToCommon(inputDate$$1.value);
            });

            onSubmit(data, e);
        });
    }
}));

var config = {
    API_URL: 'http://localhost:3000'
};

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

        if (!data.name) {
            errors += ' Informe o nome.';
        }

        if (!data.email) {
            errors += ' Informe o e-mail.';
        }

        if (!data.phone) {
            errors += ' Informe o telefone.';
        }

        if (!data.password) {
            errors += ' Informe a senha.';
        }

        return errors;
    },

    login: auth => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/login`, {
            headers,
            method: 'POST',
            body: JSON.stringify(auth)
        });
        const json = yield response.json();
        if (!json.token) {
            return null;
        }
        sessionStorage.user = JSON.stringify(json);
        sessionStorage.token = json.token;

        return json;
    }()),

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/user/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: user => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/user/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    update: (id, user) => __async(function* () {
        const params = { id };
        for (let i in user) {
            params[`${i}`] = user[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/user/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/user/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

var msg = ((txt, type) => {
    const alert = createEls('div', `alert alert-${type} fade show`, document.body, [], txt);
    alert.style.position = 'fixed';
    alert.style.zIndex = '99999';
    alert.style.right = '13px';
    alert.style.bottom = '13px';
    setTimeout(() => document.body.removeChild(alert), 5e3);
});

var error = (txt => msg(txt, 'danger'));

var login = (el => createEls('div', 'app-wrp container', el, [{ tag: 'div', className: 'login-wrp', children: [{ tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-4' }, { tag: 'div', className: 'col-md-4 text-md-center', children: [card({
                title: 'Login',
                body: [form({
                    fieldCol: 12,
                    fields: [{ type: 'email', name: 'email', placeholder: 'E-mail', required: true }, { type: 'password', name: 'passwd', placeholder: 'Senha', required: true }, { type: 'submit', name: 'submit', label: 'Entrar' }],
                    hideCancel: true,
                    onSubmit(auth) {
                        service.login(auth).then(user => {
                            if (!user.token) {
                                return error('Usuário ou senha inválidos');
                            }
                            window.location.reload();
                        });
                    }
                })]
            })] }, { tag: 'div', className: 'col-md-4' }] }], bootstrap(el) {
        if (window.innerHeight > 500) {
            el.style.paddingTop = '13%';
        }
    } }]));

var login$1 = {
    route: '#/login',
    render(el) {
        login(el);
    }
};

var topnav = (menus => ({
    tag: 'ul',
    className: 'nav nav-tabs bg-primary',
    children: menus.map(menu => ({
        tag: 'li',
        className: 'nav-item',
        children: [{ tag: 'a', className: `nav-link ${menu.active ? 'active' : ''}`,
            textContent: menu.name,
            attrs: { href: 'javascript:;' }, on: ['click', menu.onclick], title: menu.tooltip }]
    }))
}));

let currentUser;

function getCurrentUser() {
    if (!currentUser) {
        currentUser = JSON.parse(sessionStorage.user);
    }

    return currentUser;
}

const menus = [{ id: 'user', name: 'Usuários', tooltip: 'Cadastro de usuários', onclick() {
        window.location = '#/users';
    } }, { id: 'menu', name: 'Menus', tooltip: 'Cadastro de menus', onclick() {
        window.location = '#/menus';
    } }, { id: 'article', name: 'Artigos', tooltip: 'Cadastro de artigos', onclick() {
        window.location = '#/articles';
    } }, { id: 'product', name: 'Produtos', tooltip: 'Cadastro de produtos', onclick() {
        window.location = '#/products';
    } }, { id: 'macros', name: 'Macros', tooltip: 'Textos gerais', onclick() {
        window.location = '#/macros';
    } }, { id: 'new', name: 'Notícias', tooltip: 'Notícias do portal', onclick() {
        window.location = '#/news';
    } }, { id: 'cover', name: 'Capas', tooltip: 'Fotos de capa', onclick() {
        window.location = '#/covers';
    } }];

var menuService = {

    getAcl() {
        if (!this.acl) {
            this.acl = getCurrentUser().acl.split(';').filter(acl => !!acl);
        }

        return this.acl;
    },

    getMainMenu() {
        const acl = this.getAcl();
        return menus.filter(menu => acl.indexOf(menu.id) !== -1);
    }

};

var template = ((child, currentMenuId = '') => {
    const menus = menuService.getMainMenu();
    menus.forEach(m => m.active = false);
    const currentMenu = menus.find(m => m.id === currentMenuId);

    if (currentMenu) {
        currentMenu.active = true;
    }

    return createEls('div', 'app-wrp', document.body, [topnav(menus), { tag: 'div', className: 'container', children: [{ tag: 'div', className: 'p-3', bootstrap(el) {
                el.appendChild(child);
            } }] }]);
});

var grid = (({ columns, loadData, onEdit, onDelete }) => __async(function* () {
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

    let data = yield loadData();

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
}()));

const dataToForm = (data, form) => {
    for (let i in data) {
        let input = form.querySelector(`[name="${i}"]`);
        if (!input) {
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
    getEls(form, '.image-list').forEach(imageWrp => {
        getEls(imageWrp, 'img[data-field-name]').forEach(img => {
            data[img.dataset.fieldName] = data[img.dataset.fieldName] || [];
            data[img.dataset.fieldName].push(img.src);
        });
    });

    emitEvent(`form:edit`, data);
};

const render$1 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Nome', name: 'name' }, { type: 'text', label: 'E-mail', name: 'email' }, { type: 'text', label: 'Telefone', name: 'phone' }, { type: 'text', label: 'Senha', name: 'password' }, { type: 'acl', label: 'Acesso', name: 'acl', fieldCol: 12 }, { type: 'submit', label: 'Salvar' }],
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
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de usuários' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Nome', prop: user => user.name }, { label: 'E-mail', prop: user => user.email }, { label: 'Telefone', prop: user => user.phone }],

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
    }());

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
        render$1(el);
    }
};

var menuSrv = {

    validate(data) {
        let errors = '';

        if (!data.name) {
            errors += ' Informe o nome.';
        }

        if (!data.description) {
            errors += ' Informe a descrição.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/menu/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: user => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/menu/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    update: (id, user) => __async(function* () {
        const params = { id };
        for (let i in user) {
            params[`${i}`] = user[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/menu/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

const render$2 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Nome', name: 'name' }, { type: 'text', label: 'Descrição', name: 'description' }, { type: 'number', label: 'Ordem', name: 'order' }, { type: 'submit', label: 'Salvar' }],
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
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de menus do site' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => menuSrv.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Nome', prop: menu => menu.name }, { label: 'Descrição', prop: menu => menu.description }, { label: 'Ordem', prop: menu => menu.order }],

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
    }());

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
        render$2(el);
    }
};

var service$1 = {

    validate(data) {
        let errors = '';

        if (!data.title) {
            errors += ' Informe o título.';
        }

        if (!data.description) {
            errors += ' Informe a descrição.';
        }

        if (!data.text) {
            errors += ' Digite um texto.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/article/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: article => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/article/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(article)
        });

        let newArticle = yield response.json();

        return newArticle;
    }()),

    update: (id, article) => __async(function* () {
        const params = { id };
        for (let i in article) {
            params[`${i}`] = article[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/article/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newArticle = yield response.json();

        return newArticle;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/article/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

const render$3 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Título', name: 'title' }, { type: 'text', label: 'Descrição', name: 'description' }, { type: 'single-entity', label: 'Menu', name: 'menu', etity: 'menu', service: menuSrv, descriptionField: 'name' }, { type: 'wysiwyg', name: 'text', fieldCol: 12 }, { type: 'submit', label: 'Salvar' }],
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
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de Artigos' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$1.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Título', prop: article => article.title }, { label: 'Descrição', prop: article => article.description }, { label: 'Menu', prop: article => (article.menu || {}).name || '' }],

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
    }());

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
        render$3(el);
    }
};

var homePage = (appEl => {
    const wrpEl = document.createElement('div');

    createEls('div', 'home-page', wrpEl, [{ tag: 'h1', textContent: 'Bem vindo' }, { tag: 'p', textContent: 'Através deste sistema você poderá modificar as informações que serão exibidas no website.' }, { tag: 'p', textContent: 'Utilize a ferramenta com prudência.' }]);

    appEl.appendChild(template(wrpEl, 'home'));
});

var home = {
    home: true,
    route: '#/home',
    render(el) {
        homePage(el);
    }
};

var service$2 = {

    findById(id) {
        return __async(function* () {
            let response = yield fetch(`${config.API_URL}/cms/product/id/${id}`, { headers });
            let json = yield response.json();
            return json;
        }());
    },

    validate(data) {
        let errors = '';

        if (!data.name) {
            errors += ' Informe o nome.';
        }

        if (!data.short_description) {
            errors += ' Informe a descrição curta.';
        }

        if (!(data.photos && data.photos.length)) {
            errors += ' Selecione uma foto.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/product/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: user => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/product/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    update: (id, user) => __async(function* () {
        const params = { id };
        for (let i in user) {
            params[`${i}`] = user[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/product/${id}`, {
            headers,
            method: 'DELETE'
        });
    }()),

    createImage: (id, image) => __async(function* () {
        return fetch(`${config.API_URL}/cms/product/image`, {
            body: JSON.stringify({ id, image }),
            headers,
            method: 'POST'
        }).then(res => res.json());
    }()),

    destroyImage: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/product/image/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

const priceFormat = str => {
    str = str || '';
    if (isNaN(str)) {
        return '';
    }

    return `R$${parseFloat(str).toFixed(2)}`.split('.').join(',');
};

const render$4 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Nome', name: 'name' }, { type: 'text', label: 'Descrição', name: 'short_description' }, { type: 'number', label: 'Valor', name: 'price', step: '0.01', min: 0 }, { type: 'wysiwyg', name: 'long_description', fieldCol: 12 }, { type: 'image-list', name: 'photos', label: 'Fotos', fieldCol: 12, service: service$2 }, { type: 'submit', label: 'Salvar' }],
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
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de Produtos' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$2.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Nome', prop: product => product.name }, { label: 'Descrição curta', prop: product => product.short_description }, { label: 'Valor', prop: product => priceFormat(product.price) }],

            loadData() {
                return loadData();
            },

            onEdit(product) {
                service$2.findById(product.id).then(product => {
                    dataToForm(product, formEl);
                    formEl.dataset.id = product.id;
                });
            },

            onDelete(product) {
                service$2.destroy(product.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Produto excluído com sucesso'
                    });
                    window.location.reload();
                });
            }
        });
        mainEl.appendChild(gridEl);
    }());

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
        render$4(el);
    }
};

var macroSrv = {

    validate(data) {
        let errors = '';

        if (!data.name) {
            errors += ' Informe um nome único';
        }

        if (!(data.strval && data.textval)) {
            errors += ' Informe a descrição.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/macros/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: macro => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/macros/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(macro)
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    update: (id, macro) => __async(function* () {
        const params = { id };
        for (let i in macro) {
            params[`${i}`] = macro[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/macros/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newUser = yield response.json();

        return newUser;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/macros/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

function getMacroInput(list, macro = {}) {
    const placeholder = 'Conteúdo';

    switch (macro.type) {
        case '3':
            return { tag: 'div', className: 'form-group', children: [macro.textval ? { tag: 'div', className: 'mb-2', children: [{ tag: 'img', attrs: { src: macro.textval, alt: 'Imagem selecionada', width: 150 } }] } : { tag: 'span' }, { tag: 'button', className: 'btn btn-primary', textContent: 'Abrir imagem', on: ['click', e => {
                        selectImage({
                            forceFile: true
                        }).then(image => imageResize(image, { width: 800, height: 400 }, 1).then(image => {
                            macro.textval = image;
                            emitEvent('macros:refresh', list);
                        }));
                    }]
                }] };
        case '2':
            return { tag: 'div', className: 'form-group', children: [{ tag: 'textarea', className: 'form-control', bootstrap: el => el.innerHTML = macro.textval || '',
                    attrs: { name: macro.name, placeholder, rows: 10 }, on: ['change', e => {
                        macro.textval = e.target.value;
                    }]
                }] };
        default:
            return { tag: 'div', className: 'form-group', children: [{ tag: 'input', className: 'form-control',
                    attrs: { type: 'text', name: macro.name, placeholder, value: macro.strval || '' }, on: ['change', e => {
                        macro.strval = e.target.value;
                    }]
                }] };
    }
}

var macro = (list => ({
    tag: 'div',
    className: 'macro',
    children: list.length ? list.map(macroData => ({ tag: 'div', className: 'card mb-5', children: [{ tag: 'div', className: 'card-body', children: [{ tag: 'div', className: 'row mb-4', children: [{ tag: 'div', className: 'col-md-6', children: [{ tag: 'input', className: 'form-control', attrs: { type: 'text', placeholder: 'Nome único', value: macroData.name || '' },
                        on: ['change', e => {
                            macroData.name = e.target.value;
                        }] }] }, { tag: 'div', className: 'col-md-6 text-md-right', children: [{ tag: 'select', className: 'form-control', children: [{ tag: 'option', attrs: { value: '1' }, textContent: 'Texto pequeno' }, { tag: 'option', attrs: { value: '2' }, textContent: 'Texto extenso' }, { tag: 'option', attrs: { value: '3' }, textContent: 'Imagem' }], on: ['change', e => {
                            macroData.type = e.target.value;
                            emitEvent('macros:refresh', list);
                        }], bootstrap: el => el.value = macroData.type }] }] }, getMacroInput(list, macroData), { tag: 'div', children: [macroData.__state === 'edition' ? { tag: 'div', className: 'text-md-right', children: [{ tag: 'button', className: 'btn btn-default', textContent: 'Cancelar', on: ['click', () => {
                            if (!macroData.id) {
                                list.splice(list.indexOf(macroData), 1);
                            }
                            macroData.__state = '';
                            emitEvent('macros:refresh', list);
                        }] }, { tag: 'button', className: 'btn btn-success', textContent: 'Salvar', on: ['click', () => __async(function* () {
                            try {
                                if (macroData.id) {
                                    yield macroSrv.update(macroData.id, macroData);
                                } else {
                                    yield macroSrv.create(macroData);
                                }
                            } catch (e) {
                                return msg(e.msg || 'Erro ao salvar texto geral');
                            }

                            msg('Salvo com sucesso', 'success');
                        }())] }] } : { tag: 'div', className: 'text-md-right', children: [{ tag: 'button', className: 'btn btn-danger', textContent: 'Deletar', on: ['click', () => {
                            const done = () => {
                                list.splice(list.indexOf(macroData), 1);
                                emitEvent('macros:refresh', list);
                            };
                            if (macroData.id) {
                                return macroSrv.destroy(macroData.id).then(done);
                            }
                            done();
                        }] }, { tag: 'button', className: 'btn btn-primary', textContent: 'Editar', on: ['click', () => {
                            macroData.__state = 'edition';
                            emitEvent('macros:refresh', list);
                        }] }] }] }] }] })) : [{ tag: 'div', className: 'card-body', children: [{ tag: 'h3', className: 'text-warning', textContent: 'Nenhum conteúdo inserido' }] }]
}));

const render$5 = appEl => __async(function* () {
    const wrpEl = document.createElement('div');
    const render = (macros = []) => {
        wrpEl.innerHTML = '';
        createEls('div', '', wrpEl, [{ tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-9', children: [{ tag: 'h2', textContent: 'Cadastro de textos gerais', className: 'mb-3' }] }, { tag: 'div', className: 'col-md-3 pt-2 text-md-right', children: [{ tag: 'a', attrs: { href: 'javascript:;' }, children: [icon('add', 32, 32)] }], on: ['click', () => {
                    macros.push({ __state: 'edition' });
                    render(macros);
                }] }] }, macro(macros)]);
        addEvent('macros:refresh', macros => render(macros));
    };

    appEl.appendChild(template(wrpEl, 'macros'));
    const macros = yield macroSrv.retrieve('');
    render(macros);
}());

var macros = {
    route: '#/macros',
    render(el) {
        render$5(el);
    }
};

var service$3 = {

    findById(id) {
        return __async(function* () {
            let response = yield fetch(`${config.API_URL}/cms/new/id/${id}`, { headers });
            let json = yield response.json();
            return json;
        }());
    },

    validate(data) {
        let errors = '';

        if (!data.title) {
            errors += ' Informe o título.';
        }

        if (!data.description) {
            errors += ' Informe a descrição.';
        }

        if (!data.abstract) {
            errors += ' Digite um resumo.';
        }

        if (!data.text) {
            errors += ' Digite um texto.';
        }

        if (!data.cover) {
            errors += ' Selecione uma foto de capa.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/new/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: notice => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/new/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(notice)
        });

        let newNotice = yield response.json();

        return newNotice;
    }()),

    update: (id, notice) => __async(function* () {
        const params = { id };
        for (let i in notice) {
            params[`${i}`] = notice[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/new/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newNotice = yield response.json();

        return newNotice;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/new/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

const render$6 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Título', name: 'title' }, { type: 'text', label: 'Descrição', name: 'description' }, { type: 'text', label: 'Autor', name: 'author' }, { type: 'date', label: 'Data de publicação', name: 'published_at' }, { type: 'single-entity', label: 'Menu', name: 'menu', etity: 'menu', service: menuSrv, descriptionField: 'name' }, { type: 'wysiwyg', label: 'Resumo', name: 'abstract', fieldCol: '12' }, { type: 'wysiwyg', label: 'Texto', name: 'text', fieldCol: '12' }, { type: 'single-image', label: 'Capa', name: 'cover' }, { type: 'spacing' }, { type: 'spacing' }, { type: 'submit', label: 'Salvar' }],
        onSubmit(data, e) {
            const errors = service$3.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service$3.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia atualizada com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service$3.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia salva com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });

    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de Notícias' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$3.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Data', prop: notice => commonToPtBr(notice.published_at) }, { label: 'Nome', prop: notice => notice.title }],

            loadData() {
                return loadData();
            },

            onEdit(notice) {
                service$3.findById(notice.id).then(notice => {
                    dataToForm(notice, formEl);
                    formEl.dataset.id = notice.id;
                });
            },

            onDelete(notice) {
                service$3.destroy(notice.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia excluída com sucesso'
                    });
                    window.location.reload();
                });
            }
        });
        mainEl.appendChild(gridEl);
    }());

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'new'));
};

var news = {
    route: '#/news',
    render(el) {
        render$6(el);
    }
};

var service$4 = {

    findById(id) {
        return __async(function* () {
            let response = yield fetch(`${config.API_URL}/cms/cover/id/${id}`, { headers });
            let json = yield response.json();
            return json;
        }());
    },

    validate(data) {
        let errors = '';

        if (!data.name) {
            errors += ' Informe o título (nome).';
        }

        if (!data.description) {
            errors += ' Informe a descrição.';
        }

        if (!data.group) {
            errors += ' Selecione um grupo.';
        }

        if (!data.cover) {
            errors += ' Selecione uma foto de capa.';
        }

        return errors;
    },

    retrieve: search => __async(function* () {
        let response = yield fetch(`${config.API_URL}/cms/cover/${encodeURIComponent(search)}`, { headers });
        let json = yield response.json();
        return json;
    }()),

    create: cover => __async(function* () {
        const response = yield fetch(`${config.API_URL}/cms/cover/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(cover)
        });

        let newCover = yield response.json();

        return newCover;
    }()),

    update: (id, cover) => __async(function* () {
        const params = { id };
        for (let i in cover) {
            params[`${i}`] = cover[i];
        }
        const response = yield fetch(`${config.API_URL}/cms/cover/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers
        });

        let newCover = yield response.json();

        return newCover;
    }()),

    destroy: id => __async(function* () {
        return fetch(`${config.API_URL}/cms/cover/${id}`, {
            headers,
            method: 'DELETE'
        });
    }())

};

const render$7 = appEl => {
    let formEl, searchInput;

    const formObj = form({
        fieldCol: 3,
        fields: [{ type: 'text', label: 'Título (nome)', name: 'name' }, { type: 'text', label: 'Descrição', name: 'description' }, { type: 'text', label: 'Grupo', name: 'group' }, { type: 'spacing' }, { type: 'single-image', label: 'Foto de capa', name: 'cover' }, { type: 'submit', label: 'Salvar' }],
        onSubmit(data, e) {
            const errors = service$4.validate(data);
            if (errors) {
                return error(errors);
            }

            if (e.target.dataset.id) {
                service$4.update(e.target.dataset.id, data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia atualizada com sucesso'
                    });
                    window.location.reload();
                });
            } else {
                service$4.create(data).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Notícia salva com sucesso'
                    });
                    window.location.reload();
                });
            }
        }
    });

    const wrpEl = document.createElement('div');
    const mainEl = createEls('div', '', wrpEl, [{ tag: 'h2', textContent: 'Cadastro de Fotos de capa' }, formObj, { tag: 'div', className: 'row', children: [{ tag: 'div', className: 'col-md-8' }, { tag: 'div', className: 'col-md-4 pl-4 pt-2 pb-2', children: [{ tag: 'input', className: 'form-control', attrs: { placeholder: 'Pesquisar' },
                bootstrap: el => searchInput = el }] }] }]);

    formEl = mainEl.querySelector('form');
    const loadData = () => service$4.retrieve(searchInput.value);

    const renderGrid = () => __async(function* () {
        const oldGrid = mainEl.querySelector('table');
        if (oldGrid) {
            mainEl.removeChild(oldGrid);
        }
        const gridEl = yield grid({
            columns: [{ label: 'Nome', prop: cover => cover.name }, { label: 'Descrição', prop: cover => cover.description }],

            loadData() {
                return loadData();
            },

            onEdit(cover) {
                service$4.findById(cover.id).then(cover => {
                    dataToForm(cover, formEl);
                    formEl.dataset.id = cover.id;
                });
            },

            onDelete(cover) {
                service$4.destroy(cover.id).then(() => {
                    sessionStorage.flash = JSON.stringify({
                        type: 'success',
                        msg: 'Capa excluída com sucesso'
                    });
                    window.location.reload();
                });
            }
        });
        mainEl.appendChild(gridEl);
    }());

    searchInput.addEventListener('keyup', () => {
        window.searchTimeout && window.clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(renderGrid, 700);
    });

    renderGrid();
    appEl.appendChild(template(wrpEl, 'cover'));
};

var covers = {
    route: '#/covers',
    render(el) {
        render$7(el);
    }
};

var routes = [login$1, users, menus$1, articles, products, home, macros, news, covers];

function routeChange(el, hasRouteChange) {
    let route = window.location.hash;
    const currentUser = window.sessionStorage.user;

    if (!currentUser) {
        route = '#/login';
    }

    const render = el => {
        const routeFn = routes.find(r => r.route === route);
        if (!routeFn) {
            return window.location = '#/home';
        }
        routeFn.render(el);
        if (sessionStorage.flash) {
            const msgData = JSON.parse(sessionStorage.flash);
            msg(msgData.msg, msgData.type);
            sessionStorage.flash = '';
        }
    };

    if (!render) {
        return console.error('Route not found');
    }

    render(el);

    if (!hasRouteChange) {
        window.addEventListener('hashchange', e => {
            el.innerHTML = '';
            routeChange(el, true);
        });
    }
}

return routeChange;

}());
