var mongoose = require('mongoose');
var Promise = require("bluebird");
//mongoose.connect('mongodb://localhost/weathermonitor',{useMongoClient: true});
mongoose.connect('mongodb://weathermonitor:weather2018@ds113703.mlab.com:13703/weathermonitor',{useMongoClient: true});

mongoose.Promise = Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('connect', function() {
    console.log("Conectou");
});

module.exports = db;
module.exports.dataController = require('./controllers/DataController');
module.exports.stationController = require('./controllers/StationController');
module.exports.idController = require('./controllers/IdController');
