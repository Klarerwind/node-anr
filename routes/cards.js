var ObjectID = require('mongodb').ObjectID,
    Routes = require('../routes'),
    _ = require('underscore');

function cardNotFound(res) {
    res.status(404).send("Card not found");
}

function toCamelCase(str) {
    var words = str.split(/\s|\-/), i;
    words[0] = words[0].toLowerCase();
    for (i = 1; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join('');
}

exports.findAll = function (req, res) {
    var collection = global.db.collection('cards');

    collection.find().toArray(function (err, results) {
        if (err) throw err;
        _.each(results, function(card) {
            card.editPath = "/cards/" + card._id;

            if (card.type === "Identity") {
                card.identity = "[" + card.baseLink + "] " + card.minimumDeckSize + "-" + card.influenceLimit;
            } else if (card.type === "Agenda") {
                card.agenda = card.advancementReq + "-" + card.agendaPoints;
            } else {
                card.influenceDots = new Array(toInt(card.influenceValue) + 1).join("●");
                card.influenceColor = "influence-" + card.faction.toLowerCase().replace(' ', '-');
            }
        });
        res.render('cards/index', {
            title: "All cards",
            cards: results
        });
    });
};

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

exports.findById = function (req, res) {
    var id, collection = global.db.collection('cards');

    try {
        id = new ObjectID(req.params.id);
    } catch (Exception) {
        return cardNotFound(res);
    }

    collection.findOne({_id: id}, function(err, card) {
        if (err) throw err;
        if (!card) return cardNotFound(res);

        var sFaction = {},
            sType = {},
            ascii,
            alerts;

        card.imageUrl = "http://netrunnercards.info/assets/images/cards/300x418/" + alsciendeIndex(card) + ".png";
        sFaction[toCamelCase(card.faction)] = true;
        sType[toCamelCase(card.type)] = true;

        if (req.cookies.alerts) {
            ascii = new Buffer(req.cookies.alerts, 'base64').toString('ascii');
            try {
                alerts = JSON.parse(ascii);
            } catch (e) {
                console.log(ascii, e);
            }
            res.clearCookie('alerts');
        }

        res.render('cards/show', {
            alerts: alerts,
            title: "Viewing " + card.title,
            header: "View Card (" + card._id + ")",
            card: card,
            editPath: Routes.editCardPath(card),
            sFaction: sFaction,
            sType: sType
        });
    });
};

exports.addCardForm = function (req, res) {
    res.render('cards/form', {
        title: "Add a new card",
        header: "Add Card",
        submitPath: Routes.cardsPath(),
        script: "/javascripts/cards/add.js"
    });
};

exports.addCard = function (req, res) {
    var card = parseCard(req.body.card),
        alerts = validateCard(card);

    console.log(card);

    if (alerts.length) {
        // TODO should redirect to show instead
        return res.render('cards/add', {
            alerts: alerts,
            title: "Add a new card",
            card: card
        });
    }

    var collection = global.db.collection('cards');
    collection.insert(card, function() {
        var alerts = [{type: "success", message: 'Added "' + card.title + '" successfully.'}],
            base64 = new Buffer(JSON.stringify(alerts)).toString('base64');
        res.cookie('alerts', base64, { maxAge: 900000, httpOnly: true });
        res.redirect(Routes.cardPath(card));
    });
};

exports.updateCardForm = function (req, res) {
    var id, collection = global.db.collection('cards');

    try {
        id = new ObjectID(req.params.id);
    } catch (Exception) {
        return cardNotFound(res);
    }

    collection.findOne({_id: id}, function(err, card) {
        if (err) throw err;
        if (!card) return cardNotFound(res);

        var sFaction = {},
        sType = {};

        card.imageUrl = "http://netrunnercards.info/assets/images/cards/300x418/" + alsciendeIndex(card) + ".png";
        sFaction[toCamelCase(card.faction)] = true;
        sType[toCamelCase(card.type)] = true;

        res.render('cards/form', {
            title: "Edit Card",
            header: "Edit Card (" + card._id + ")",
            card: card,
            submitPath: Routes.cardPath(card),
            script: "/javascripts/cards/add.js",
            update: true,
            sFaction: sFaction,
            sType: sType
        });
    });
};

exports.updateCard = function (req, res) {
    var card = parseCard(req.body.card),
    alerts = validateCard(card);

    console.log(card);

    if (alerts.length) {
        // TODO should redirect to show instead
        return res.render('cards/add', {
            alerts: alerts,
            title: "Add a new card",
            card: card
        });
    }

    var collection = global.db.collection('cards');
    collection.insert(card, function() {
        var alerts = [{type: "success", message: 'Updated "' + card.title + '" successfully.'}],
        base64 = new Buffer(JSON.stringify(alerts)).toString('base64');
        res.cookie('alerts', base64, { maxAge: 900000, httpOnly: true });
        res.redirect(Routes.cardPath(card));
    });
};

//var cardTypes = ["Identity", "Operation", "Agenda", "Ice", "Upgrade", "Asset",
//    "Hardware", "Resource", "Program", "Event"];

//function errorMessage (msg) {
//    return {type: "danger", message: msg};
//}
//
//function blank (obj) {
//    return typeof obj === 'undefined' || obj === null || obj === '';
//}

function validateCard (card) {
//    var errors = [], highlights = [];
//
//    // Properties common to all card types
//    if ( blank(card.title) ) {
//        errors.push("Missing card title");
//        highlights.push('title');
//    }
//    if (! _.contains(cardTypes, card.type)) {
//        errors.push("Invalid card type");
//        highlights.push('type');
//    }
//
//    // Properties of specific card types
//    if (card.type === "Identity") {
//        if ( blank(card.mininumDeckSize) ) {
//            errors.push("Missing minimum deck size");
//            highlights.push('minimumDeckSize');
//        }
//        if ( blank(card.influenceLimit) ) {
//            errors.push("Missing influence limit");
//            highlights.push('influenceLimit');
//        }
//    } else if (card.type === "Operations") {
//        if ( blank(card.operations) ) {
//
//        }
//    }
    return [];
}

function toInt(val) {
    return parseInt(val, 10);
}

function removeUndefinedFields(obj) {
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof obj[i] === 'undefined') {
                delete obj[i];
            }
        }
    }
    return obj;
}

function parseCard (card) {
    var _card = {
        "title": card.title,
        "unique": card.unique,
        "faction": card.faction,
        "type": card.type,
        "subtype": card.subtype,
        "setName": card.setName,
        "setNumber": card.setNumber,
        "code": card.code
    };

    if (card.type !== "Identity" && card.type !== "Agenda") {
        _card.influenceValue = card.influenceValue;
    }

    if (card.type === "Identity") {
        _card.baseLink = toInt(card.baseLink);
        _card.minimumDeckSize = toInt(card.minimumDeckSize);
        _card.influenceLimit = toInt(card.influenceLimit);
    } else if (card.type === "Operation" || card.type === "Event") {
        _card.playCost = toInt(card.playCost);
    } else if (card.type === "Agenda") {
        _card.advancementReq = toInt(card.advancementReq);
        _card.agendaPoints = toInt(card.agendaPoints);
    } else if (card.type === "Ice") {
        _card.rezCost = toInt(card.rezCost);
        _card.strength = toInt(card.strength);
    } else if (card.type === "Upgrade" || card.type === "Asset") {
        _card.rezCost = toInt(card.rezCost);
        _card.trashCost = toInt(card.trashCost);
    } else if (card.type === "Hardware" || card.type === "Resource") {
        _card.installCost = toInt(card.installCost);
    } else if (card.type === "Program") {
        _card.installCost = toInt(card.installCost);
        _card.memoryCost = toInt(card.memoryCost);
        _card.strength = toInt(card.strength);
    }

    return removeUndefinedFields(_card);
}