import icon from './icon';
import {emitEvent, addEvent} from '../common/event';

export default (el, field) => {
    let imageContainer;
    let inEdition;

    const createImage = (image, id=null) => {
        if ((! id) && inEdition && field.service && field.service.createImage) {
            field.service.createImage(inEdition, image).then(created => {
                id = created.slice().pop();
            });
        }

        const imageWrp = createEls('div', '', imageContainer, [
            {tag: 'div', bootstrap(el) {
                el.style.position = 'absolute';
                el.style.marginTop = '1rem';
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
                    if (id && field.service && field.service.createImage) {
                        field.service.destroyImage(id)
                    }
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
    }

    const mainWrp = createEls('div', 'row', el, [
        {tag: 'div', className: 'col-md-12', bootstrap: el => imageContainer = el},

        {tag: 'div', className: 'col-md-12 mt-2 mb-5', children: [
            {tag: 'a', attrs: {href: 'javascript:;'}, on: ['click', () => {
                selectImage({
                    btnOkText: 'OK', 
                    btnCancelText: 'Cancel',
                    forceFile: true,
                    selectDeviceText: 'Select device'
                }).then(image => createImage(image));
            }], children: [
                icon('add', 32, 32)
            ]}
        ]}
    ]);

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
}