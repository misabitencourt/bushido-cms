import { emitEvent } from '../common/event';
import fileOpen from '../common/file-open';
import imageResize from '../common/image-resize';
import macroSrv from '../service/macros';
import msg from '../dialogs/msg';

export const MACRO_TYPES = {
    TEXT: '1',
    LONGTEXT: '2',
    IMAGE: '3',
    FILE: '4'
};

function getMacroInput(list, macro={}) {
    const placeholder = 'Conteúdo';

    switch(macro.type) {
        case MACRO_TYPES.FILE:
            return {tag: 'div', className: 'form-group', children: [
                
                macro.textval ? 
                    {tag: 'div', className: 'mb-2', children: [
                        macro.textval ? (
                            {tag: 'a', attrs: {
                                href: macro.textval,
                                download: macro.name,
                                title: 'Clique para baixar o arquivo'
                            }, textContent: 'Baixar'}
                        ) : (
                            {tag: 'span', textContent: 'Nenhum arquivo selecionado'}
                        )
                    ]} : {tag: 'span'},

                    {tag: 'button', className: 'btn btn-primary', textContent: 'Trocar arquivo', on: ['click', () => {
                        fileOpen().then(base64 => {
                            macro.textval = base64;
                            emitEvent('macros:refresh', list);
                        });
                    }]
                }
            ]};

        case MACRO_TYPES.IMAGE:
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

        case MACRO_TYPES.LONGTEXT:
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
                            {tag: 'option', attrs: {value: MACRO_TYPES.TEXT}, textContent: 'Texto pequeno'},
                            {tag: 'option', attrs: {value: MACRO_TYPES.LONGTEXT}, textContent: 'Texto extenso'},
                            {tag: 'option', attrs: {value: MACRO_TYPES.IMAGE}, textContent: 'Imagem'},
                            {tag: 'option', attrs: {value: MACRO_TYPES.FILE}, textContent: 'Arquivo para download'}
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
                            {tag: 'button', className: 'btn btn-success', textContent: 'Salvar', on: ['click', async () => {
                                try {
                                    if (macroData.id) {
                                        await macroSrv.update(macroData.id, macroData);
                                    } else {
                                        await macroSrv.create(macroData);
                                    }
                                } catch (e) {
                                    return msg(e.msg || 'Erro ao salvar texto geral');
                                }
                                
                                msg('Salvo com sucesso', 'success');                               
                            }]}
                        ]}
                    ) : (
                        {tag: 'div', className: 'text-md-right', children: [
                            {tag: 'button', className: 'btn btn-danger', textContent: 'Deletar', on: ['click', () => {                                
                                const done = () => {
                                    list.splice(list.indexOf(macroData), 1);
                                    emitEvent('macros:refresh', list);
                                };
                                if (macroData.id) {
                                    return macroSrv.destroy(macroData.id).then(done)
                                }
                                done()
                            }]},

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