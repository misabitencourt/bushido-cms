import icon from './icon';
import card from './card';
import imageResize from '../common/image-resize';
import { addEvent } from '../common/event';

const render = (el, meta, selected=null) => {
    el.innerHTML = '';

    addEvent('form:edit', data => {
        const img = data[meta.name];
        if (img) {
            render(el, meta, img);
        }
    });

    return createEls('div', 'input-image-inner', el, [
        card({
            img: selected,
            footer: [
                {tag: 'div', className: 'pt-2 text-md-center', children: [
                    {tag: 'button', attrs:{type: 'button'}, className: 'btn btn-sm btn-primary', on: ['click', () => {
                        selectImage({
                            btnOkText: 'OK', 
                            btnCancelText: 'Cancel',
                            forceFile: true,
                            selectDeviceText: 'Select device'
                        }).then(image => {
                            imageResize(image, {width: 800, height: 400}, 1).then(image => {
                                render(el, meta, image);
                            });
                        });
                    }], children: [icon('add', 24, 24)]},
        
                    {tag: 'button', attrs:{type: 'button'}, className: 'btn btn-sm btn-primary', on: ['click', () => {
                        render(el, meta);
                    }], children: [icon('delete', 24, 24)]}
                ]}
            ]
        })
    ]);
}

export default render;