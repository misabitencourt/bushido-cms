

export const priceFormat = str => {
    str = str || '';
    if (isNaN(str)) {
        return '';
    }

    return `R$${parseFloat(str).toFixed(2)}`.split('.').join(',');
}