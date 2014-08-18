var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* POST to login. */
router.post('/login', function(req, res) {
  // Lookup user to see if they have previously logged in.
  // If not, create a record now
  // TODO: validate the actual user user
  var profile = {
    email: 'john@doe.com'
    id: 123
  };

  // we are sending the profile in the token
  var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });

  res.json({token: token});
});

module.exports = router;


var server = http.createServer(app);

var socketioJwt = require('socketio-jwt');

var sio = socketIo.listen(server);

sio.set('authorization', socketioJwt.authorize({
  secret: jwtSecret,
  handshake: true
}));

sio.sockets
  .on('connection', function (socket) {
     console.log(socket.handshake.decoded_token.email, 'connected');
     //socket.on('event');
  });


