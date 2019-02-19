'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var eventSource = require("eventsource");
var morgan = require('morgan');
var SqlString = require('sqlstring');

var db = require('./database');
var nlp_engine = require('./engine');

var con_db = db.createMySqlConnection(JSON.parse(
    require('fs').readFileSync('./database.json')));

var routes = require('./routes/index');

var app = express();

app.engine('html', require('ejs').renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.post('/', function (req, res) {
    let query = 'SELECT * FROM `nlp-samurai_db`.concepts_view';
    db.execMySqlQuery(con_db, query).then((dataset) => {
        var model_html = "\0", model = [];
        dataset.forEach(function (data_obj) {
            data_obj["negative"] =
                (data_obj["negative"] == 0) ? "false" : "true";
            data_obj["desc"] =
                (data_obj["desc"] == 'NULL') ? "none" : data_obj["desc"];

            model.push({
                'id': data_obj["concept_id"],
                'action': data_obj["action"],
                'entity': data_obj["entity"],
                'desc': data_obj["desc"],
                'negative': data_obj["negative"],
                'answer': Buffer.from(data_obj["answer"]).toString(),
                'url': data_obj["url"]
            });
        });

        if ((model != undefined) && (model.length > 0)) {
            res.send(JSON.stringify({ 'model': model }));
        }
    });
});

app.post('/inquiry', function (req, res) {
    var model_html = "\0", model = [];
    req.body.model.forEach(function (data_obj) {
        data_obj["negative"] =
            (data_obj["negative"] == "false") ? 0 : 1;
        model.push({
            'intent': {
                'action': data_obj["action"],
                'ent': data_obj["entity"],
                'desc': data_obj["desc"]
            },
            'response': {
                'answer': Buffer.from(data_obj["answer"]).toString(),
                'url': data_obj["url"]
            }, 'negative': data_obj["negative"]
        });
    });

    if ((model != undefined) && (model.length > 0)) {
        nlp_engine.analyze(req.body.inquiry, model).then((results) => {
            res.send(results);
        });
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
