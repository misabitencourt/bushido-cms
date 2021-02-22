const cms = require('../repos/cms');


function retrievePictures(galleries) {
    return Promise.all(galleries.map(gallery => {
        return cms.retrieve({
            modelName: 'gallery_photos',
            filters: 'gallery_id = :gallery_id',
            params: {gallery_id: gallery.id}
        }).then(photos => {
            gallery.photos = photos;
            return gallery;
        });
    }));
}

module.exports.create = gallery => cms.create({
    modelName: 'galleries',
    newRegister: {
        name: gallery.name,
        short_description: gallery.short_description,
        long_description: gallery.long_description,
    }
}).then(created => {
    return Promise.all(gallery.photos.map(photo => {
        return cms.create({
            modelName: 'gallery_photos',
            newRegister: {
                description: '',
                data: photo,
                gallery_id: created.slice().pop()
            }
        });
    })).then(() => gallery);
});

module.exports.retrieve = search => {
    if (search.trim()) {
        return cms.retrieve({
            modelName: 'galleries',
            filters: 'title LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        }).then(galleries => retrievePictures(galleries))
    }

    return cms.list({modelName: 'galleries'}).then(galleries => retrievePictures(galleries))
};

module.exports.findById = id => {
    return cms.retrieve({
        modelName: 'galleries',
        filters: 'id = :id',
        params: {id}
    }).then(galleries => {
        const gallery = galleries.pop()
        if (! gallery) {
            return null;
        }

        return cms.retrieve({
            modelName: 'gallery_photos',
            filters: 'gallery_id = :gallery_id',
            params: {gallery_id: gallery.id}
        }).then(photos => {
            gallery.photos = photos;
            return gallery;
        });
    });
}

module.exports.update = gallery => cms.update({
    modelName: 'galleries',
    id: gallery.id,
    values: gallery
});

module.exports.destroy = id => cms.destroy({
    modelName: 'galleries',
    id
});

module.exports.destroyImage = id => cms.destroy({
    modelName: 'gallery_photos',
    id
});

module.exports.createImage = (id, image) => cms.create({
    modelName: 'gallery_photos',
    newRegister: {
        description: '',
        data: image,
        gallery_id: id
    }
});

