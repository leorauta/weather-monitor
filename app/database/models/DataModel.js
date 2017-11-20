var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DataSchema   = new Schema({
    _station_id: { type: Schema.Types.ObjectId, ref: 'Station' }, //id from the origin station
    index: Schema.Types.Number,
    station: Schema.Types.Number,
    collect_date: {type: Date}, //date of collect send from the weather station
    storage_date: {type: Date, default: Date.now }, //date of storage on the database

    temperature: {type: Number, min: -100, max: 100}, //degrees Celsius
    atmospheric_pressure: {type: Number}, //millimetres of mercury
    relative_humidity: {type: Number, min: 0.0, max: 100.0},  //percentage
    wind_speed: {type: Number, min: 0.0}, //meters per second
    wind_direction: {type: Number, min: 0.0, max: 360.0}, // degrees
    precipitation: {type: Number, min: 0.0} //millimetres
});

module.exports = mongoose.model('Data', DataSchema);