Meteor.startup(function() {
  Houston.add_collection(Meteor.users);

  var unpaidNumLeft;
  var transferList = [];
  HistoryList.remove({});
  _.each(Payments.find({}).fetch(),function(payment) {
  	unpaidNumLeft = undefined;
  	if (unpaidNumLeft == undefined) {
  		unpaidNumLeft = 0;
		_.each(payment.payments,function(singlePayment) {
	  		if (!singlePayment.paid) {
	  			unpaidNumLeft++;	
	  		}
	  	});
  	}

  	Payments.update(
  		{_id:payment._id},
  		{ $set: {unpaidNumLeft: unpaidNumLeft}},
  		function(err,result) {

  		});

  });


});
