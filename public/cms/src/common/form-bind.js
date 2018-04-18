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

}

export const formToData = (form) => {
    let obj = {};
    
    Array.from(form.querySelectorAll('[name]')).forEach(input => {
        obj[input.name] = input.value;
    });

    Array.from(form.querySelectorAll('textarea')).forEach(input => {
        obj[input.name] = input.value || input.innerHTML;
    });

    return obj;
}
