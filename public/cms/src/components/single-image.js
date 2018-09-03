import icon from './icon';
import card from './card';
import imageResize from '../common/image-resize';

const render = (el, selected=null) => {
    el.innerHTML = '';

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
                                render(el, image);
                            });
                        });
                    }], children: [icon('add', 24, 24)]},
        
                    {tag: 'button', attrs:{type: 'button'}, className: 'btn btn-sm btn-primary', on: ['click', () => {
                        render(el);
                    }], children: [icon('delete', 24, 24)]}
                ]}
            ]
        })
    ]);
}

export default render;