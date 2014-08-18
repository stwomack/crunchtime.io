var express = require('express');
var router = express.Router();

var _ = require('underscore');
var async = require('async');
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
  topic: String,
  description: String,
  start_time: Date,
  end_time: Date,
  attendees: [{
    id: Number,
    email : String,
    token : String
  }],
  messages: [{
    sequence: Number,
    author_id: Number,
    text: String
  }]
});

var Meeting = mongoose.model('Meeting', meetingSchema);

/* POST create meeting. */
router.post('/meeting/:id', function(req, res) {
  var C = function (callback) {
    console.log('CREATE');
    Meeting.create({ string: 'create' }, callback);
  };
  res.render('index', { title: 'Crunchtime.io' });
});
/* GET read meeting. */
router.post('/meeting/:id', function(req, res) {
  var R = function (record, callback) {
    console.log('READ', record);
    Meeting.findById(record._id, callback);
  };
});
/* PUT update meeting. */
router.post('/meeting/:id', function(req, res) {
  var U = function (record, callback) {
    console.log('UPDATE', record);
    Meeting.findByIdAndUpdate(record._id, {string: 'update'}, callback);
  };
});
/* DELETE delete meeting. */
router.post('/meeting/:id', function(req, res) {
  var D = function (record, callback) {
    console.log('DELETE', record);
    Meeting.findByIdAndRemove(record._id, callback);
  };
});

router.get('/meeting/:id', function(req, res) {
  res.render('index', { title: 'Crunchtime.io' });
});

module.exports = router;
