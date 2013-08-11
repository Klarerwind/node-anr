var Routes = require('../routes');
var ObjectID = require('mongodb').ObjectID;

/* Enums */
var GamePhase = {
  DRAW_PHASE: "DRAW_PHASE",
  ACTION_PHASE: "ACTION_PHASE",
  DISCARD_PHASE: "DISCARD_PHASE"
};

var GameStatus = {
  WAITING: "WAITING"
};

function Game (obj) {
  _.extend(this, obj);  // decorate object with Game prototype
}

// Returns a new blank game
Game.new = function () {
  return new Game({
    turnNumber: 0,
    phase: "",
    status: GameStatus.WAITING,
    lastModified: Date.now(),
    corp: null,
    runner: null,
    table: []
  });
};

// deck is an array of (cdids, qty, name)
Game.addPlayer = function (user, deck) {
  var identity = deck.getIdentity();
  var cardArray = deck.construct();
  var player = {
    user_id: user._id,
    credits: 0,
    clicks: 0,
    deck: cardArray,
    hand: [],
    discard: []
  };

  if (identity.isRunner()) {
    this.runner = player;
    this.runner.tags = 0;
  } else {
    this.corp = player;
    this.corp.badPublicity = 0;
  }
};

Game.findById = function (id, callback) {
  if (!ObjectID.isPrototypeOf(id)) {
    try {
      id = new ObjectID(id);
    } catch (e) {
      return callback("invalid ObjectID");
    }
  }

  var collection = global.db.collection('games');
  collection.findOne({_id: id}, function(err, gameJSON) {
    if (err) callback(err.message);
    callback(null, new Game(gameJSON));
  });
};

Game.prototype.save = function (callback) {
  var collection = global.db.collection('games');
  collection.save(this, {w:1}, function(err, results) {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

function baseObject(game) {
  return {
    class: [ "game" ],
    properties: {
      id: game._id,
      turnNumber: game.turnNumber,
      phase: game.phase,
      status: game.status,
      lastModified: game.timestamp,
      corp: {
        credits: game.corp.credits,
        clicks: game.corp.clicks,
        deck: game.corp.deck,
        hand: game.corp.hand,
        badPublicity: game.corp.badPublicity
      },
      runner: {
        credits: game.runner.credits,
        clicks: game.runner.clicks,
        deck: game.runner.deck,
        hand: game.runner.hand,
        tags: game.runner.tags
      }
    },
    links: [
      { rel: [ "self" ], href: Routes.gamePath(game._id) }
    ]
  };
}

function addCards(siren, game, permission) {
  return _.extend(siren, {
    entities: {}
  });
}

function addActions(siren, game, permission) {

}

function toSiren() {

}

exports.Game = Game;
exports.GamePhase = GamePhase;
exports.GameStatus = GameStatus;