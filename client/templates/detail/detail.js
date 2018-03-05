Template.detail.onCreated(function() {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('payments');
  }.bind(this));

  Meteor.call('test',function(err,result) {
    console.log('err:' + err);
    console.log("result:" + result);
  });
});

Template.detail.onRendered(function() {
  $(".confirm-modal").modal({
    onHide:function() {
      $('.paid-checkbox[data-id=' + Session.get('ACTIVE_ID') + ']').checkbox('uncheck');
      $('.error-msg').removeClass('active');
    },
    onShow:function() {
      document.getElementById('confirm-input').value = '';
    }
  });

  document.getElementById('confirm-btn').addEventListener('click',function(e) {
    var btn = $(e.currentTarget);
    var password = Package.sha.SHA256($("#confirm-input").val());
    var id = Session.get('ACTIVE_ID');
    var parent_id = Session.get('INDEXED_ARRAY')[id].parentId;
    Session.set('PAGE_LOADING',true);
    btn.addClass('disabled');
    Meteor.call('checkPassword',password,function(err,result) {
      if (!err) {
        if (!result) {
          Session.set('PAGE_LOADING',false);
          btn.removeClass('disabled');
          $('.error-msg').addClass('active').html('密码错误');
        } else {
          Meteor.call('removePayment',id,parent_id,function(err1,result1) {
            Session.set('PAGE_LOADING',false);
            btn.removeClass('disabled');
            if (!err1) {
              alert('付款成功!');
              $(".confirm-modal").modal('hide');
            } else {
              $('.error-msg').addClass('active').html(err1);
            }
          });
        }
      } else {
        $('.error-msg').addClass('active').html(err);
        Session.set('PAGE_LOADING',false);
        btn.removeClass('disabled');
      }
    });
  },false);
  document.getElementById('confirm-input').addEventListener('keydown',function(e) {
    if (e.keyCode === 13) {
      $("#confirm-btn").click();
    }
  },false);

});

Template.detail.events({
  'click .add-btn':function() {
    Router.go('add');
  },
  'click .paid-checkbox':function(e) {
    Session.set('ACTIVE_ID',$(e.currentTarget).attr('data-id'));
    $(".confirm-modal").modal('show');
  },
  'click .gm-check-unpaid':function(e) {
    $(".pm-stats-table").toggleClass('active');
  },
  'click .edit-amount':function(e) {
    $(e.currentTarget).next().addClass('active');
    $(e.currentTarget).next().find('.input-amount').focus();
    Session.set('FOCUSED_AMOUNT',$(e.currentTarget).html());
    $(e.currentTarget).css({
      display:'none'
    })
  },
  'click .confirm-edit-btn':function(e) {
    var block = $(e.currentTarget).parent();
    var pass = Package.sha.SHA256(block.find('.add-password').val());
    var v1 = Session.get('FOCUSED_AMOUNT');
    var v2 = block.find('.input-amount').val();
    var id = block.attr('data-id');
    var parent_id = Session.get('INDEXED_ARRAY')[id].parentId;
    if (v1 === v2) {
      block.removeClass('active');
      block.prev().css({
        display:'block'
      });
    } else if (isNaN(v2)) {
      block.find('.error.message').css({
        display:'block'
      }).html('金额有误');
    } else {
      Meteor.call('checkPassword',pass,function(err,result) {
        if (!result || err) {
          block.find('.error.message').css({
            display:'block'
          }).html('密码错误');
        } else {
          Meteor.call('updateAmount',id,parent_id,v2,function(err,result) {
            block.removeClass('active');
            block.prev().css({
              display:'block'
            });
          });
        }
      });
    }
  },
  'click .cancel-edit-btn':function(e) {
    $(e.currentTarget).parent().removeClass('active');
    $(e.currentTarget).parent().prev().css({
      display:'block'
    });
  },
  'click .edit-date':function(e) {
    $(e.currentTarget).css({
      display:'none'
    });
    $(e.currentTarget).next().addClass('active');
    $(e.currentTarget).next().find('.edit-date-input').datepicker().on('changeDate',function(e) {
      $(this).datepicker('hide');
    });
    $(e.currentTarget).next().find('.edit-date-input').focus();

  },
  'click .cancel-date-edit-btn':function(e) {
    $(e.currentTarget).parent().prev().css({
      display:'block'
    });
    $(e.currentTarget).parent().removeClass('active');
  },
  'click .confirm-date-edit-btn':function(e) {
    var block = $(e.currentTarget).parent();
    var date = block.find('.edit-date-input').val();
    var pass = Package.sha.SHA256(block.find('.date-edit-password').val());
    var id = block.attr('data-id');
    var parent_id = Session.get('INDEXED_ARRAY')[id].parentId;
    if (date === '') {
      block.find('.error.message').css({
        display:'block'
      }).html('日期不能为空');
    } else {
      date = block.find('.edit-date-input').datepicker('getDate');
      date = moment(date).add(23,'hours').add(59,'minutes').toISOString();
      Meteor.call('checkPassword',pass,function(err,result) {
        if (!result || err) {
          block.find('.error.message').css({
            display:'block'
          }).html('密码错误');
        } else {
          Meteor.call('updateDate',id,parent_id,date,function(err,result) {
            block.removeClass('active');
            block.prev().css({
              display:'block'
            });
          });
        }
      });
    }
  }
});

Template.detail.helpers({
  total_payments:function() {
    var result = [];
    var json;
    var total_unpaid = 0;
    var pm_unpaid = {};
    _.each(Payments.find({}).fetch(),function(value1,index1) {

      if (pm_unpaid[value1.product_manager] == undefined) {
        pm_unpaid[value1.product_manager] = {pm_manager:value1.product_manager,total:0};
      }

      _.each(value1.payments,function(value2,index2) {
        json = {};
        json.product_manager = value1.product_manager;
        json.customer = value1.customer;
        json.amount = value2.amount;
        json.date = value2.date;
        json.id = value2.id;
        json.pastDue = !moment(value2.date).isAfter(moment());
        json.pastDueDays = moment().diff(moment(value2.date),'days') + 1;
        json.passMoreThan30Days = json.pastDueDays >= 30;
        json.parentId = value1._id;
        json.paid = value2.paid;
        json.pid = value1._id;
        json.thisYear = moment().isSame(moment(value2.date),'years');
        json.today = moment().isSame(moment(value2.date),'days');
        if (json.thisYear) {
          json.formattedDate = moment(value2.date).format('M月D日');
        } else {
          json.formattedDate = moment(value2.date).format('YYYY年M月D日');
        }
        if (!value2.paid) {
            total_unpaid += parseInt(value2.amount);
            pm_unpaid[value1.product_manager].total += parseInt(value2.amount);
        }
        json.paidDate = value2.payDate;
        json.addBy = value1.addBy;
        json.removedBy = value2.removedBy;
        if (value2.payDate) {
          if (moment().isSame(moment(value2.payDate),'years')) {
            json.formattedPaidDate = moment(value2.payDate).format('M月D日');
          } else {
            json.formattedPaidDate = moment(value2.payDate).format('YYYY年M月D日');
          }
        }
        result.push(json);
      });
    });

    


    Session.set('PM_UNPAID',pm_unpaid);
    Session.set('TOTAL_UNPAID',total_unpaid);

    if (Router.current().route.getName() === 'history') {
      Session.set('HISTORY_ROUTE',true);
      result = _.filter(result,function(item) {
        return item.paid;
      });
    } else if (Router.current().route.getName() === 'customerSearch') {
      Session.set('HISTORY_ROUTE',false);
    } else {
      Session.set('HISTORY_ROUTE',false);
      result = _.filter(result,function(item) {
        return !item.paid;
      });
    }

    result.sort(function(a,b) {
      return moment(a.date).diff(moment(b.date),'seconds');
    });

    Session.set('INDEXED_ARRAY',_.indexBy(result,'id'));
    var routeName = Router.current().route.getName();
    if (routeName === 'detail') {
      return _.filter(result,function(item) {
        return !item.passMoreThan30Days;
      });
    } else if (routeName === 'dateSearch') {
      var month = Router.current().params.MM;
      var day = Router.current().params.DD;
      var year = Router.current().params.YYYY;
      var date = moment(month + ' ' + day + ' ' + year,'MM DD YYYY');
      return _.filter(result,function(item) {
        return date.isSame(moment(item.date),'days');
      });
    } else if (routeName === 'pmSearch') {
      var name = decodeURIComponent(Router.current().params.name);
      return _.filter(result,function(item) {
        return item.product_manager === name;
      });
    } else if (routeName === 'customerSearch') {
      var name = decodeURIComponent(Router.current().params.name);
      var filtered = _.filter(result,function(item) {
        return item.customer === name;
      });
      filtered.sort(function(a,b) {
        if (a.pid.localeCompare(b.pid) === 0) {
          return moment(a.date).diff(moment(b.date),'seconds');
        }
        return a.pid.localeCompare(b.pid);
      });
      for (var i = 0; i < filtered.length; i++) {
        if (i === 0) {
          filtered[i].odd = true;
        } else {
          if (filtered[i].pid === filtered[i-1].pid) {
            filtered[i].odd = filtered[i-1].odd;
          } else {
            filtered[i].odd = !filtered[i-1].odd;
          }
        }
      }
      return filtered;
    } else if (routeName === 'overdue') {
      return _.filter(result,function(item) {
        return item.passMoreThan30Days;
      })
    } else if (routeName === 'history') {
      return result;
    }
    return;
  },
  history_route:function() {
    return Session.get('HISTORY_ROUTE');
  },
  total_unpaid:function() {
    return Session.get('TOTAL_UNPAID');
  },
  is_gm:function() {
    return Session.get('GM');
  },
  pm_unpaid:function() {
    var temp = Session.get('PM_UNPAID');
    var result = [];
    for (var item in temp) {
      if (temp[item].total !== 0) {
          result.push(temp[item]);
      }
    }
    return result;
  },
  active_item:function() {
    var item = [];
    item.push(Session.get('INDEXED_ARRAY')[Session.get('ACTIVE_ID')]);
    return item;
  }
});
