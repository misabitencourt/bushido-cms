const request = require('supertest');
const session = require('./session')();
const { assert, expect } = require('chai');

module.exports = app => {
    describe('Macros CRUD should be working', function() {
        const menuSent = { 
            name: 'Products',
            description: 'Our products',
            order: 1
        };

        it("Create", done => {
            request(app)
                .post('/cms/macro/')
                .send(menuSent)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    request(app)
                        .post('/cms/macro/')
                        .send(menuSent)
                        .set('Accept', 'application/json')
                        .set('Auth-Token', session.user.token)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) throw err;
                            done();
                        });
                });
        });

        it("Retrieve", done => {
            request(app)
                .get('/cms/macro')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const menus = res.body;
                    expect(menus).to.not.be.eql(undefined);
                    const menu = menus.reverse().pop();
                    expect(menu).to.not.be.eql(null);
                    assert(menu.name, menuSent.name);
                    assert(menu.description, menuSent.description);
                    assert(menu.order, menuSent.order);
                    menuSent.id = menu.id;
                    done();
                });
        });

        it("Update", done => {
            menuSent.name = `${menuSent.name} UPDATED`;
            menuSent.description = `${menuSent.description} UPDATED`;
            menuSent.order = 2;
            request(app)
                .put(`/cms/macro/${menuSent.id}`)
                .send(menuSent)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it("Check update", done => {
            request(app)
                .get('/cms/macro')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const menus = res.body;
                    expect(menus).to.not.be.eql(undefined);
                    const menu = menus.pop();
                    expect(menu).to.not.be.eql(null);
                    assert(menu.name, menuSent.name);
                    assert(menu.description, menuSent.description);
                    assert(menu.order, menuSent.order);
                    done();
                });
        });

        it("Delete", done => {
            request(app)
                .delete(`/cms/macro/${menuSent.id}`)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it("Check deletion", done => {
            request(app)
                .get('/cms/macro/')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const menus = res.body;
                    expect(menus.length).to.not.be.eql(2);
                    done();
                });
        });
    });
}

