var DataModel = require('../models/DataModel');
var Mongoose = require('mongoose');

module.exports.insertData = function (data) {
    // var date = Date(data.collect_date);
    // console.log(date);
    var model = new DataModel({
        //_id: undefined,
        _station_id: data.station,

        collect_date: new Date(), //example "2012-12-19T06:01:17Z"
        // storage_date: {type: Date, default: Date.now }, //date of storage on the database

        temperature: data.temperature, //degrees Celsius
        atmospheric_pressure: data.atmospheric_pressure, //millimetres of mercury
        relative_humidity: data.relative_humidity,  //percentage
        wind_speed: data.wind_speed, //meters per second
        wind_direction: data.wind_direction, // degrees
        precipitation: data.precipitation //millimetres
    });
    model.save(function (err, data) {
        if (err) return console.error(err);
    });
};

module.exports.getData = function () {

};