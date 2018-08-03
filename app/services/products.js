const cms = require('../repos/cms');


function retrievePictures(products) {
    return Promise.all(products.map(product => {
        return cms.retrieve({
            modelName: 'product_photos',
            filters: 'product_id = :product_id',
            params: {product_id: product.id}
        }).then(photos => {
            product.photos = photos;
            return product;
        });
    }));
}

module.exports.create = product => cms.create({
    modelName: 'products',
    newRegister: {
        name: product.name,
        short_description: product.short_description,
        long_description: product.long_description,
        price: product.price
    }
}).then(created => {
    return Promise.all(product.photos.map(photo => {
        return cms.create({
            modelName: 'product_photos',
            newRegister: {
                description: '',
                data: photo,
                product_id: created.slice().pop()
            }
        });
    })).then(() => product);
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'products',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        }).then(products => retrievePictures(products))
    }

    return cms.list({modelName: 'products'}).then(products => retrievePictures(products))
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
    modelName: 'product_photos',
    id
});

module.exports.createImage = (id, image) => cms.create({
    modelName: 'product_photos',
    newRegister: {
        description: '',
        data: image,
        product_id: id
    }
});

