var Card = require('./card.js');
var CDs = require('./card_definition.js').CardDefinition;
var Side = require('./card_definition.js').Side;

function Deck (obj) {
  _.extend(this, obj);
}

Deck.getDummy = function () {
  return new Deck({
    identity:100,
    cards:[
      {cd_id:0, count:5},
      {cd_id:1, count:5},
      {cd_id:2, count:5},
      {cd_id:3, count:5},
      {cd_id:4, count:5}
    ]
  });
};

Deck.prototype.isRunner = function () {
  return CDs[this.identity].side === Side.RUNNER;
};

Deck.prototype.construct = function () {
  var deck = [];
  var cards = this.cards;
  for (var i = 0; i < cards.length; i++) {
    Card.fromDefinition(cards[i], deck);
  }
  return deck;
};

Deck.prototype.getIdentity = function () {
  // identities do not belong to any group
  return Card.fromDefinition(this.identity);
};

exports.Deck = Deck;