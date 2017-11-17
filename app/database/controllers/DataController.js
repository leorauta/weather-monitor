var DataModel = require('../models/DataModel');

module.exports.insertData = function (data) {
    var model = new DataModel({
        _station_id: data.station,

        collect_date: new Date(), //example "2012-12-19T06:01:17Z"

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

module.exports.getData = function (startD, endD, limit) {
    var startDate = startD !== undefined ? new Date(startD) : undefined;
    var endDate = endD !== undefined ? new Date(endD) : new Date();
    limit = !isNaN(limit) ? parseInt(limit) : 10;


    var query = {
        storage_date: {$gt: startDate, $lt: endDate}
    };
    var sort = {
        storage_date: 'desc'
    };

    var fields = '_station_id storage_date temperature atmospheric_pressure relative_humidity wind_speed wind_direction precipitation';

    return DataModel.find(query, fields ,function (err, data) {
        if (err) return console.error(err);
    }).sort(sort).limit(limit);
};