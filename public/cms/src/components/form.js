import inputAcl from './input-acl';

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-success', attrs: {type: 'submit', value: meta.label, placeholder: meta.placeholder || ''}};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', name: meta.name, placeholder: meta.placeholder || ''}};
        case 'acl':
            return inputAcl(meta);
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder || ''}};
    }
}

export default ({fields, fieldCol, onSubmit}) => ({
    tag: 'form', 
    className: 'row', 
    children: fields.map(f => {
        if (f.type === 'submit') {
            return {tag: 'div', className: 'col-md-12', children: [
                createField(f)
            ]};
        }

        return {tag: 'div', className: `form-group col-md-${fieldCol || 4}`, children: [
            {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
            createField(f)
        ]};
    }), 

    bootstrap: el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            let data = {};        
            const fields = getEls(el, 'input, select, textarea').filter(el => el.type !== 'submit');

            fields.filter(input => !input.dataset.skipbind).forEach(input => {
                data[input.name] = input.value || input.innerHTML;
            });

            let acl = '';
            fields.filter(input => input.dataset.acl).forEach(input => {
                acl += input.checked ? `${input.name};` : '';
            });
            if (acl) {
                data.acl = acl;
            }

            onSubmit(data, e);
        })
    }
})