
const lpad = (value, length, char=' ') => {
    let result = `${value}` || '';
    while (result.length < length) {
        result = `${char}${result}`;
    }

    return result;
};

module.exports.lpad = lpad;


module.exports.dateToYMD = date => {
    if (! date) {
        return '';
    }

    if (! (date.getTime && date.getDate && 
           date.getMonth && date.getFullYear) ) {
        date = new Date(`${date}`);
    }

    return `${date.getFullYear()}-${lpad(date.getMonth(), 2, 0)}-${lpad(date.getDate(), 2, 0)}`
}