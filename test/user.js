const request = require('supertest');
const session = require('./session')();
const { assert, expect } = require('chai');

module.exports = app => {
    describe('User CRUD should be working', function() {
        const userSent = { 
            name: 'John Deere',
            email: 'john@company.com', 
            password: 'testing',
            acl: 'user;menu',
            phone: '5555 5555'
        };

        it("Create", done => {
            request(app)
                .post('/cms/user/')
                .send(userSent)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it("Retrieve", done => {
            request(app)
                .get('/cms/user')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const users = res.body;
                    expect(users).to.not.be.eql(undefined);
                    const user = users.reverse().pop();
                    expect(user).to.not.be.eql(null);
                    assert(user.name, userSent.name);
                    assert(user.acl, userSent.acl);
                    assert(user.phone, userSent.phone);
                    userSent.id = user.id;
                    done();
                });
        });

        it("Update", done => {
            userSent.name = `${userSent.name} UPDATED`;
            userSent.phone = `${userSent.phone} UPDATED`;
            userSent.acl = `${userSent.acl};article`;
            userSent.email = `aaa${userSent.email}`;
            request(app)
                .put(`/cms/user/${userSent.id}`)
                .send(userSent)
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
                .get('/cms/user')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const users = res.body;
                    expect(users).to.not.be.eql(undefined);
                    const user = users.pop();
                    expect(user).to.not.be.eql(null);
                    assert(user.name, userSent.name);
                    assert(user.acl, userSent.acl);
                    assert(user.phone, userSent.phone);
                    assert(user.id, userSent.id);
                    done();
                });
        });

        it("Delete", done => {
            request(app)
                .delete(`/cms/user/${userSent.id}`)
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
                .get('/cms/user/')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const users = res.body;
                    expect(users).to.not.be.eql(1);
                    done();
                });
        });
    });
}

