/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
    , cards = require('./routes/card_definitions')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , cons = require('consolidate')
    , mongodb = require('mongodb')
    , config = require('./config');

var app = express();

app.engine('html', cons.hogan);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('netrunner4ever'));
app.use(extractAlerts);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

function extractAlerts(req, res, next) {
    var ascii, alerts;
    if (req.cookies.alerts) {
        ascii = new Buffer(req.cookies.alerts, 'base64').toString('ascii');
        try {
            alerts = JSON.parse(ascii);
        } catch (e) {
            console.log(ascii, e);
        }
        req.alerts = alerts;
        res.clearCookie('alerts');
    }
    next();
}

global.alert = function(res, obj) {
    var base64 = new Buffer(JSON.stringify(obj)).toString('base64');
    res.cookie('alerts', base64, { maxAge: 900000, httpOnly: true });
};

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/cards', cards.findAll);
app.get('/cards/new', cards.addCardForm);
app.get('/cards/:id/edit', cards.updateCardForm);
app.post('/cards', cards.addCard);
app.get('/cards/:id', cards.findById);
app.put('/cards/:id', cards.updateCard);
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
