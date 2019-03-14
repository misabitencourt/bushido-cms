const request = require('supertest');
const session = require('./session')();
const { assert, expect } = require('chai');

module.exports = app => {
    describe('Article CRUD should be working', function() {
        const articleSent = { 
            title: 'My great article',
            description: 'That is my great article',
            menu_id: 2,
            text: `
                <h1>Article</h1>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
            `
        };

        it("Create", done => {
            request(app)
                .post('/cms/article/')
                .send(articleSent)
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    request(app)
                        .post('/cms/article/')
                        .send(articleSent)
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
                .get('/cms/article')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const articles = res.body;
                    expect(articles).to.not.be.eql(undefined);
                    const article = articles.reverse().pop();
                    expect(article).to.not.be.eql(null);
                    assert(article.title, articleSent.title);
                    assert(article.description, articleSent.description);
                    assert(article.text, articleSent.text);
                    articleSent.id = article.id;
                    done();
                });
        });

        it("Update", done => {
            articleSent.title = `${articleSent.name} UPDATED`;
            articleSent.description = `${articleSent.description} UPDATED`;
            request(app)
                .put(`/cms/article/${articleSent.id}`)
                .send(articleSent)
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
                .get('/cms/article')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const articles = res.body;
                    expect(articles).to.not.be.eql(undefined);
                    const article = articles.reverse().pop();
                    expect(article).to.not.be.eql(null);
                    assert(article.title, articleSent.title);
                    assert(article.description, articleSent.description);
                    assert(article.text, articleSent.text);
                    done();
                });
        });

        it("Delete", done => {
            request(app)
                .delete(`/cms/article/${articleSent.id}`)
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
                .get('/cms/article/')
                .set('Accept', 'application/json')
                .set('Auth-Token', session.user.token)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    const articles = res.body;
                    expect(articles.length).to.be.eql(1);
                    done();
                });
        });
    });
}

