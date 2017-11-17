var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IdSchema = new Schema({
    field: Schema.Types.String,
    number: Schema.Types.Number
});

module.exports = mongoose.model('Id', IdSchema);