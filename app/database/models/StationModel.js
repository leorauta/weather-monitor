var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StationSchema = new Schema({
    _id: Schema.Types.ObjectId, //id from the origin station

    index: Schema.Types.Number,

    name: Schema.Types.String, //date of collect send from the weather station
    description:  Schema.Types.String, //description

    longitude: {type: Number, min: -180.0, max: 180.0}, //date of storage on the database
    latitude: {type: Number, min: -180.0, max: 180.0}, //degrees Celsius

    thermometer: Schema.Types.String, //temperature
    barometer: Schema.Types.String, //pressure
    hygrometer: Schema.Types.String,  //percentage
    anemometer: Schema.Types.String, //wind_speed
    windsock: Schema.Types.String, //wind_direction
    pluviometer: Schema.Types.String //precipitation
});

module.exports = mongoose.model('Station', StationSchema);