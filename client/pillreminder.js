Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
    this.render('login');
});

Router.route('/dashboard', function() {
    name: 'dashboard',
    this.render('dashboard');
})

Router.route('/signup', function() {
    name: 'signup',
    this.render('signup');
})

Router.route('/addPatient', function() {
    name: 'addPatient',
    this.render('addPatient');
});

if (Meteor.isClient) {

	Template.login.events({
		'click #signin': function(event, template) {
			alert("signin");
		},
	});

}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
