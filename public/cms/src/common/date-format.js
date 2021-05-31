
const lpad = (str, char='0', size=2) => {
    str = `${str}`;
    while (str.length < size) {
        str  = `${char}${str}`;
    }

    return str;
}

export const lastDayOfMonth = date => {
    date = date || (new Date());
    date = addMonth(date);
    date.setTime(date.getTime() - (26 * 60 * 60 * 1000));

    return date;
}

export const addMonth = date => {
    date = date || (new Date());
    let month = date.getMonth() + 1;
    month = month === 12 ? 0 : month;
    date.setMonth(month); 

    return date;
}

export const inSameDay = (d1, d2) => d1.getDate() == d2.getDate() &&
    d1.getMonth() == d2.getMonth() && d1.getFullYear() == d2.getFullYear();

export const ptBrToDate = str => {
    const split = str.split('/');
    if (split.length !== 3) {
        return null;
    }

    return new Date(split[2]*1, split[1]*1, split[0]*1);
}

export const ptBrToCommon = (str, datetime=false) => {
    let hour;

    if (datetime) {
        let spaceSplit = str.split(' ');
        hour = spaceSplit.pop().split(':');
        str = spaceSplit.pop();  
    }

    const split = str.split('/').map(s => s.trim());
    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}-${split[1]}-${split[0]} ${
        datetime ? `${hour[0]}:${hour[1]}:00` : ''
    }`.trim();
} 

export const commonToPtBr = (str, datetime=false) => {
    let hour;

    if (!str) {
        return '';
    }

    if (datetime) {
        let spaceSplit = str.split(' ');
        hour = spaceSplit.pop().split(':');
        str = spaceSplit.pop();   
    }

    const split = str.split('-');

    if (datetime && hour.length !== 3) {
        return null;
    }

    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}/${split[1]}/${split[0]} ${
        datetime ? `${hour[0]}:${hour[1]}` : ''
    }`;
}

export const dateToPtBr = (date, datetime=false) => {
    if (! date) {
        return '';
    }

    if (typeof(date) !== 'object') {
        date = new Date(date+'');
    }

    return `${lpad(date.getDate())}/${lpad(date.getMonth()+1)}/${date.getFullYear()}${
        datetime ? ` ${lpad(date.getHours())}:${lpad(date.getMinutes())}` : ''
    }`;
}