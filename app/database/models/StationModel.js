var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StationSchema = new Schema({
    _id: Schema.Types.ObjectId, //id from the origin station

    name: Schema.Types.String, //date of collect send from the weather station
    description:  Schema.Types.String, //description

    longitude: {type: Number, min: -180.0, max: 180.0}, //date of storage on the database
    latitude: {type: Number, min: -180.0, max: 180.0}, //degrees Celsius

    termometer: Schema.Types.String, //temperature
    barometer: Schema.Types.String, //pressure
    humidity: Schema.Types.String,  //percentage
    anemometer: Schema.Types.String, //wind_speed
    windsock: Schema.Types.String, //wind_direction
    pluviometer: Schema.Types.String, //precipitation

    // data: {type:[{
    //         collect_date: {type: Date}, //date of collect send from the weather station
    //         storage_date: {type: Date, default: Date.now }, //date of storage on the database
    //
    //         temperature: {type: Number, min: -100, max: 100}, //degrees Celsius
    //         atmospheric_pressure: {type: Number}, //millimetres of mercury
    //         relative_humidity: {type: Number, min: 0.0, max: 100.0},  //percentage
    //         wind_speed: {type: Number, min: 0.0}, //meters per second
    //         wind_direction: {type: Number, min: 0.0, max: 360.0}, // degrees
    //         precipitation: {type: Number, min: 0.0} //millimetres
    // }], default:[]}
});

module.exports = mongoose.model('Station', StationSchema);