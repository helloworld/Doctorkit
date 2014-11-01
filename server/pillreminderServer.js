Meteor.startup(function() {
    // code to run on server at startup
});
Meteor.publish('patients', function() {
    return Patients.find();
});
