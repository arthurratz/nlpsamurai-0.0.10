'use strict';

var mySql = require('mysql');

module.exports = {
    createMySqlConnection: function (conn_string) {
        return mySql.createConnection(conn_string);
    },

    closeMySqlConnection: function () {
        MySql.closeMySqlConnection();
    },

    execMySqlQuery: function (con_db, query) {
        return new Promise(async (resolve, reject) => {
            await con_db.query(query, function (err, results) {
               if (err) throw err; else resolve(results);
            });
        });
    }
}