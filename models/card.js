var Routes = require('../routes');

var Card = module.exports = {};

var mapSetName = {
    "Core": 1,
    "What Lies Ahead": 2,
    "Trace Amount": 2,
    "Cyber Exodus": 2,
    "A Study in Static": 2,
    "Humanity's Shadow": 2,
    "Future Proof": 2,
    "Creation and Control": 3,
    "Opening Moves": 4,
    "Second Thoughts": 4,
    "Mala Tempora": 4,
    "Game Night Kits": 0
};

function alsciendeIndex(card) {
    var index = '' + card.setNumber;
    index = index.length >= 3 ? index : (new Array(3 - index.length + 1).join('0') + index);
    index = mapSetName[card.setName] + index;
    index = index.length >= 5 ? index : (new Array(5 - index.length + 1).join('0') + index);
    return index;
}

function imageUrl(card) {
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
          { rel: [ "self" ], href: imageUrl(card) }
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
  return addActions(baseObject(card), game, permission);
}


Card.alsciendeIndex = alsciendeIndex;
Card.imageUrl = imageUrl;
Card.toSiren = toSiren;