

module.exports = app => {
    app.get('/ping', (req, res) => {
        res.send('Its OK!!!');
    });
}