function query(options) {
    var queryString = [];
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            queryString.push(key + "=" + options[key]);
        }
    }
    return "?" + queryString.join("&");
}

// gamePath => /games/:id
exports.gamePath = function (id, options) {
    return "/games/" + id + query(options);
};
