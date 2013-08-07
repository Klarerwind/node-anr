function query(options) {
    var queryString = [];
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            queryString.push(key + "=" + options[key]);
        }
    }
    queryString = queryString.join("&");
    return queryString.length ? "?" + queryString : '';
}

// gamePath => /games/:id
exports.gamePath = function (id, options) {
    return "/games/" + id + query(options);
};

exports.cardsPath = function (options) {
    return "/cards" + query(options);
};

exports.newCardPath = function (options) {
    return "/cards/new" + query(options);
};

exports.editCardPath = function (id, options) {
    if (typeof id['_id'] !== undefined) {
        id = id._id;
    }
    return "/cards/" + id + "/edit" + query(options);
};

exports.cardPath = function (id, options) {
    if (typeof id._id !== undefined) {
        id = id._id;
    }
    return "/cards/" + id + query(options);
};