const config = require('dotenv').config().parsed;
const request = require('supertest');
const fs = require('fs');
const session = require('./session')();
const { assert, expect } = require('chai');

try {
    fs.unlinkSync('cms.test.db');
} catch (e) {
    // Silent...
}


module.exports = app => {
    describe('Login should be authenticating', function() {
        beforeEach(function(done) {
            this.timeout(8e3); // A very long environment setup. (migrations)
            setTimeout(done, 5e3);
        });

        it("Block invalid user", done => {
            request(app)
                .post('/cms/login')
                .send({ email: 'invalid@invalid.com', passwd: 'invalid' })
                .set('Accept', 'application/json')
                .expect(403)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
        
        it("Authenticate valid user", done => {
            request(app)
                .post('/cms/login')
                .send({ email: config.ADMIN_EMAIL, passwd: config.SECRET_WORD })
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const user = res.body;
                    session.user = user;
                    assert(user.email, config.ADMIN_EMAIL);
                    expect(user).to.not.have.own.property('password');
                    expect(user).to.have.own.property('token');
                    done();
                });
        });
    });
    

    
}