import inputAcl from './input-acl';

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-outline-success mr-2', attrs: {type: 'submit', value: meta.label, placeholder: meta.placeholder || ''}};
        case 'cancel':
            return {tag: 'button', className: 'btn btn-outline-secondary', attrs: {type: 'reset', placeholder: meta.placeholder || ''}, textContent: meta.label};
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
    className: 'row p-2', 
    children: fields.map(f => {
        if (f.type === 'submit') {
            return {tag: 'div', className: 'col-md-12', children: [
                createField(f),
                createField({type: 'cancel', label: 'Cancelar'})
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

            fields.filter(input => !input.skipbind).forEach(input => {
                data[input.name] = input.value || input.innerHTML;
            });

            let acl = '';
            fields.filter(input => input.getAttribute('acl')).forEach(input => {
                acl += input.checked ? `${input.name.replace('acl_', '')};` : '';
            });
            if (acl) {
                data.acl = acl;
            }

            onSubmit(data, e);
        })
    }
})