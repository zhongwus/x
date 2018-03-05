Meteor.methods({
	'register':function(username,password) {
		var profile = {};
		profile.level = '1';
		var id = Accounts.createUser({
			username:username,
			password:password,
			profile:profile,
		});
		return id;
	},
  'addPayments':function(json) {
    var pmanager = json.pmanager;
    var customer = json.customer;
    var total_amount = json.total_amount;
    var total_number = json.total_number;
    var unpaidNumLeft = json.unpaidNumLeft;
    var payments = json.payments;
		var addBy = json.addBy;
		if (Meteor.users.findOne({username:pmanager})) {
			Payments.insert({
				product_manager:pmanager,
				customer:customer,
				total_number:total_number,
				total_amount:total_amount,
				unpaidNumLeft:unpaidNumLeft,
				movedToHistory:false,
				payments:payments,
				addBy:addBy,
				createdAt:new Date()
			}, function(err,result) {
			});
		} else {
			return false;
		}
  },
	'checkPassword':function(pass) {
		check(pass,String);
		console.log(pass);
		if (this.userId) {
			var user = Meteor.user();
			var password = {digest:pass,algorithm:'sha-256'};
			var result = Accounts._checkPassword(user, password);
      return result.error == null;
		} else {
			return false;
		}
	},
	'removePayment':function(id,parentId) {
		check(id,String);
		check(parentId,String);
		var date = new Date();
		var removedBy = Meteor.user().username;
		var unpaidNumLeft = Payments.findOne({_id:parentId}).unpaidNumLeft;
		unpaidNumLeft--;
		Payments.update(
			{_id:parentId,'payments.id':id},
			{ $set: { unpaidNumLeft:unpaidNumLeft,'payments.$.paid': true,'payments.$.payDate': date, 'payments.$.removedBy': removedBy} },
			function(err,result) {
			});
	},
	'updateAmount':function(id,parentId,amount) {
		check(id,String);
		check(parentId,String);
		check(amount,String);
		Payments.update(
			{_id:parentId,'payments.id':id},
			{ $set: { 'payments.$.amount': amount} },
			function(err,result) {

			});
	},
	'updateDate':function(id,parentId,date) {
		check(id,String);
		check(parentId,String);
		check(date,String);
		console.log(date);
		Payments.update(
			{_id:parentId,'payments.id':id},
			{ $set: { 'payments.$.date': date} },
			function(err,result) {

			}
		);
	},
	'test':function() {
		_.each(Payments.find({}).fetch(),function(payment) {
			console.log(payment.unpaidNumLeft);
			if (payment.unpaidNumLeft == 0) {
				Payments.remove({_id:payment._id},function(err,result) {

					if (!err) {
						HistoryList.insert({
							item:payment
						},function(err2,result2) {

						});
					}
				})
			}
		});
	}
});
