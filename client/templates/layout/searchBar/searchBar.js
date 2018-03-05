Template.searchBar.onRendered(function() {
  Session.set('SEARCH_TYPE',1);
  if (Router.current().route.getName() === 'dateSearch') {
    Session.set('SEARCH_TYPE',3);
    var month = Router.current().params.MM;
    var day = Router.current().params.DD;
    var year = Router.current().params.YYYY;
    $(".search-date-input").datepicker('update',month + '-' + day + '-' + year);

  } else if (Router.current().route.getName() === 'pmSearch') {
    Session.set('SEARCH_TYPE',2);
    $(".search-pm-input").val(decodeURIComponent(Router.current().params.name));
  }

  $(".search-date-input").datepicker().on('changeDate',function(e) {
    $(this).datepicker('hide');
    var params = {};
    if ($('.search-date-input').val() === '') return;
    var date = moment($('.search-date-input').datepicker('getDate'));
    params.MM = date.format('MM');
    params.DD = date.format('DD');
    params.YYYY = date.format('YYYY');
    Router.go('dateSearch',params);
  });
  $(".search-type-dropdown").dropdown({
    onChange: function(e) {
      if (e === '客户') {
        Session.set('SEARCH_TYPE',1);
      } else if (e === '经理') {
        Session.set('SEARCH_TYPE',2);
      } else if (e === '日期') {
        Session.set('SEARCH_TYPE',3);
      }
    }
  });
});

Template.searchBar.helpers({
  search_type:function(type) {
    return Session.get('SEARCH_TYPE') === type;
  },
  default_search_text:function() {
    var type = Session.get('SEARCH_TYPE');
    if (type === 1) {
      return '客户';
    }  else if (type === 2) {
      return '经理';
    } else if (type === 3) {
      return '日期'
    }
  },
  is_gm:function() {
    return Session.get('GM');
  },
  username:function() {
    if (Meteor.user()) {
        return Meteor.user().username;
    }
    return '';
  },
});

Template.searchBar.events({
  'click .menu-add-btn':function(e) {
    Router.go('add');
  },
  'click .menu-all-btn':function(e) {
    Router.go('detail');
  },
  'click .menu-user-btn':function(e) {
    Router.go('detail');
  },
  'click .overdue-check-btn':function() {
    Router.go('overdue');
  },
  'click .history-check-btn':function() {
    Router.go('history');
  },
  'click .logout-btn':function() {
    Meteor.logout(function(err) {

    });
  },
  'click .search-btn':function() {
    var params = {};
    if (Session.get('SEARCH_TYPE') === 3) {
      if ($('.search-date-input').val() === '') return;
      var date = moment($('.search-date-input').datepicker('getDate'));
      params.MM = date.format('MM');
      params.DD = date.format('DD');
      params.YYYY = date.format('YYYY');
      Router.go('dateSearch',params);
    } else if (Session.get('SEARCH_TYPE') === 2) {
      var name = $('.search-pm-input').val();
      if (name === '') return;
      params.name = encodeURIComponent(name);
      Router.go('pmSearch',params);
    } else if (Session.get('SEARCH_TYPE') === 1) {
      var name = $(".search-customer-input").val();
      if (name === '') return;
      params.name = encodeURIComponent(name);
      Router.go('customerSearch',params);
    }
  },
  'keydown .search-pm-input':function(e) {
    if (e.keyCode === 13) {
      $(".search-btn").click();
    }
  },
  'keydown .search-customer-input':function(e) {
    if (e.keyCode === 13) {
      $(".search-btn").click();
    }
  },
});
