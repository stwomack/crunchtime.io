$( document ).ready(function() {
  function ViewModel(messages) {
    var self = this;
    var socket = io.connect();
    self.username = ko.observable(null);
    self.input = ko.observable('');
    self.connected = ko.observable(false);
    self.connectionStatus = ko.computed(function() {
      return self.connected() ? "glyphicon glyphicon-ok-circle green" : "glyphicon glyphicon-ban-circle red";
    });
    self.messages = ko.observableArray(messages || []);
    self.send = function () {
      socket.emit('msg-cli', {message: self.input(), username: self.username()});
      self.input('');
    };
    socket.on('connect', function () {
      self.connected(true);
    });
    socket.on('disconnect', function () {
      self.connected(false);
      //socket = io.connect('http://crunchtime.cfapps.io:80');
      socket = io.connect();
    });
    socket.on('msg-srv', function (data) {
      if(data.message && data.username) {
        self.messages.push(data);
      } else {
        console.log("There is a problem:", data);
      }
    });
  }

  ko.applyBindings(new ViewModel());
});
