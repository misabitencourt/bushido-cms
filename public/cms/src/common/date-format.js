


export const ptBrToDate = str => {
    const split = str.split('/');
    if (split.length !== 3) {
        return null;
    }

    return new Date(split[2]*1, split[1]*1, split[0]*1);
}

export const ptBrToCommon = str => {
    const split = str.split('/');
    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}-${split[1]}-${split[0]}`;
} 

export const commonToPtBr = str => {
    const split = str.split('-');
    if (split.length !== 3) {
        return null;
    }

    return `${split[2]}/${split[1]}/${split[0]}`;
}