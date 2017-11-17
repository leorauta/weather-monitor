var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

var dataController = require('./app/database/controllers/DataController');
var stationController = require('./app/database/controllers/StationController');
var database = require("./app/database/Database");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var root_url = '/weathermonitor';
var port = process.env.PORT || 2324;       // set our port

var router = express.Router();

// router.route('/')
//     .options(function (req, res) {
//         res.json(
//
//         )
//     });

router.route('/data')
    .post(function (req, res) {
        console.log(req.body);
        var log = '';
        var count = 0;
        var currentdate = new Date();
        log += currentdate.toISOString();
        if (req.body.station !== undefined) {
            var station = stationController.getStationById(req.body.station);
            if (station !== undefined) {
                if (req.body.collect_date !== undefined) {
                    log += ' collect_date: ' + req.body.name;
                    count++;
                }
                if (req.body.storage_date !== undefined) {
                    log += ' storage_date: ' + req.body.storage_date;
                    count++;
                }
                if (req.body.temperature !== undefined) {
                    log += ' temperature: ' + req.body.temperature;
                    count++;
                }
                if (req.body.atmospheric_pressure !== undefined) {
                    log += ' atmospheric_pressure: ' + req.body.atmospheric_pressure;
                    count++;
                }
                if (req.body.relative_humidity !== undefined) {
                    log += ' relative_humidity: ' + req.body.relative_humidity;
                    count++;
                }
                if (req.body.wind_speed !== undefined) {
                    log += ' wind_speed: ' + req.body.wind_speed;
                    count++;
                }
                if (req.body.wind_direction !== undefined) {
                    log += ' wind_direction: ' + req.body.wind_direction;
                    count++;
                }
                if (req.body.precipitation !== undefined) {
                    log += ' precipitation: ' + req.body.precipitation;
                    count++;
                }
                console.log(log);
                if (count > 0) {
                    dataController.insertData(req.body);
                    res.json({});
                } else {
                    res.json({warning: "Send at least one value"});
                }
            } else {
                res.json({warning: "Non-existent station"});
            }
        } else {
            res.json({warning: "Send station code"});
        }
    })

    .get(function (req, res) {
        // console.log(req.query.startDate);
        // console.log(req.query.endDate);
        // console.log(req.query.limit);
        dataController.getData(req.query.startDate, req.query.endDate, req.query.limit).then(function (data) {
            // console.log(data);
            data.forEach(function (t) { t._id = undefined});
            res.json(data);
        })
    });

router.route('/station')

    .post(function (req, res) {
        var log = '';
        var count = 0;
        log += new Date().toISOString();

        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.substr(0, 7) == "::ffff:") {
            ip = ip.substr(7)
        }
        log += " IP: " + ip;

        if (req.body.name !== undefined && req.body.name.trim() !== '') {
            log += ' name: \"' + req.body.name + '\"';
        } else {
            res.json({warning: "Send name value"});
            count++;
        }

        if (req.body.description !== undefined) {
            log += ', description: \"' + req.body.description + '\"';
        }

        if (req.body.longitude !== undefined) {
            log += ', longitude: ' + req.body.longitude;
        } else if (count === 0) {
            res.json({warning: "Send longitude value"});
            count++;
        }

        if (req.body.latitude !== undefined) {
            log += ', latitude: ' + req.body.latitude;
        } else if (count === 0) {
            res.json({warning: "Send latitude value"});
            count++;
        }

        if (req.body.termometer !== undefined) {
            log += ', termometer: \"' + req.body.termometer + '\"';
        }
        if (req.body.barometer !== undefined) {
            log += ', barometer: \"' + req.body.barometer + '\"';
        }
        if (req.body.humidity !== undefined) {
            log += ', humidity: \"' + req.body.humidity + '\"';
        }
        if (req.body.anemometer !== undefined) {
            log += ', anemometer: \"' + req.body.anemometer + '\"';
        }
        if (req.body.windsock !== undefined) {
            log += ', windsock: \"' + req.body.windsock + '\"';
        }
        if (req.body.pluviometer !== undefined) {
            log += ', pluviometer: \"' + req.body.pluviometer + '\"';
        }

        console.log(log);
        if (count === 0) {
            stationController.insertStation(req.body).then(function (station) {
                res.json({hash: station._id});
            });
        } else {
            res.json({warning: "Send at least one value"});
        }
    })

    .get(function (req, res) {
        console.log(req.hash);
        stationController.getStationById(req.hash).then(function (station) {
            res.json(station);
        })
            .catch(function (e) {
                res.json({error: "Error while processing your request"});
            })
    });

router.route('/station/list')
    .get(function (req, res) {
        stationController.getStationList().then(function (stations) {
            res.json(stations);
        })
            .catch(function (e) {
                res.json({error: "Error while processing your request"});
            })

    });

try {
    app.use(root_url, router);
    app.listen(port);
} catch (e) {
    log.error(e);
}
console.log('Magic happens on port ' + port);
