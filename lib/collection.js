Payments = new Mongo.Collection("payments");
HistoryList = new Mongo.Collection("historyList");
var Schemas = {};

Schemas.UserProfile = new SimpleSchema({
	level: {
		type: String,
		optional: true
	}
});

Schemas.User = new SimpleSchema({

  username: {
      type: String,
      optional:true
  },

	emails: {
		type: [Object],
		optional: true
	},
	'emails.$.address': {
		type:String,
		regEx: SimpleSchema.RegEx.Email
	},
	'emails.$.verified': {
		type:Boolean
	},
	createdAt: {
		type:Date
	},
	profile: {
		type: Schemas.UserProfile,
		optional: true
	},
	services: {
		type: Object,
		optional:true,
		blackbox:true
	}
});

Schemas.Payment = new SimpleSchema({
  product_manager: {
    type: String
  },
  customer: {
    type: String
  },
	addBy: {
		type: String
	},
  createdAt: {
    type: Date
  },
  total_amount: {
    type: String
  },
  total_number: {
    type: String
  },
  unpaidNumLeft: {
  	type: String
  },
  payments: {
    type: [Object],
    blackbox:true
  }
});

Schemas.HistoryList = new SimpleSchema({
	item: {
		type: Schemas.Payment,
		blackbox:true
	}
});

Meteor.users.attachSchema(Schemas.User);
Payments.attachSchema(Schemas.Payment);
HistoryList.attachSchema(Schemas.HistoryList);

