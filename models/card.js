var Routes = require('../routes');
var CDs = require('../cds');
var Side = require('./card_definition.js').Side;

/* Properties:
 *  cd_id: ObjectID
 *  faceUp: boolean
 *  group: Array
 */

// Do not use this directly, instead use the Card Factory
// in the Game object
function Card (obj) {
  var cd = CDs[obj.cd_id];
  if (!cd) throw new Error("Could not find card definition.");   // TODO handle better

  obj = obj || {};
  _.defaults(this, obj, {
    faceUp: false,
    group: null
  });
  this.__proto__ = cd;    // might want to use Object.create instead, depending on performance testing
}

Card.fromDefinition = function (cd_id, group) {
  return new Card({
    cd_id: cd_id,
    group: group || null
  });
};

Card.prototype.isRunner = function () {
  return this.side === Side.RUNNER;
};

Card.prototype.moveTo = function (group) {
  this.group.slice(this.getIndex(), 1);
  group.push(this);
  this.group = group;
};

Card.prototype.moveToBottom = function (group) {
  this.group.slice(this.getIndex(), 1);
  group.unshift(this);
  this.group = group;
};

// lastIndexOf() for cards in a group
Card.prototype.getIndex = function() {
  var i, group = this.group;
  for (i = group.length-1; i >= 0; i--) {
    if (group[i]._id === this._id)
      return i;
  }
  return -1;
};

Card.prototype.baseObject = function() {
  return {
    class: [ "card" ],
    properties: {
      id: this._id,
      faceUp: this.faceUp,
      group: this.group,
      location: {
        id: this.loc.id,
        rank: this.loc.rank
      }
    },
    entities: [
      {
        class: [ "image" ],
        rel: [ "" ],
        links: [
          { rel: [ "self" ], href: this.imageUrl() }
        ]
      }
    ],
    links: [
      { rel: [ "self" ], href: Routes.gamePath(game._id) }
    ]
  };
};

function addActions(siren, game, permission) {
//  if ()
}

Card.prototype.toSiren = function(game, permission) {
  return addActions(this.baseObject(), game, permission);
};