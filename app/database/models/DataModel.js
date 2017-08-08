var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DataSchema   = new Schema({
    _data_id: Schema.Types.ObjectId,
    _station_id: Schema.Types.ObjectId, //id from the origin station

    collect_date: {type: Date, default: Date.now }, //date of collect send from the weather station
    storage_date: {type: Date, default: Date.now }, //date of storage on the database

    temperature: {type: Number, min: -99.9, max: 99.9}, //degrees Celsius
    atmospheric_pressure: {type: Number}, //millimetres of mercury
    relative_humidity: {type: Number, min: 0.0, max: 100.0},  //percentage
    wind_speed: {type: Number, min: 0.0}, //meters per second
    wind_direction: {type: Number, min: 0.0, max: 360.0}, // degrees
    precipitation: {type: Number, min: 0.0} //millimetres
});

module.exports = mongoose.model('Data', DataSchema);