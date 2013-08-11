var should = require('should'),
  sinon = require('sinon');

var mapSetName = [
  "Core",
  "What Lies Ahead",
  "Trace Amount",
  "Cyber Exodus",
  "A Study in Static",
  "Humanity's Shadow",
  "Future Proof",
  "Creation and Control",
  "Opening Moves",
  "Second Thoughts",
  "Mala Tempora",
  "Game Night Kits"
];

function mockCardDefinitions() {
  var mockObjs = [];
  for (var i = 0; i < 10; i++) {
    mockObjs[i] = {
      _id: i,
      title: "card " + i,
      type: "type " + i,
      subtype: "subtype " + i,
      setName: mapSetName[i % mapSetName.length],
      setNumber: i*10+1
    };
  }
  return mockObjs;
}

describe('CardDefinition', function () {

  describe('cacheAll()', function() {
    it('should retrieve all card definitions', function() {
      var cursor = {
          toArray: function (fn) {
            fn(null, mockCardDefinitions());
          }
        },
        findFn = sinon.stub().returns(cursor),
        collectionFn = sinon.stub().withArgs('card_definitions').returns({find: findFn});

      global.db = {};
      global.db.collection = collectionFn;

      var cds = require('../cds');
      var CardDefinition = require('../models/card_definition.js').CardDefinition;

      CardDefinition.cacheAll();
      cds.should.be.a('object');
      cds.should.have.property(2);
      cds[2].should.have.property('_id', 2);
      cds[2].should.have.property('title', 'card 2');
      cds.should.have.property(5);
      cds[5].should.have.property('_id', 5);
      cds[5].should.have.property('title', 'card 5');
    });
  });

  describe('instance methods', function() {
    var CardDefinition;

    before(function() {
      CardDefinition = require('../models/card_definition.js').CardDefinition;
    });

    describe('#alsciendeIndex()', function() {
      it('should return null if setName or setNumber not present', function() {
        var cd = new CardDefinition({});
        should.strictEqual(cd.alsciendeIndex(), null);
      });

      it('should return index if setName and setNumber present', function() {
        var cd = new CardDefinition({setName: "What Lies Ahead", setNumber: 5});
        cd.alsciendeIndex().should.equal("02005");
      });
    });

    describe('#imageUrl()', function() {
      it('should return null if setName or setNumber not present', function() {
        var cd = new CardDefinition({});
        should.strictEqual(cd.imageUrl(), null);
      });

      it('should return index if setName and setNumber present', function() {
        var cd = new CardDefinition({setName: "What Lies Ahead", setNumber: 5});
        cd.imageUrl().should.equal("http://netrunnercards.info/assets/images/cards/300x418/02005.png");
      });
    });
  });
});