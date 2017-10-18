var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/weathermonitor',{useMongoClient: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('connect', function() {
    console.log("Conectou");
});

module.exports = db;