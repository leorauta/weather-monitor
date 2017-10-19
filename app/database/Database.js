var mongoose = require('mongoose');
var Promise = require("bluebird");
mongoose.connect('mongodb://localhost/weathermonitor',{useMongoClient: true});

mongoose.Promise = Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('connect', function() {
    console.log("Conectou");
});

module.exports = db;