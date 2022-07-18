var Refferal   = require("../models/Refferal");

module.exports = function (socket, crypter) {
    /**
     * Refferal History
     * @param uid
     */
    function RefHistory(uid) {
        Refferal.get(uid, function (result) {
            socket.emit('ref_history',crypter.encrypt({ data: result }));
        })
    }
    return {
        RefHistory
    }
};