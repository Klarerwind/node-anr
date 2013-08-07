var GameProvider = require('../models/GameProvider.js').GameProvider
  , Permissions = require('../permissions.js').Permissions;

/*
 * GET users listing.
 */

/* Preconditions
 *  permissions - object of type permissions
 *  output is a hash or undefined/null
 *
 *
 *
 */

function transformPlayerInfo(permissions, input, output) {
  output = output || {};
}

exports.getGameView = function (req, res) {
  // authenticate user here...
  var gameProvider = new GameProvider();
  gameProvider.findById(req.query.id, function (err, game) {
    var permissions = Permissions.get(game, req.query.userId);

    // verify click/credit/deck/hand count (use dirty bit?)

    // loop through each card and render JSON

    return res.json(game);
  });
//    Game.getView(game, userId);
};
