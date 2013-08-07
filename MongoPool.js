var mongodb = require('mongodb');

function MongoPool(connectionUrl) {
    var MongoClient = mongodb.MongoClient,
        self = this;
    this.queue = [];

    MongoClient.connect(connectionUrl, function (err, db) {
        if (err) {
            return console.log(err);
        }
        console.log("Connected to mongodb database at " + connectionUrl);

        self.db = db;
        for (var i = 0; i < self.queue.length; i += 1) {
            var collection = new mongodb.Collection(self.db, self.queue[i].cn);
            self.queue[i].cb(collection);
        }
        self.queue = [];
    });
}

module.exports = MongoPool;

MongoPool.prototype.query = function(collectionName, callback) {
    if ('undefined' !== typeof this.db) {
        return callback(new mongodb.Collection(this.db, collectionName));
    }
    return this.queue.push({cn: collectionName, cb: callback})
};