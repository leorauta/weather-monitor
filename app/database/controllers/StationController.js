var StationModel = require('../models/StationModel');
var Mongoose = require('mongoose');

module.exports.insertStation = function (data) {
    var model = new StationModel({
        _id: new Mongoose.Types.ObjectId(), //id from the origin station
        index: data.index,
        name: data.name, //date of collect send from the weather station
        description: data.description, //description

        longitude: data.longitude, //date of storage on the database
        latitude: data.latitude, //degrees Celsius

        thermometer: data.thermometer, //temperature
        barometer: data.barometer, //pressure
        hygrometer: data.hygrometer,  //percentage
        anemometer: data.anemometer, //wind_speed
        windsock: data.windsock, //wind_direction
        pluviometer: data.pluviometer //precipitation
    });
    return model.save(function (err, station) {
        if (err) return console.error(err);
    });
};

module.exports.getStationById = function (id) {
    return StationModel.findOne({ '_id': id}, function (err, station) {
        if (err) return console.error(err);
    })
};

module.exports.getStationList = function () {
    var sort = {
        index: 'asc'
    };
    return StationModel.find(function (err, station) {
        if (err) return console.error(err);

    }).sort(sort);
};