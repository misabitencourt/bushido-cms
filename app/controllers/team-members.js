const teamMemberSrv = require('../services/team-members');

module.exports = app => {
    app.get('/cms/team-member/id/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        teamMemberSrv.findById(id).then(tm => res.json(tm));
    });

    app.get('/team-member/id/:id/image', (req, res) => {
        const id = req.originalUrl.split('/').reverse()[1];
        teamMemberSrv.findById(id).then(cover => {
            const img = Buffer.from(cover.cover.split(',').pop(), 'base64')
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        });
    });

    app.get('/cms/team-member', (req, res) => {
        teamMemberSrv.retrieve('').then(teamMembers => {
            return res.json(teamMembers.map(teamMember => ({
                id: teamMember.id,
                name: teamMember.name,
                role: teamMember.role,
                description: teamMember.description,
                social_media: teamMember.social_media
            })));
        });
    });

    app.get('/cms/team-member', (req, res) => {
        teamMemberSrv.retrieve('').then(teamMembers => {
            return res.json(teamMembers.map(teamMember => ({
                id: teamMember.id,
                name: teamMember.name,
                role: teamMember.role,
                description: teamMember.description,
                social_media: teamMember.social_media,
                avatar: teamMember.avatar
            })));
        });
    });

    app.get('/cms/team-member/:search', (req, res) => {
        const search = req.originalUrl.split('/').pop();
        teamMemberSrv.retrieve(search).then(teamMembers => {
            return res.json(teamMembers.map(teamMember => ({
                id: teamMember.id,
                name: teamMember.name,
                role: teamMember.role,
                description: teamMember.description,
                social_media: teamMember.social_media
            })));
        });
    });

    app.post('/cms/team-member', (req, res) => {      
        const teamMember = req.body;          
        teamMemberSrv.create({
            id: teamMember.id,
            name: teamMember.name,
            role: teamMember.role,
            description: teamMember.description,
            social_media: teamMember.social_media,
            avatar: teamMember.avatar
        }).then(cover => {
            return res.json(cover);
        });
    });

    app.put('/cms/team-member/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        const teamMember = req.body;  
        teamMemberSrv.update({
            id,
            name: teamMember.name,
            role: teamMember.role,
            description: teamMember.description,
            social_media: teamMember.social_media,
            avatar: teamMember.avatar
        }).then(cover => {
            return res.json(cover);
        });
    });

    app.delete('/cms/team-member/:id', (req, res) => {
        const id = req.originalUrl.split('/').pop()*1;
        if (isNaN(id)) {
            return res.status(400);
        }
        teamMemberSrv.destroy(id).then(() => {
            return res.json({ok: true});
        });
    });
}