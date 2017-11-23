var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');


var db = require("./app/database/Database");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var root_url = '/weathermonitor';
var port = process.env.PORT || 2324;       // set our port

var router = express.Router();

router.route('/data')
    .post(function (req, res) {
            var log = '';
            var count = 0;
            var currentdate = new Date();
            log += currentdate.toISOString();
            if (req.body.station !== undefined) {
                db.stationController.getStationById(req.body.station).then(function (station) {
                    if (station !== undefined && station !== null) {
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
                            db.idController.getId('data').then(function (id) {
                                var index = (id !== undefined && id !== null) ? id.number : 0;
                                db.idController.updateId('data').then(function () {
                                    db.dataController.insertData(req.body, station.index, index);
                                    res.json({id: index});
                                });
                            });
                        } else {
                            res.json({warning: "Send at least one value"});
                        }
                    } else {
                        res.json({warning: "Non-existent station"});
                    }
                });

            } else {
                res.json({warning: "Send station code"});
            }
        }
    )

    .get(function (req, res) {
        var stations;
        if (req.query.stations !== undefined) {
            stations = [];
            for (var i = 0; i < req.query.stations.length; i++) {
                stations[i] = parseInt(req.query.stations[i])
            }
        }
        db.dataController.getData(req.query.stations, req.query.startDate, req.query.endDate, req.query.limit, req.query.referenceId).then(function (data) {
            var list = [];
            for (var i = 0; i < data.length; i++) {
                list[i] = {};
                list[i].id = data[i].index;
                list[i].station = data[i].station;

                list[i].collect_date = data[i].collect_date;
                list[i].storage_date = data[i].storage_date;

                list[i].temperature = data[i].temperature;
                list[i].atmospheric_pressure = data[i].atmospheric_pressure;
                list[i].relative_humidity = data[i].relative_humidity;
                list[i].wind_speed = data[i].wind_speed;
                list[i].wind_direction = data[i].wind_direction;
                list[i].precipitation = data[i].precipitation;
            }
            res.json(list);
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

        if (req.body.thermometer !== undefined) {
            log += ', thermometer: \"' + req.body.thermometer + '\"';
        }
        if (req.body.barometer !== undefined) {
            log += ', barometer: \"' + req.body.barometer + '\"';
        }
        if (req.body.hygrometer !== undefined) {
            log += ', hygrometer: \"' + req.body.hygrometer + '\"';
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
            db.idController.getId('station').then(function (id) {
                req.body.index = id !== undefined && id !== null ? id.number : 0;
                db.idController.updateId('station').then(function () {
                    db.stationController.insertStation(req.body).then(function (station) {
                        res.json({hash: station._id, id: station.index});
                    });
                });
            });

        } else {
            res.json({warning: "Send at least one value"});
        }
    })

    .get(function (req, res) {
        var flag = false;
        db.stationController.getStationList().then(function (stations) {
            if (stations !== null && stations !== undefined && stations.length > 0) {
                for (var i = 0; i < stations.length; i++) {
                    if (stations[i].index === req.query.id - 0) {
                        var returnStation = {
                            id: stations[i].index,
                            name: stations[i].name, //date of collect send from the weather station
                            description: stations[i].description, //description

                            longitude: stations[i].longitude, //date of storage on the database
                            latitude: stations[i].latitude, //degrees Celsius

                            thermometer: stations[i].thermometer, //temperature
                            barometer: stations[i].barometer, //pressure
                            hygrometer: stations[i].hygrometer,  //percentage
                            anemometer: stations[i].anemometer, //wind_speed
                            windsock: stations[i].windsock, //wind_direction
                            pluviometer: stations[i].pluviometer //precipitation
                        };
                        flag = true;
                        res.json(returnStation);
                        break;
                    }
                }
                if (!flag) res.json({warning: "Station not found"});
            } else res.json({warning: "Station not found"});
        })
            .catch(function (e) {
                console.error(e);
                res.json({error: "Error while processing your request"});
            })
    });

router.route('/station/list')
    .get(function (req, res) {
        db.stationController.getStationList().then(function (stations) {
            var list = [];
            for (var i = 0; i < stations.length; i++) {
                list[list.length] = {
                    id: stations[i].index,
                    name: stations[i].name, //date of collect send from the weather station
                    description: stations[i].description, //description

                    longitude: stations[i].longitude, //date of storage on the database
                    latitude: stations[i].latitude, //degrees Celsius

                    thermometer: stations[i].thermometer, //temperature
                    barometer: stations[i].barometer, //pressure
                    hygrometer: stations[i].hygrometer,  //percentage
                    anemometer: stations[i].anemometer, //wind_speed
                    windsock: stations[i].windsock, //wind_direction
                    pluviometer: stations[i].pluviometer //precipitation
                };
                console.log(list);
            }
            res.json(list);
        })
            .catch(function (e) {
                console.error(e);
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
