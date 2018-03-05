Router.configure({
});

Router.route('index', {
	path: '/',
	template: 'login',
  onBeforeAction:function() {
    if (Meteor.userId()) {
      Router.go('detail');
    }
    this.next();
  }
});

Router.route('login', {
	path: '/login',
	template: 'login',
	onBeforeAction:function() {
		if (Meteor.userId()) {
			Router.go('detail');
		}
		this.next();
	}
});

Router.route('register', {
	path: '/register',
	template: 'register',
	onBeforeAction:function() {
		if (Meteor.userId()) {
			Router.go('detail');
		}
		this.next();
	}
});

Router.route('detail', {
	path: '/detail',
	template: 'detail',
	layoutTemplate:'layout',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('login');
    } else {
      this.next();
    }
  },
});

Router.route('dateSearch', {
	path: '/detail/search/date/:MM/:DD/:YYYY',
	template: 'detail',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('customerSearch', {
	path: '/detail/search/customer/:name',
	template: 'detail',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('pmSearch', {
	path: '/detail/search/pm/:name',
	template: 'detail',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('overdue', {
	path: '/detail/overdue',
	template: 'detail',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('history', {
	path: '/detail/history',
	template: 'detail',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('add', {
	path: '/detail/add',
	template: 'add',
	layoutTemplate:'layout',
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			Router.go('login');
		} else {
			this.next();
		}
	},
});

Router.route('secret', {
	path: '/secret',
	template: 'secret',
});
