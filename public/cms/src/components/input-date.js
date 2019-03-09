import { addEvent } from '../common/event';
import { commonToPtBr } from '../common/date-format';

export default (meta, datetime=false) => ({
    tag: 'input',
    className: 'form-control date',
    attrs: {
        type: 'text', 
        placeholder: datetime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY',
        name: meta.name,
        'data-format': datetime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY' 
    },
    bootstrap(el) {
        addEvent('form:edit', data => {
            const value = data[meta.name];
            if (value) {
                el.value = commonToPtBr(value, datetime);
            }
        });

        el.addEventListener('change', e => {
            let dateStr = e.target.value;
            let hour;
            if (datetime) {
                let spaceSplit = dateStr.split(' ');
                hour = spaceSplit.pop().split(':');
                dateStr = spaceSplit.pop();
            }
            const dateArr = dateStr.split('/');
            if (dateArr.length !== 3) {
                return e.target.value = '';
            }
            const date = new Date(dateArr[0]*1, dateArr[1]*1, dateArr[2]*1);
            if (datetime) {
                date.setHours(hour[0]);
                date.setMinutes(hour[1]);
            }
            if (isNaN(date.getTime())) {
                return e.target.value = '';
            }
        });

        el.addEventListener('keyup', e => {
            if (! el.value) {
                return;
            }

            if ([2, 5].indexOf(el.value.length) !== -1) {
                el.value += '/';
                return;
            }

            if (! datetime) {
                return;
            }

            if (el.value.length === 10) {
                el.value += ' ';
                return;
            }

            if (el.value.length === 13) {
                el.value += ':';
                return;
            }

            if (el.value.length > 16) {
                el.value = el.value.substr(0, 16);
            }
        });
    }
});