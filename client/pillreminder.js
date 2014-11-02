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
        var height = $("#feet").val() + '\' ' + $("#inches").val() + '\"';
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
Template.viewPatient.helpers({
    'meds': function() {
        var link = window.location + ""
        link = link.split("/");
        link = link[link.length - 1];
        curUserId = link
        return Medications.find({
            user: curUserId
        });
    }
})
Template.viewPatient.events({
    'click #getPrescription': function() {
        var prestext = $("#prescriptionText").val();
    }
})
Template.messagePatient.helpers({
    users: function() {
        return Patients.find({
            drkey: Meteor.user()._id
        });
    }
});
Template.patients.helpers({
    users: function() {
        return Patients.find({
            drkey: Meteor.user()._id
        });
    }
});
Template.patients.events({
    'click #patientName': function(event) {
        Router.go("/viewPatient/" + event.currentTarget.dataset.id)
    }
});
Template.messagePatient.events({
    'click #sendMessage': function(evt) {
        console.log(evt);
        var message = $('#textArea' + evt.target.dataset.phone).val();
        Meteor.call("sendMessage", evt.target.dataset.phone, message, function(e, r) {
            console.log(r);
        });
        $('#modalmessage' + evt.target.dataset.phone).modal('hide');
    },
    "click #sendEmail": function(evt) {
        if (typeof console !== 'undefined') Meteor.call('sendEmail', $('#receiver').val() + "", $('#email').val() + "", 'Message from ' + $('#firstname').val() + ' ' + $('#lastname').val() + '\'s Doctor!', $('#textArea').val() + "");
    }
})
Template.viewPatient.events({
    'click #getPrescription': function() {
        var string = $("#prescriptionText").val();
        $("#wolfram").html("Loading...");
        Meteor.call('getWolfram', string, function(err, res) {
            console.log(res);
            var string = res[5] + res[7] + res[9] + res[11];
            console.log(string);
            $("#wolfram").html(string);
            var frequency;
            if (string.indexOf("twice") > -1) {
                frequency = 2;
            } else if (string.indexOf("every morning") > -1) {
                frequency = 1;
            }
            for (i = 1; i <= frequency; i++) {
                if (i > 1) {
                    offset = "";
                    brek = "<br><br><br>"
                } else {
                    offset = ""
                    brek = ""
                }
                $("#timeSelectors").html($("#timeSelectors").html() + brek + "<div class='col-sm-3 " + offset + "'> <input type='number' class='form-control' id='hour" + i + "' min='0' max='12'> Hour </div> <div class='col-sm-3'> <input type='number' class='form-control' id='min" + i + "' min='0' max='59'> Minutes </div> <div class='col-sm-3'> <select class='form-control' id='Time" + i + "'> <option>AM</option> <option>PM</option> </select> </div>");
            }
            $("#timeSelectors").html($("#timeSelectors").html() + "<br><br><br><br><br><button type='button' id='insertPrescriptions' data-number='" + frequency + "' class='btn btn-warning'>Finalize Prescription</button>");
        });
    },
    'click #insertPrescriptions': function(event) {
        frequency = event.currentTarget.dataset.number;
        var link = window.location + ""
        link = link.split("/");
        link = link[link.length - 1];
        for (i = 1; i <= frequency; i++) {
            var hour = $("#hour" + i).val();
            var min = $("#min" + i).val();
            var name = $("#prescriptionText").val().split(" ")[0]
            var user = link
            var description = Meteor.call('getWolframDescription', $("#prescriptionText").val(), function(err, res) {
                var record = {
                    hour: hour,
                    min: min,
                    name: name,
                    user: user,
                    description: res,
                }
                Medications.insert(record)
                alert("success");
            })
        }
    }
})
