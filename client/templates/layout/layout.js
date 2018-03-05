Session.set('PAGE_LOADING',false);

Template.layout.onRendered(function() {
  this.autorun(function(c) {
    if (Meteor.user()) {
      c.stop();
      if (Meteor.user().profile) {
        Session.set('GM',Meteor.user().profile.level === '2');
      } else {
        Router.go('secret');
      }
    }
  });
});

Template.layout.helpers({
  loading:function() {
    return Session.get('PAGE_LOADING');
  }
});
