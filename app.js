/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
    , game = require('./routes/games')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , mongodb = require('mongodb')
    , config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3939);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//app.get('/', game.getGameView);
app.get('/games', game.getGameJSON);
app.get('/games/new', game.createNewGame);
//app.delete('/cards/:id', cards.delete);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));

    mongodb.MongoClient.connect(config.db_url, function (err, db) {
        if (err) {
            return console.log(err);
        }
        console.log("Connected to mongodb database at " + config.db_url);

        global.db = db;
    });
});
