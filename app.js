/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
    , cards = require('./routes/cards')
    , game = require('./routes/game')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , mongodb = require('mongodb')
    , config = require('./config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
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

app.get('/', game.getGameView);
app.get('/cards', cards.findAll);
app.get('/cards/new', cards.addCardForm);
app.post('/cards', cards.addCard);
app.get('/cards/:id', cards.findById);
//app.get('/cards/:id/edit', cards.edit);
//app.put('/cards', cards.update);
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

//    var db = new MongoPool("mongodb://localhost:27017/test");
//    db.query('a_test_delete_me', function(collection) {
//        collection.insert({toppings: 3, size: "large"}, {w:1}, function(err, result) {
//            console.log(result);
//            collection.findOne(function(err, item) {
//                if (err) { console.log(err); }
//                console.log(item);
//            });
//        });
//    });
});
