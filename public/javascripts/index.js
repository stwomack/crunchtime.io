$( document ).ready(function() {
  function ViewModel(messages) {
    var self = this;
    self.organizer = ko.observable('');
    self.topic = ko.observable('');
    self.description = ko.observable('');
    $('#newMeeting').submit(function (e) {
      e.preventDefault();
      $.post('/login', {
        username: $('username').val(),
        password: $('password').val()
      }).done(function (result) {
        connect_socket(result.token);
      });
    });
  }

  ko.applyBindings(new ViewModel());
});
