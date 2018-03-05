Template.add.onRendered(function() {
  Session.set('NUM_TO_PAY',0);
  this.autorun(function() {
    if (Session.get('GM')) {
      Meteor.subscribe( 'userlist', {
          onStop:  function( error /* optional */ ) {
          },
          onReady: function() {
          }
      });
    }
  });
});

Template.add.helpers({
  payNumber:function() {
    var countArr = [];
    var num = Session.get('NUM_TO_PAY');
    for (var i = 1; i < num; i++) {
      countArr.push({});
    }
    return countArr;
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
  pmlist:function() {
    var result = [];
    var users = Meteor.users.find({}).fetch();
    for (var i = 0; i < users.length; i++) {
      if (users[i].emails === undefined) {
        result.push(users[i].username);
      }
    }
    return result;
  }
});

Template.add.events({
  'input input[name=total-number]':function(e) {
    var number = $('input[name=total-number]').val();
    if (number === "" || isNaN(number)) return;
    Session.set('NUM_TO_PAY',number);
  },
  'click .submit':function(e) {
    $(e.currentTarget).addClass('disabled');
    var json = {};
    var payments = [];
    var payInfo;
    var pmanager = $('#pmanager').val();
    var customer = $('input[name=customer]').val();
    var total_amount = $('input[name=amount]').val();
    var total_number = $('input[name=total-number]').val();
    var unpaidNumLeft = parseInt(total_number);
    var total_amount_added = 0;
    if (pmanager === '' || customer === '' || isNaN(total_amount) || isNaN(total_number)) {
      $(".ui.error.message")
      .css({
        display:'block'
      })
      .html('表格信息有误');
      $(e.currentTarget).removeClass('disabled');
      return;
    }

    $(".singlePayRow").each(function(i,obj) {
      var amount = $(obj).find('.single-amount').val();
      if ($(obj).find('.pay-date').val() === '') {
        $(".ui.error.message")
        .css({
          display:'block'
        })
        .html('日期不能为空');
        $(e.currentTarget).removeClass('disabled');
        return;
      }
      var date = $(obj).find('.pay-date').datepicker('getDate');
      if (isNaN(amount)) {
        $(".ui.error.message")
        .css({
          display:'block'
        })
        .html('金额不能为空');
        $(e.currentTarget).removeClass('disabled');
        return;
      }
      date = moment(date).add(23,'hours').add(59,'minutes').toISOString();
      payInfo = {};
      payInfo.date = date;
      payInfo.amount = amount;
      total_amount_added += parseInt(amount);
      payInfo.id = Random.id([20]);
      payInfo.paid = false;
      payInfo.payDate = false;
      payments.push(payInfo);
    });

    if (total_amount_added !== parseInt(total_amount)) {
      $(".ui.error.message")
      .css({
        display:'block'
      })
      .html('总金额对不上');
      $(e.currentTarget).removeClass('disabled');
      return;
    }

    json.addBy = Meteor.user().username;
    json.payments = payments;
    json.pmanager = pmanager;
    json.customer = customer;
    json.total_amount = total_amount;
    json.total_number = total_number;
    json.unpaidNumLeft = unpaidNumLeft;
    Session.set('PAGE_LOADING',true);
    Meteor.call('addPayments',json,function(err,result) {
      Session.set('PAGE_LOADING',false);
      $(e.currentTarget).removeClass('disabled');
      if (!err) {
        if (result !== false) {
          Router.go('detail');
          Session.set('MENU_ADD_BTN',true);
        } else {
          $(".ui.error.message")
          .css({
            display:'block'
          })
          .html('该客户经理不存在');
        }
      } else {
        $(".ui.error.message")
        .css({
          display:'block'
        })
        .html(err);
      }
    });
  }
});

Template.singlePayRow.onRendered(function() {
  $('.pay-date').datepicker().on('changeDate',function(e) {
    $(this).datepicker('hide');
    var now = moment();
    var end = moment(e.date).add(23,'hours').add(59,'minutes');
    $(this).prev().html('还款日期: (' + end.diff(now,'days') +  '天)');
  });
});
