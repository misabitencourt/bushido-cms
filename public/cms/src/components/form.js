import inputAcl from './input-acl';
import wysiwyg from './wysiwyg';
import singleEntity from './single-entity';
import imageList from './image-list';
import {emitEvent} from '../common/event';
import singleImage from './single-image';
import singleFile from './single-file';
import inputDate from './input-date';
import { ptBrToCommon } from '../common/date-format';

function createField(meta) {
    switch(meta.type) {
        case 'single-file':
            return {tag: 'div', className: 'single-image', attrs: {'data-name': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                singleFile(el, meta);
            }};
        case 'date':
            return inputDate(meta);
        case 'datetime':
            return inputDate(meta, true);
        case 'spacing':
            return {tag: 'div'};
        case 'single-image':
            return {tag: 'div', className: 'single-image', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                singleImage(el, meta);
            }};
        case 'number':
            return {tag: 'input', className: 'form-control', attrs: {type: 'number', 
                        value: meta.label, placeholder: meta.placeholder || '', 
                        min: meta.min, max: meta.max, step: meta.step, name: meta.name}};
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
                createEls('div', 'single-entity-container', el, [singleEntity(meta)]);
            }};

        case 'image-list':
            return {tag: 'div', className: 'image-list', attrs: {'data-attr': meta.name}, bootstrap(el) {
                el.dataset.skipbind = '1';
                imageList(el, meta);
            }};

        case 'acl':
            return inputAcl(meta);
            
        default:
            return {tag: 'input', className: 'form-control', attrs: {type: 'text', name: meta.name, placeholder: meta.placeholder || ''}};
    }
}

export default ({fields, fieldCol, onSubmit, hideCancel=false}) => ({
    tag: 'form', 
    className: 'row p-2', 
    children: fields.map(f => {
        if (f.type === 'submit') {
            return {tag: 'div', className: 'col-md-12', children: [
                createField(f),
                hideCancel ? {tag: 'span'} : createField({type: 'cancel', label: 'Cancelar'})
            ]};
        }

        return {tag: 'div', className: `form-group col-md-${f.fieldCol || fieldCol || 4}`, children: [
            {tag: 'label', className: f.label ? '' : 'invisible', textContent: f.label },
            createField(f)
        ]};
    }), 

    bootstrap: el => {
        el.addEventListener('reset', () => {
            el.dataset.id = '';
            emitEvent('form:reset');
        });
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

            getEls(el, '[data-value]').forEach(el => data[el.dataset.name] = el.dataset.value);
            getEls(el, '.input-wysiwyg').forEach(el => {
                const contentEditable = getEl(el, '[contenteditable]');
                if (contentEditable) {
                    data[el.dataset.attr] = contentEditable.innerHTML;
                }
            });
            getEls(el, '.image-list img').filter(el => el.dataset.fieldName).forEach(el => {
                data[el.dataset.fieldName] = data[el.dataset.fieldName] || [];
                data[el.dataset.fieldName].push(el.src);
            })
            getEls(el, '.single-image').forEach(imageWrp => {
                const hasImg = getEl(imageWrp, '[data-selected="1"]');
                if (! hasImg) {
                    return;
                }
                const img = getEl(imageWrp, 'img');                
                data[imageWrp.dataset.attr] = img.src;
            });
            getEls(el, 'input.date').forEach(inputDate => {
                data[inputDate.name] = ptBrToCommon(inputDate.value, 
                    inputDate.dataset.format == 'DD/MM/YYYY HH:mm');
            });

            onSubmit(data, e);
        })
    }
})