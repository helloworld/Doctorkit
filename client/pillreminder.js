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
Router.route('/viewPatient/:_id', function() {
    name: 'viewPatient';
    this.layout('ApplicationLayout');
    this.render('viewPatient', {
        data: function() {
            return Patients.findOne({
                _id: this.params._id
            });
        }
    });
});

Router.route('/messagePatient', function() {
    name: 'messagePatient';
    this.layout('ApplicationLayout');
    this.render('messagePatient');
});
// Router.route('/mypatients/:test', function() {
//     this.layout('ApplicationLayout');
//     this.render('viewpatient');
// });
// patientSub = Meteor.subscribe('patients');
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
    'click #addPatient': function(event) {
        event.preventDefault();
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var gender = $("#gender").val();
        var height = $("#feet").val()+'\' ' + $("#inches").val()+'\"';
        var weight = $("#weight").val();
        var bloodtype = $("#bloodtype").val();
        var phonenumber = $("#phonenumber").val();
        if (!firstname || !lastname || !gender || !height || !weight || !bloodtype) {
            swal({
                title: "Error!",
                text: "Please fill out all fields",
                type: "error",
                confirmButtonText: "Ok."
            });
        } else {
            Patients.insert({
                drkey: Meteor.user()._id,
                firstname: firstname,
                lastname: lastname,
                data: {
                    gender: gender,
                    height: height,
                    weight: weight,
                    bloodtype: bloodtype,
                },
                phonenumber: phonenumber,
            }, function(err, res) {
                swal({
                    title: "New User Created",
                    text: "Next, add their prescriptions",
                    type: "success",
                    confirmButtonText: "Continue",
                }, function() {
                    Router.go("/viewPatient/" + res)
                });
            });
        }
    }
});
Template.header.events({
    'click .logout': function() {
        Meteor.logout();
    }
});
Template.sidebar.helpers({
    user: function() {
        return Meteor.user();
    }
});
Template.viewPatient.events({
    'click #getPrescription': function() {
        var prestext = $("#prescriptionText").val();
    }
})
Template.messagePatient.helpers({
    users: function() {
        return Patients.find({
            drkey:Meteor.user()._id
        });
    }
});
Template.patients.helpers({
    users: function() {
        return Patients.find({
            drkey:Meteor.user()._id
        });
    }
});

Template.messagePatient.events({
    "click #sendMessage": function (evt) {
        console.log(evt);
        var message = $('#textArea'+evt.target.dataset.phone).val();
        Meteor.call("sendMessage", evt.target.dataset.phone, message, function(e, r) {
            console.log(r);
        });
        $('#modalmessage' + evt.target.dataset.phone).modal('hide');
    },

    "click #sendEmail": function (evt){
      if (typeof console !== 'undefined')
        Meteor.call('sendEmail',
        $('#receiver').val() + "",
        $('#email').val() + "",
        'Message from ' + $('#firstname').val() + ' ' + $('#lastname').val() + '\'s Doctor!',
        $('#textArea').val() + "");
    }
})