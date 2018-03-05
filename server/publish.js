Meteor.publish('payments',function() {
	if (this.userId) {
		var user = Meteor.users.findOne(this.userId);
		if (user.profile) {
			if (user.profile.level === '1') { //pm
				return Payments.find({product_manager:user.username});
			} else if (user.profile.level === '2') { //admin
				return Payments.find({});
			}
		}

		return;
	}
	return;
});

Meteor.publish('historyList',function() {
	return HistoryList.find({});
});

Meteor.publish('userlist',function() {
	return Meteor.users.find({});
});
