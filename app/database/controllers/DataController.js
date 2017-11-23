var DataModel = require('../models/DataModel');

module.exports.insertData = function (data, indexStation, index) {
    var model = new DataModel({
        _station_id: data.station,
        index: index,
        station: indexStation,

        collect_date: data.collect_date !== undefined ? new Date(data.collect_date) : undefined, //example "2012-12-19T06:01:17Z"

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

module.exports.getData = function (stations, startD, endD, limit, referenceId) {
    var startDate = startD !== undefined ? new Date(startD) : undefined;
    var endDate = endD !== undefined ? new Date(endD) : undefined;
    limit = !isNaN(limit) ? parseInt(limit) : 10;


    var query = {};

    if (startDate !== undefined) {
        if (endDate !== undefined){
            query.storage_date = {$gt: startDate, $lt: endDate};
        } else {
            query.storage_date = {$gt: startDate};
        }
    } else if (endDate !== undefined){
        query.storage_date = {$lt: endDate};
    }
    if (stations !== undefined){
        query.station =  {$in: stations}
    }

    if (referenceId !== undefined){
        query.index = {$gt: referenceId};
    }

    var sort = {
        storage_date: 'desc'
    };

    var fields = 'index station storage_date collect_date temperature atmospheric_pressure relative_humidity wind_speed wind_direction precipitation';

    return DataModel.find(query, fields ,function (err, data) {
        if (err) return console.error(err);
    }).sort(sort).limit(limit);
};