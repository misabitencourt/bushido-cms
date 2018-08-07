import { emitEvent } from '../common/event';
import imageResize from '../common/image-resize';

function getMacroInput(list, macro={}) {
    const placeholder = 'Conteúdo';

    switch(macro.type) {
        case '3':
            return {tag: 'div', className: 'form-group', children: [
                
                macro.textval ? 
                    {tag: 'div', className: 'mb-2', children: [
                        {tag: 'img', attrs: {src: macro.textval, alt: 'Imagem selecionada', width: 150}}
                    ]} : {tag: 'span'},

                {tag: 'button', className: 'btn btn-primary', textContent: 'Abrir imagem', on: ['click', e => {
                        selectImage({
                            forceFile: true
                        }).then(image => imageResize(image, {width: 800, height: 400}, 1).then(image => {
                            macro.textval = image;
                            emitEvent('macros:refresh', list);
                        }));
                    }]
                }
            ]};
        case '2':
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'textarea', className: 'form-control', bootstrap: el => el.innerHTML = macro.textval || '',
                    attrs: {name: macro.name, placeholder, rows: 10}, on: ['change', e => {
                        macro.textval = e.target.value;
                    }]
                }
            ]};
        default:
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'input', className: 'form-control', 
                    attrs: {type: 'text', name: macro.name, placeholder, value: macro.strval || ''}, on: ['change', e => {
                        macro.strval = e.target.value;
                    }]
                }
            ]}
    }
}

export default list => ({
    tag: 'div',
    className: 'macro',
    children: list.length ? (
        list.map(macroData => ({tag: 'div', className: 'card mb-5', children: [
            {tag: 'div', className: 'card-body', children: [
                {tag: 'div', className: 'row mb-4', children: [
                    {tag: 'div', className: 'col-md-6', children: [
                        {tag: 'input', className: 'form-control', attrs: {type: 'text', placeholder: 'Nome único', value: macroData.name || ''}, 
                                on: ['change', e => {
                            macroData.name = e.target.value;
                        }]}
                    ]},
                    {tag: 'div', className: 'col-md-6 text-md-right', children: [
                        {tag: 'select', className: 'form-control', children: [
                            {tag: 'option', attrs: {value: '1'}, textContent: 'Texto pequeno'},
                            {tag: 'option', attrs: {value: '2'}, textContent: 'Texto extenso'},
                            {tag: 'option', attrs: {value: '3'}, textContent: 'Imagem'}
                        ], on: ['change', e => {
                            macroData.type = e.target.value;
                            emitEvent('macros:refresh', list);
                        }], bootstrap: el => el.value = macroData.type }
                    ]}
                ]},

                getMacroInput(list, macroData),

                {tag: 'div', children: [
                    macroData.__state === 'edition' ? (
                        {tag: 'div', className: 'text-md-right', children: [
                            {tag: 'button', className: 'btn btn-default', textContent: 'Cancelar', on: ['click', () => {
                                if (! macroData.id) {
                                    list.splice(list.indexOf(macroData), 1);
                                }
                                macroData.__state = '';
                                emitEvent('macros:refresh', list);
                            }]},
                            {tag: 'button', className: 'btn btn-success', textContent: 'Salvar', on: ['click', () => {
                                console.log('TODO')
                            }]}
                        ]}
                    ) : (
                        {tag: 'div', className: 'text-md-right', children: [
                            {tag: 'button', className: 'btn btn-primary', textContent: 'Editar', on: ['click', () => {
                                macroData.__state = 'edition';
                                emitEvent('macros:refresh', list);
                            }]}
                        ]}
                    )
                ]}
            ]}
        ]}))
    ) : (
        [
            {tag: 'div', className: 'card-body', children: [
                {tag: 'h3', className: 'text-warning', textContent: 'Nenhum conteúdo inserido'}
            ]}
        ]
    )
})