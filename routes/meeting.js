var express = require('express');
var router = express.Router();

var moment = require('moment');
var mongoose = require('mongoose');

if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  console.log('SERVICES:', process.env.VCAP_SERVICES);
  var mongo_url = env.mongolab.credentials.uri;
} else {
  var mongo_url = 'mongodb://localhost/meetings';
}
console.log('Attempting Mongoose connection to', mongo_url);
mongoose.connect(mongo_url);

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + mongo_url);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

var meetingSchema = mongoose.Schema({
  organizer: String,
  topic: String,
  description: String,
  start_time: Date,
  end_time: Date
});

var Meeting = mongoose.model('Meeting', meetingSchema);

/* POST create meeting. */
router.post('/', function(req, res) {
  console.log('CREATE');
  Meeting.create({
    organizer: req.body.email,
    topic: req.body.topic,
    description: req.body.description,
    start_time: moment(),
    end_time: null
  }, function (err, result) {
    if (!!err) {
      res.send(500, {error:err});
    } else {
      res.render('meeting', result); // user needs meeting ID to forward to anyone who wants it
    }
  });
});
/* GET read meeting. */
router.get('/:id', function(req, res) {
  console.log('UPDATE', req.params.id);
  Meeting.findById(req.params.id, function (err, result) {
    if (!!err) {
      res.send(500, {error:err});
    } else {
      res.render('meeting', result);
    }
  });
});
/* PUT update meeting. */
router.put('/:id', function(req, res) {
  console.log('UPDATE', req.params.id);
  Meeting.findByIdAndUpdate(req.params.id, {
    end_time: moment()
  }, function (err, result) {
    if (!!err) {
      res.send(500, {error:err});
    } else {
      res.render('meeting', result);
    }
  });
});
/* DELETE delete meeting. */
router.delete('/:id', function(req, res) {
  console.log('DELETE', req.params.id);
  Meeting.findByIdAndRemove(req.params.id, function (err, result) {
    if (!!err) {
      res.send(500, {error:err});
    } else {
      res.render('meeting', result);
    }
  });
});
module.exports = router;
