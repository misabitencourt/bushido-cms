function createCanvas(dimension) {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = '-99999px';
    canvas.width = dimension.width;
    canvas.height = dimension.height;

    return canvas;
};

export default (src, dimension, compress) => new Promise((callback, error) => {
    const image = new Image();
    
    image.onerror = () => error();

    image.onload = function() {
        let canvas,
            ctx,
            ratio,
            image = this,
            realWidth = image.width,
            realHeight = image.height;

        dimension = dimension || {};
        if (dimension.width > dimension.height) {
            image.width = dimension.width || 800;
            ratio = (image.width * 100) / realWidth;
            image.height = realHeight * (ratio / 100);
        } else {
            image.height = dimension.height || 600;
            ratio = (image.height * 100) / realHeight;
            image.width = realWidth * (ratio / 100);
        }
        canvas = createCanvas({ width: image.width, height: image.height });
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        callback(canvas.toDataURL('image/jpeg', compress || '0.5'));
        document.body.removeChild(canvas);
    };

    image.src = src;
});