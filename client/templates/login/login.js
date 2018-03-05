Template.login.onRendered(function() {
});

Template.login.helpers({
});

Template.login.onDestroyed(function() {
});

Template.login.events({
  'click .login-btn':function() {
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();
    var errorMsg = '';
    if (username === '' || password === '') {
      $(".error-box").html('信息不全');
    } else {
      Meteor.loginWithPassword(username, password, function(e) {
        if (e) {
          $(".error-box").html(e.reason);
        } else {
          Router.go('detail');
        }
      });
    }
  },
  'click .go-register-btn':function() {
    Router.go('register');
  }
})
