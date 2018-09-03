import {emitEvent} from '../common/event';

export const dataToForm = (data, form) => {
    for (let i in data) {
        let input = form.querySelector(`[name="${i}"]`)
        if (! input) {
            continue;
        }
        if (input.tagName === 'TEXTAREA') {
            input.innerHTML = data[i];
        } else {
            input.value = data[i];
        }
    }

    // ACLs
    const checkboxes = Array.from(form.querySelectorAll('input[type=checkbox]')).filter(input => {
        return input.name.indexOf('acl_') === 0;
    });
    if (checkboxes.length) {
        checkboxes.forEach(chk => chk.checked = false);
        const acls = (data.acl || '').split(';');
        acls.forEach(acl => {
            const checkbox = checkboxes.find(chk => chk.name === `acl_${acl}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    // Single images
    Array.from(form.querySelectorAll('.single-image')).forEach(imageWrp => {
        // TODO
    });

    // Multiple images
    Array.from(form.querySelectorAll('.image-list')).forEach(imageWrp => {
        Array.from(imageWrp.querySelectorAll('img[data-field-name]')).forEach(img => {
            data[img.dataset.fieldName] = data[img.dataset.fieldName] || [];
            data[img.dataset.fieldName].push(img.src);
        });
    });
    
    emitEvent(`form:edit`, data);
}
