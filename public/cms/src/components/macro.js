
function getMacroInput(macro={}) {
    const placeholder = 'Conteúdo'

    switch(macro.type) {
        case '3':
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'input', className: 'form-control', attrs: {type: 'text', name: macro.name, placeholder}, on: ['change', e => {
                    macro.strval = e.target.value
                }]}
            ]};
        case '2':
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'textarea', className: 'form-control', attrs: {name: macro.name, placeholder}, on: ['change', e => {
                    macro.strval = e.target.value
                }]}
            ]};
        default:
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'input', className: 'form-control', attrs: {type: 'text', name: macro.name, placeholder}, on: ['change', e => {
                    macro.strval = e.target.value
                }]}
            ]}
    }
}

export default list => ({
    tag: 'div',
    className: 'macro card',
    children: list.length ? (
        list.map(macroData => ({tag: 'div', className: 'card-body', children: [
            {tag: 'div', className: 'row mb-2', children: [
                {tag: 'div', className: 'col-md-6', children: [
                    {tag: 'input', className: 'form-control', attrs: {type: 'text', placeholder: 'Nome único'}, on: ['change', e => {
                        macro.name = e.target.value
                    }]}
                ]},
                {tag: 'div', className: 'col-md-6 text-md-right', children: [
                    {tag: 'select', className: 'form-control', children: [
                        {tag: 'option', attrs: {value: '1'}, textContent: 'Texto pequeno'},
                        {tag: 'option', attrs: {value: '2'}, textContent: 'Texto extenso'},
                        {tag: 'option', attrs: {value: '3'}, textContent: 'Imagem'}
                    ]}
                ]}
            ]},
            getMacroInput(macroData)
        ]}))
    ) : (
        [
            {tag: 'div', className: 'card-body', children: [
                {tag: 'h3', className: 'text-warning', textContent: 'Nenhum conteúdo inserido'}
            ]}
        ]
    )
})