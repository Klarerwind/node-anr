/*
 * CardDefinition objects represent the properties of a card
 * that are printed on the card and do not change.
 *
 * CDs are read from the database and then cached in memory.
 */

var _ = require('underscore'),
  ObjectID = require('mongodb').ObjectID,
  cds = require('../cds');

var SET_NAMES = {
  "Core":1,
  "What Lies Ahead":2,
  "Trace Amount":2,
  "Cyber Exodus":2,
  "A Study in Static":2,
  "Humanity's Shadow":2,
  "Future Proof":2,
  "Creation and Control":3,
  "Opening Moves":4,
  "Second Thoughts":4,
  "Mala Tempora":4,
  "Game Night Kits":0
};

var Side = {
  RUNNER: "Runner",
  CORPORATION: "Corp"
};

var CardDefinition = function (obj) {
  _.extend(this, obj);    // note: shallow copy
};

// This function modifies global state!!!
// Query for and store all card definitions in memory
CardDefinition.cacheAll = function(callback) {
  var collection = global.db.collection('card_definitions');

  collection.find().toArray(function (err, results) {
    if (err) return callback(err);

    _.each(results, function (plainObj) {
      // decorate with the CardDefinition prototype
      cds[plainObj._id] = new CardDefinition(plainObj);
    });
  });
  Object.freeze(cds);
};

CardDefinition.prototype.alsciendeIndex = function () {
  var missingFields = (typeof this.setName === 'undefined'
                    || typeof this.setNumber === 'undefined');

  if (missingFields) {
    return null;
  }

  var index = '' + this.setNumber;
  index = index.length >= 3 ? index : (new Array(3 - index.length + 1).join('0') + index);
  index = SET_NAMES[this.setName] + index;
  index = index.length >= 5 ? index : (new Array(5 - index.length + 1).join('0') + index);
  return index;
};

CardDefinition.prototype.imageUrl = function () {
  var index = this.alsciendeIndex();
  var baseUrl = "http://netrunnercards.info/assets/images/cards/300x418/";
  return index ? baseUrl + this.alsciendeIndex() + ".png" : null;
};

exports.CardDefinition = CardDefinition;
exports.Side = Side;