// var twilio = require('twilio'),
// client = twilio('ACCOUNT_SID', 'AUTH_TOKEN'),
// cronJob = require('cron').CronJob;
// create a new cronjob for each new medication
// var textJob = new cronJob( '0 18 * * *', function(){
//   client.sendMessage( { to:'YOURPHONENUMBER', from:'YOURTWILIONUMBER', body:'Hello! Hope you’re having a good day!' }, function( err, data ) {});
// },  null, true);
Meteor.startup(function() {
    // Meteor.setInterval(function() {
    //     //GET TIME
    //     var date = new Date;
    //     var minutes = date.getMinutes() + "";
    //     var hour = date.getHours() + "";
    //     var meds = Medications.find({
    //         hour: hour,
    //         min: minutes
    //     });
    //     console.log(hour + " " + minutes)
    //     meds.forEach(function(med) {
    //         user = Patients.findOne({_id: med.user});
    //         message = "Reminder to take your " + med.name;
    //         Meteor.call("sendMessage", user.phonenumber, message, function(e, r) {
    //             console.log(r);
    //         });
    //         console.log(med.user);
    //     });
    // }, 1000)
});
// Meteor.publish('patients', function() {
//     return Patients.find();
// });
Meteor.methods({
    getWolfram: function(string) {
        var data = {};
        data = JSON.parse(Assets.getText("credentials.json"));
        appID = data.appID;
        string.replace("\s", "+");
        var url = "http://api.wolframalpha.com/v2/query?appid=" + appID + "&input=sig+code+" + string;
        var result = HTTP.call("GET", url);
        result = result.content + "";
        result = result.substring(result.indexOf("<pod title='Abbreviations used'"), result.length);
        result = result.substring(result.indexOf("<plaintext>"), result.length);
        result = result.substring(0, result.indexOf("</plaintext>"));
        result = result.replace("<plaintext>", "");
        result = result.replace(/(\r\n|\n|\r)/gm, "");
        array = result.split("| ");
        return array;
    },
    getWolframDescription: function(string) {
        var data = {};
        data = JSON.parse(Assets.getText("credentials.json"));
        appID = data.appID;
        string.replace("\s", "+");
        var url = "http://api.wolframalpha.com/v2/query?appid=" + appID + "&input=sig+code+" + string;
        var result = HTTP.call("GET", url);
        result = result.content + "";
        result = result.substring(result.indexOf("<pod title='Expanded text'"), result.length);
        result = result.substring(result.indexOf("<plaintext>"), result.length);
        result = result.substring(0, result.indexOf("</plaintext>"));
        result = result.replace("<plaintext>", "");
        return result;
    },
    sendMessage: function(number, message) {
        var data = {};
        data = JSON.parse(Assets.getText("credentials.json"));
        ACCOUNT_SID = data.sid;
        AUTH_TOKEN = data.authToken;
        console.log(number)
        var result = Meteor.http.post('https://api.twilio.com/2010-04-01/Accounts/' + ACCOUNT_SID + '/Messages/', {
            params: {
                From: "2027602988",
                To: number,
                Body: message,
            },
            auth: ACCOUNT_SID + ":" + AUTH_TOKEN
        });
        console.log(result);
        return result;
    },
    sendEmail: function(to, from, subject, text) {
        // check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        result = Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
        console.log(result);
        return result;
    }
});
