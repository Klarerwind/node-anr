var Permissions = {};
Permissions.CORP = 1;
Permissions.RUNNER = 2;
Permissions.BYSTANDER = 3;

exports.Permissions = Permissions;

Permissions.get = function(game, userId) {
    if (userId === game.corp.playerId) {
        return Permissions.CORP;
    } else if (userId === game.runner.playerId) {
        return Permissions.RUNNER;
    } else {
        return Permissions.BYSTANDER;
    }
};
