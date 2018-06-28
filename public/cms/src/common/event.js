

const emitter = mitt();

export const addEvent = (evt, fn) =>  {
    emitter.on(evt, fn);
};

export const emitEvent = (evt, data) => {
    emitter.emit(evt, data);
};

document.body.addEventListener('click', () => {
    getEls(document.body, '.dismissable').forEach(el => killEl(el));
});