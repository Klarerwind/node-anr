var Routes = require('../routes');
var VCards = require('../vcards');

var Card = module.exports = {};

function alsciendeIndex(card) {
  var index = '' + card.setNumber;
  index = index.length >= 3 ? index : (new Array(3 - index.length + 1).join('0') + index);
  index += card.setName;
  index = index.length >= 5 ? index : (new Array(5 - index.length + 1).join('0') + index);
  return index;
}

function imagePath(card) {
  return "http://netrunnercards.info/assets/images/cards/300x418/" + alsciendeIndex(card) + ".png";
}

function baseObject(card) {
  return {
    class: [ "card" ],
    properties: {
      id: card._id,
      faceUp: card.faceUp,
      location: {
        id: card.loc.id,
        rank: card.loc.rank
      }
    },
    entities: [
      {
        class: [ "image" ],
        rel: [ "" ],
        links: [
          { rel: [ "self" ], href: imagePath(card) }
        ]
      }
    ],
    links: [
      { rel: [ "self" ], href: Routes.gamePath(game._id) }
    ]
  };
}

function addActions(siren, game, permission) {
//  if ()
}

function toSiren(card, game, permission) {
  return addActions(baseObject(card))
}

Card.toSiren = toSiren;