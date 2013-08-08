var ObjectID = require('mongodb').ObjectID,
    Routes = require('../routes'),
    Card = require('../models/card');
    _ = require('underscore');

function cardNotFound(res, e) {
    res.status(404).send("Card not found: " + e.message);
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
            alerts: req.alerts,
            title: "All cards",
            cards: results,
            addPath: Routes.newCardPath()
        });
    });
};

exports.findById = function (req, res) {
    var id, collection = global.db.collection('cards');

    try {
        id = new ObjectID(req.params.id);
    } catch (e) {
        return cardNotFound(res, e);
    }

    collection.findOne({_id: id}, function(err, card) {
        if (err) console.warn(err.message);
        if (!card) return cardNotFound(res, "card is null");

        var sFaction = {},
            sType = {};

        card.imageUrl = Card.imageUrl(card);
        sFaction[toCamelCase(card.faction)] = true;
        sType[toCamelCase(card.type)] = true;

        res.render('cards/show', {
            alerts: req.alerts,
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

    if (alerts.length) {
        return res.render('cards/add', {
            alerts: req.alerts,
            title: "Add a new card",
            card: card
        });
    }

    var collection = global.db.collection('cards');
    collection.insert(card, {w:1}, function() {
        var alerts = {type: "success", message: '<strong>Success!</strong> <i>'
            + card.title + '</i> was added. <a href="'
            + Routes.newCardPath() + '" class="alert-link">Add another</a>'},
            base64 = new Buffer(JSON.stringify(alerts)).toString('base64');
        res.cookie('alerts', base64, { maxAge: 900000, httpOnly: true });
        res.redirect(Routes.cardPath(card));
    });
};

exports.updateCardForm = function (req, res) {
    var id, collection = global.db.collection('cards');

    try {
        id = new ObjectID(req.params.id);
    } catch (e) {
        return cardNotFound(res, e);
    }

    collection.findOne({_id: id}, function(err, card) {
        if (err) console.warn(err.message);
        if (!card) return cardNotFound(res, "card is null");

        var sFaction = {},
            sType = {};

        card.imageUrl = Card.imageUrl(card);
        sFaction[toCamelCase(card.faction)] = true;
        sType[toCamelCase(card.type)] = true;

        res.render('cards/form', {
            alerts: req.alerts,
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

    try {
        card._id = new ObjectID(card._id);
    } catch (e) {
        return cardNotFound(res, e);
    }

    if (alerts.length) {
        global.alert(res, alerts);
        return res.redirect(Routes.editCardPath(card));
    }

    var collection = global.db.collection('cards');
    collection.update({_id: card._id}, card, {w:1}, function(err) {
        if (err) console.warn(err.message);

        var alerts = {type: "success", message: '<strong>Success!</strong> <i>'
            + card.title + '</i> was updated. <a href="'
            + Routes.cardsPath() + '" class="alert-link">View all cards</a>'};
        global.alert(res, alerts);
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
        "_id": card._id,        // this will be a string instead of an MongoDB ObjectID
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