module.exports = function(app){
    app.get('/heartbeat', function(req, res){
        res.status(200).end();
    });
};