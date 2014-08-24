#!/usr/bin/env node
var debug = require('debug')('crunchtime.io');
var app = require('../app');
var amqp = require('amqp');

app.set('port', process.env.PORT || 3000);

var rabbitConn = amqp.createConnection({});
var chatExchange;
rabbitConn.on('ready', function () {
    chatExchange = rabbitConn.exchange('chatExchange', {'type': 'fanout'});
});

var io = require('socket.io').listen(app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + app.get('port'));
  io.sockets.on('connection', function (socket) {
    socket.emit('msg-srv', { message: 'Welcome to crunchtime.io!', username: 'Crunchtime.io System Message' });

    socket.on('msg-cli', function (data) {
        console.log("socket.on msg-cli:", data);
        chatExchange.publish('messages', data);
        console.log("should have just sent it to the broker", data);
    });
    
    /**
	 * Initialize subscriber queue. 1. First create a queue w/o any name. This
	 * forces RabbitMQ to create new queue for every socket.io connection w/ a
	 * new random queue name. 2. Then bind the queue to chatExchange w/ "#" or ""
	 * 'Binding key' and listen to ALL messages 3. Lastly, create a consumer
	 * (via .subscribe) that waits for messages from RabbitMQ. And when a
	 * message comes, send it to the browser.
	 * 
	 * Note: we are creating this w/in sessionSockets.on('connection'..) to
	 * create NEW queue for every connection
	 */
    rabbitConn.queue('', {exclusive: true}, function (q) {
        //Bind to chatExchange w/ "#" or "" binding key to listen to all messages.
        q.bind('chatExchange', "");
        
    	// Subscribe When a message comes, send it back to browser
    	q.subscribe(function (message) {
    		console.log("Got message from broker: ", message);
    		socket.emit('msg-srv', message);
    	});
    });
  });
}));
