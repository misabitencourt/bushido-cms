const request = require('supertest');
const session = require('./session')();
const { assert, expect } = require('chai');

module.exports = app => {
    describe('Macros CRUD should be working', function() {
        const macroSent = { 
            name: 'Page title',
            description: 'The page header title',
            strval: 'Company name',
            textval: 'Company name text',
            type: '1'
        };

        it("Create", done => {
            request(app)
                .post('/cms/macros/')
                .send(macroSent)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    request(app)
                        .post('/cms/macros/')
                        .send(macroSent)
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
                .get('/cms/macros')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const macros = res.body;
                    expect(macros).to.not.be.eql(undefined);
                    const macro = macros.reverse().pop();
                    expect(macro).to.not.be.eql(null);
                    assert(macro.name, macroSent.name);
                    assert(macro.description, macroSent.description);
                    assert(macro.strval, macroSent.strval);
                    assert(macro.textval, macroSent.textval);
                    assert(macro.type, macroSent.type);
                    macroSent.id = macro.id;
                    done();
                });
        });

        it("Update", done => {
            macroSent.name = `${macroSent.name} UPDATED`;
            macroSent.description = `${macroSent.description} UPDATED`;
            macroSent.strval = `${macroSent.strval} UPDATED`;
            macroSent.textval = `${macroSent.textval} UPDATED`;
            macroSent.type = '2';
            request(app)
                .put(`/cms/macros/${macroSent.id}`)
                .send(macroSent)
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
                .get('/cms/macros')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const macros = res.body;
                    expect(macros).to.not.be.eql(undefined);
                    const macro = macros.reverse().pop();
                    expect(macro).to.not.be.eql(null);
                    assert(macro.name, macroSent.name);
                    assert(macro.description, macroSent.description);
                    assert(macro.strval, macroSent.strval);
                    assert(macro.textval, macroSent.textval);
                    assert(macro.type, macroSent.type);
                    done();
                });
        });

        it("Delete", done => {
            request(app)
                .delete(`/cms/macros/${macroSent.id}`)
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
                .get('/cms/macros/')
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

