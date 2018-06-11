const cms = require('../repos/cms');

module.exports.create = product => cms.create({
    modelName: 'products',
    newRegister: product
}).then(product => {
    return Promise.all(product.photos.map(photo => {
        return cms.create({
            modelName: 'product_photos',
            newRegister: {
                description: photo.description,
                data: photo.base64
            }
        });
    })).then(() => product);
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'products',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`},
            leftJoins: [{table: 'product_images', localField: 'id', foreignField: 'products_id'}]
        })
    }

    return cms.list({modelName: 'products'})
};

module.exports.update = product => cms.update({
    modelName: 'products',
    id: product.id,
    values: product
});

module.exports.destroy = id => cms.destroy({
    modelName: 'products',
    id
});

module.exports.destroyImage = id => cms.destroy({
    modelName: 'product_images',
    id
});


