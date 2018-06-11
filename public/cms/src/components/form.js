import inputAcl from './input-acl';
import wysiwyg from './wysiwyg';
import singleEntity from './single-entity';
import imageList from './image-list';

function createField(meta) {
    switch(meta.type) {
        case 'submit':
            return {tag: 'input', className: 'btn btn-outline-success mr-2', attrs: {type: 'submit', 
                            value: meta.label, placeholder: meta.placeholder || ''}};
        case 'cancel':
            return {tag: 'button', className: 'btn btn-outline-secondary', attrs: {type: 'reset', 
                            placeholder: meta.placeholder || ''}, textContent: meta.label};
        case 'password':
            return {tag: 'input', className: 'form-control', attrs: {type: 'password', 
                            name: meta.name, placeholder: meta.placeholder || ''}};
        case 'wysiwyg':
            return {tag: 'div', className: 'input-wysiwyg border', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                wysiwyg(el, meta.name);
            }};

        case 'single-entity':
            return {tag: 'div', className: 'single-entity', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                createEls('div', 'single-entity-container', el, [singleEntity(field)]);
            }};

        case 'image-list':
            return {tag: 'div', className: 'image-list', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                imageList(el);
            }};

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

        return {tag: 'div', className: `form-group col-md-${f.fieldCol || fieldCol || 4}`, children: [
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