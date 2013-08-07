var Routes = require('../routes');

var Game = module.exports = {};

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