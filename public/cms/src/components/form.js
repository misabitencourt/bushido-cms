
function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-success', attrs: {type: 'submit', value: meta.label, placeholder: meta.placeholder}};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', name: meta.name, placeholder: meta.placeholder}};
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder}};
    }
}

export default ({fields, fieldCol, onSubmit}) => ({tag: 'form', children: fields.map(f => {
    if (f.type === 'submit') {
        return createField(f);
    }

    return {tag: 'div', className: `form-group col-md-${fieldCol || 4}`, children: [
        {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
        createField(f)
    ]};
}), bootstrap(el) {
    el.addEventListener('submit', e => {
        e.preventDefault();
        onSubmit();
    })
}})