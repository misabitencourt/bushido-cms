import icon from './icon';
import {emitEvent} from '../common/event';

export default (el, field) => {
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