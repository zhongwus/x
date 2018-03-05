Template.register.onRendered(function() {
});

Template.register.helpers({
});

Template.register.onDestroyed(function() {
});

Template.register.events({
  'click .register-btn':function() {
    var username = $('input[name=username]').val();
    var password1 = $('input[name=password1]').val();
    var password2 = $('input[name=password2]').val();
    var errorMsg = '';
    if (username === '' || password1 === '' || password2 === '') {
      $(".error-box").html('信息不全');
    } else if (password1 !== password2) {
      $(".error-box").html('密码不一致');
    } else {
      Meteor.call('register',username,password1,function(err,result) {
        if (result) {
          Meteor.loginWithPassword(username, password1, function(e) {
            Router.go('detail');
          });
        } else {
          $(".error-box").html(err.reason);
        }
      });
    }
  },
  'click .go-login-btn':function() {
    Router.go('login');
  }
})
