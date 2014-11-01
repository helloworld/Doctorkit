Patients = new Meteor.Collection('patients');

Router.route('/login', function() {
    this.render('login');
});
Router.route('/signup', function() {
    name: 'signup',
    this.render('signup');
});
Router.onBeforeAction(function() {
    // all properties available in the route function
    // are also available here such as this.params
    if (!Meteor.user()) {
        // if the user is not logged in, render the Login template
        this.render('login');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function from runnning
        this.next();
    }
}, {
    except: ['login', 'signup']
});
Router.route('/dashboard', function() {
    name: 'dashboard';
    this.layout('ApplicationLayout');
    this.render('dashboard');
});
Router.route('/addPatient', function() {
    name: 'addPatient';
    this.layout('ApplicationLayout');
    this.render('addPatient');
});
if (Meteor.isClient) {
    Template.login.events = {
        'click #signin': function(event) {
            event.preventDefault();
            var username = $('#email').val();
            var password = $('#password').val();
            Meteor.loginWithPassword(username, password, function(error) {
                if (error) {
                    alert(error.reason + 'error');
                } else {
                    Router.go('/dashboard');
                    alert('You are now logged in.');
                }
            });
        }
    };
    Template.signup.events({
        'click #signup': function(event, template) {
            event.preventDefault();
            var user = {
                email: $('#email').val(),
                password: $('#password').val(),
                profile: {
                    firstname: $("#firstname").val(),
                    lastname: $("#lastname").val()
                }
            };
            if (!user.email || !user.password || !user.profile.firstname || !user.profile.lastname) {
                alert('Please fill in all fields');
            } else {
                Accounts.createUser(user, function(error) {
                    if (error) {
                        alert(error.reason + 'error');
                    } else {
                        Router.go('/dashboard');
                    }
                });
            }
		},
	});

    Template.addPatient.events({
        'click #addPatient' : function() {
            var first = $("#firstname").val();
            var last = $("#lastname").val();
            var gender = $("#gender").val();
            var height = $("#height").val();
            var weight = $("#weight").val();
            var bloodType = $("#bloodtype").val();
        }
    })

    Template.header.events({
        'click .logout': function() {
            Meteor.logout();
        }
    });
}
if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
