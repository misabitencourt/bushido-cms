import {addEvent} from '../common/event';

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
        'heading2'
    ],

    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    }
};

export default (el, name, options) => {
    const data = Object.assign({}, defaults);

    data.actions = data.actions.slice()
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
    })

    if (options) {
        Object.assign(data, options);
    }

    data.element = el;
    pell.init(data);
    addEvent('form:edit', data => {
        if (el && el.parentElement && (! data[name])) {
            return;
        }
        getEl(el, '[contenteditable]').innerHTML = data[name];
    });

    addEvent('form:reset', data => getEl(el, '[contenteditable]').innerHTML = '');
}