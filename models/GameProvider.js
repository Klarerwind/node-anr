var gameCounter = 1;

GameProvider = function () {};
GameProvider.prototype.dummyData = [];

GameProvider.prototype.findById = function(id, callback) {
    var result = null;
    for (var i = 0; i < this.dummyData.length; i++) {
        if (this.dummyData[i]._id = id) {
            result = this.dummyData[i];
            break;
        }
    }
    callback(null, result);
};

GameProvider.prototype.save = function(games, callback) {
    var game = null;

    if (typeof(games.length) == "undefined") {
        games = [games];
    }

    for (var i = 0; i < games.length; i++) {
        game = games[i];
        game._id = gameCounter++;
        game.created_at = new Date();
        this.dummyData.push(game);
    }
    callback(null, games);
};

// bootstrap with fixtures
new GameProvider().save([
    {
        _id: 135, turnNumber: 1, phase: "Action", status: "String", lastModified: 1345, corp: {
        credits: 5, clicks: 3, deck: 40, hand: 5, badPublicity: 0, serverCount: 0
    }, runner: {
        credits: 5, clicks: 0, deck: 40, hand: 5, tags: 0
    }, cards: [
        {}
        ,
        {}
    ], callbacks: {
        onTurnBegin: [], onTurnEnd: [], onInstall: [], onRez: [], onScoreAgenda: [], onIceApproach: [], onJackOut: [], onIceEncounter: [], onBreakSubroutine: [], onRunBegin: [], onRunEnd: [], onTraceBegin: [], onTraceEnd: [], onDamage: [], onCardAccess: [], onCardTrash: []
    }, modifiers: {
        installCost: [], rezCost: [], advancementReq: [], trashCost: [], iceStr: [], icebreakerStr: [], traceStr: [], linkStr: [], memoryCost: [], memoryLimit: [], maxHandSize: []
    }
    }
], function(error, games) {});

exports.GameProvider = GameProvider;