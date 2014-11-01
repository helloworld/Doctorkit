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

if (Meteor.isClient) {

}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
