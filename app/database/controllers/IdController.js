var IdModel = require('../models/IdModel');

module.exports.getId = function (field) {

    var query = IdModel.findOne({ 'field': field});

    return query.exec(function (err, id) {
        if (err) return console.error(err);
        return id;
    });
};

module.exports.updateId = function (field) {
    var query = IdModel.findOne({ 'field': field});
    return query.exec(function (err, id) {
        if (err) return console.error(err);
        if (id !== undefined && id !== null) {
            id.set({number:  id.number + 1});
            id.save(function (err, id) {
                if (err) return console.log(err);
            });
        } else {
            var idmodel = new IdModel({
                field: field,
                number: 1
            });
            idmodel.save(function (err, id) {
                if (err) return console.error(err);
                return id;
            });
        }
    });
};