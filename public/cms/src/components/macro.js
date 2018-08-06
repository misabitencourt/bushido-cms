
function getMacroInput(macro={}) {
    switch(macro.type) {
        case '3':
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'input', className: 'form-control', attr: {type: 'text', name: meta.name}}
            ]};
        case '2':
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'textarea', className: 'form-control', attr: {name: meta.name}}
            ]};
        default:
            return {tag: 'div', className: 'form-group', children: [
                {tag: 'input', className: 'form-control', attr: {type: 'text', name: meta.name}}
            ]}
    }
}

export default list => ({
    tag: 'div',
    className: 'macro card',
    children: list.length ? (
        list.map(macroData => ({tag: 'div', className: 'card-body', children: [
            {tag: 'div', className: 'row', children: [
                {tag: 'div', className: 'col-md-6', children: [
                    {tag: 'h3', textContent: macroData.name}
                ]},
                {tag: 'div', className: 'col-md-6 text-md-right pt-3', children: [
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