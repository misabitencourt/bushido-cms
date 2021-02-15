const cms = require('../repos/cms');

module.exports.findById = id => {
    return cms.retrieve({
        modelName: 'team_members',
        filters: 'id = :id',
        params: {id}
    }).then(teamMembers => teamMembers.pop());
}

module.exports.create = cover => cms.create({
    modelName: 'team_members',
    newRegister: cover
});

module.exports.retrieve = search => {
    let list;

    if ((search || '').trim()) {
        list = cms.retrieve({
            modelName: 'team_members',
            filters: 'name LIKE :search OR description LIKE :search',
            params: {search: `%${search || ''}%`}
        })
    } else {
        list = cms.list({modelName: 'team_members'});
    }
    
    return list.then(teamMembers => teamMembers.map(teamMember => ({
        id: teamMember.id,
        name: teamMember.name,
        description: teamMember.description,
        social_media: teamMember.social_media
    })));
};

module.exports.update = teamMember => cms.update({
    modelName: 'team_members',
    id: teamMember.id,
    values: teamMember
});

module.exports.destroy = id => cms.destroy({
    modelName: 'team_members',
    id
});

