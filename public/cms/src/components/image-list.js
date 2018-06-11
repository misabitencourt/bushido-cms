

export default el => {
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
                        {tag: 'img', attrs: {src: image}, bootstrap(el) {
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