
import {inSameDay} from '../common/date-format';

function addDay(date, days=1) {
    let time = date.getTime();
    let currentDate = date.getDate();
    while (date.getDate() == currentDate) {
        time += 1 * 60 * 60 * 1000;
        date.setTime(time);
    }
}

function getMonthName(number) {
    switch (number) {
        case 1:
            return 'Janeiro';
        case 2:
            return 'Fevereiro';
        case 3:
            return 'Março';
        case 4:
            return 'Abril';
        case 5:
            return 'Maio';
        case 6:
            return 'Junho';
        case 7:
            return 'Julho';
        case 8:
            return 'Agosto';
        case 9:
            return 'Setembro';
        case 10:
            return 'Outubro';
        case 11:
            return 'Novembro';
        case 12:
            return 'Dezembro';
    }

    return '';
}

function getMonthOptions(selected) {
    const options = [];
    for (let i=0; i<12; i++) {
        let option = {tag: 'option', attrs: {value: i+1}, textContent: getMonthName(i+1)};
        if (selected == i) {
            option.attrs.SELECTED = true;
        }
        options.push(option);
    }

    return options;
}

function getYearOptions(selected) {
    const options = [];
    const currentYear = (new Date()).getFullYear();
    for (let i=currentYear-30; i<currentYear+20; i++) {
        const option = {tag: 'option', attrs: {value: i}, textContent: i};
        if (i == selected) {
            option.attrs.SELECTED = true;
        }
        options.push(option);
    }

    return options;
}

function getWeekDays() {
    return ['Domingo', 'Segunda', 'Terça', 'Quarta', 
            'Quinta', 'Sexta', 'Sábado'];
}

function getDateRow({
    datePointer, 
    onSelectDay, 
    today, 
    month,
    items=[]
}) {
    const cols = [];
    let print = false;
    for (let day=0; day<7; day++) {
        let dateStr = datePointer+'';
        
        const col = {tag: 'td', attrs: {value: day}, on: ['click', e => {
            onSelectDay && onSelectDay(dateStr);
        }], children: items.filter(item => {
            return inSameDay(item.date, datePointer);
        }).map(item => ({
            tag: 'div',
            className: 'calendar-mark',
            textContent: item.description
        }))};

        if (month == datePointer.getMonth() && day == datePointer.getDay()) {
            col.textContent = datePointer.getDate();
            addDay(datePointer, 1);
            print = true;
        } else {
            col.textContent = ' ';
            col.on.pop();
        }
        if (inSameDay(datePointer, today)) {
            col.className = 'today';
        }
        cols.push(col);
    }

    return print ? cols : [];
}

export default (el, {
    onSelectDay,
    onChangeMonth,
    month,
    year,
    items
}) => {
    const today = new Date();
    const datePointer = new Date(year, month, 1);

    return createEls('div', 'calendar', el, [
        {tag: 'table', className: 'calendar-table', children: [
    
            // Calendar head
            {tag: 'thead', children: [
                {tag: 'tr', children: [
                    {tag: 'th', attrs: {colSpan: 7}, className: 'month-selector', children: [
                        {tag: 'select', children: getMonthOptions(month), on: ['change', e => {
                            onChangeMonth && onChangeMonth(e.target.value-1, year);
                        }]},
                        {tag: 'select', children: getYearOptions(year), on: ['change', e => {
                            onChangeMonth && onChangeMonth(month, e.target.value);
                        }]}
                    ]}
                ]},
    
                {tag: 'tr', children: getWeekDays().map(wd => 
                    ({tag: 'th', textContent: wd}))}
            ]},
    
            // Calendar body
            {tag: 'tbody', children: [
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})},
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})},
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})},
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})},
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})},
                {tag: 'tr', children: getDateRow({datePointer, onSelectDay, today, month, items})}
            ]}
        ]}
    ]);
}