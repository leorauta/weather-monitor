
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var bd         = require('./app/database/controllers/DataController');


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
        console.log('POST /weathermonitor/data');
        res.json(req.body);
    })

    .get(function(req, res) {

    })

    .options(function(req, res) {

    });


router.route('/station')

    .post(function(req, res) {

    })

    .get(function(req, res) {

    });

router.route('/station/list')

    .get(function(req, res) {

    })

    .options(function(req, res) {

    });


app.use(root_url, router);
app.listen(port);

console.log('Magic happens on port ' + port);
