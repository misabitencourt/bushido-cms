


export default (name, width, height) => ({
    tag: 'img',
    attrs: {
        src: `img/${name}.svg`,
        width: width || 16,
        height: height || 16
    }
});