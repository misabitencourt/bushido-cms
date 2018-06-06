

const emitter = mitt();

export const addEvent = (evt, fn) =>  {
    emitter.on(evt, fn);
};

export const emitEvent = (evt, data) => {
    emitter.emit(evt, data);
};