var express      = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');

var dataController = require('./app/database/controllers/DataController');
var stationController = require('./app/database/controllers/StationController');
var database = require("./app/database/Database");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var root_url = '/weathermonitor';
var port = process.env.PORT || 2323;        // set our port


var router = express.Router();

router.route('/')

    .options(function(req, res) {
        res.json(

        )
    });

router.route('/data')
    .post(function(req, res) {
        var log = '';
        var count = 0;
        var currentdate = new Date();
        log += currentdate.toISOString();

        if (req.body.collect_date !== undefined) {
            log += ' collect_date: ' + req.body.name;
            count++;
        }
        if (req.body.storage_date !== undefined){
            log += ' storage_date: ' + req.body.storage_date;
            count++;
        }
        if(req.body.temperature !== undefined) {
            log += ' temperature: ' + req.body.temperature;
            count++;
        }
        if(req.body.atmospheric_pressure !== undefined) {
            log += ' atmospheric_pressure: ' + req.body.atmospheric_pressure;
            count++;
        }
        if(req.body.relative_humidity !== undefined) {
            log += ' relative_humidity: ' + req.body.relative_humidity;
            count++;
        }
        if(req.body.wind_speed !== undefined) {
            log += ' wind_speed: ' + req.body.wind_speed;
            count++;
        }
        if(req.body.wind_direction !== undefined) {
            log += ' wind_direction: ' + req.body.wind_direction;
            count++;
        }
        if(req.body.precipitation !== undefined) {
            log += ' precipitation: ' + req.body.precipitation;
            count++;
        }
        console.log(log);
        if (count > 0) {
            dataController.insertData(req.body);
            res.json(req.body);
        } else {
            var response = {
                warning: "Send at least one value"
            }
            res.json(response);
        }
    })

    .get(function(req, res) {

    });

router.route('/station')

    .post(function(req, res) {
        var log = '';
        var count = 0;
        log += new Date().toISOString();

        if (req.body.name !== undefined && req.body.name.trim() !== '') {
            log += ' name: \"' + req.body.name + '\"';
        } else {
            res.json({warning: "Send name value"});
            count++;
        }

        if (req.body.description !== undefined){
            log += ', description: \"' + req.body.description + '\"';
        }

        if(req.body.longitude !== undefined) {
            log += ', longitude: ' + req.body.longitude;
        } else if (count === 0) {
            res.json({warning: "Send longitude value"});
            count++;
        }

        if(req.body.latitude !== undefined) {
            log += ', latitude: ' + req.body.latitude;
        } else if (count === 0){
            res.json({warning: "Send latitude value"});
            count++;
        }

        if(req.body.barometer !== undefined) {
            log += ', barometer: \"' + req.body.barometer + '\"';
        }
        if(req.body.humidity !== undefined) {
            log += ', humidity: \"' + req.body.humidity + '\"';
        }
        if(req.body.anemometer !== undefined) {
            log += ', anemometer: \"' + req.body.anemometer + '\"';
        }
        if(req.body.windsock !== undefined) {
            log += ', windsock: \"' + req.body.windsock + '\"';
        }
        if(req.body.pluviometer !== undefined) {
            log += ', pluviometer: \"' + req.body.pluviometer + '\"';
        }

        console.log(log);
        if (count === 0) {
            stationController.insertStation(req.body).then(function (station) {
                var hash = {hash: station._id}
                res.json(hash);
            });
        } else {
            response = {
                warning: "Send at least one value"
            }
            res.json(response);
        }

        // stationController.insertStation(req.body);
        // console.log(req);
        // res.json(req.body);
    })

    .get(function(req, res) {

    });

router.route('/station/list')

    .get(function(req, res) {

    });

try {
    app.use(root_url, router);
    app.listen(port);
} catch (e){

}
console.log('Magic happens on port ' + port);
