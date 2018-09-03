

export default meta => ({
    tag: 'input',
    className: 'form-control date',
    attrs: {
        type: 'text', 
        placeholder: 'DD/MM/YYYY',
        name: meta.name,
        'data-format': 'DD/MM/YYYY'
    },
    bootstrap(el) {
        el.addEventListener('change', e => {
            const dateStr = e.target.value;
            const dateArr = dateStr.split('/');
            if (dateArr.length !== 3) {
                return e.target.value = '';
            }
            const date = new Date(dateArr[0]*1, dateArr[1]*1, dateArr[2]*1);
            if (isNaN(date.getTime())) {
                return e.target.value = '';
            }
        });

        el.addEventListener('keyup', e => {
            if (! el.value) {
                return;
            }

            if ([2, 5].indexOf(el.value.length) === -1) {
                return;
            }

            el.value += '/';
        });
    }
});