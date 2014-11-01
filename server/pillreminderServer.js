Meteor.startup(function() {
    // code to run on server at startup
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
        //console.log(string)
        var url = "http://api.wolframalpha.com/v2/query?appid=" + appID + "&input=sig+code+Metformin+500mg.+1+tab+PO+BID+WF.+Disp+30";
        var result = HTTP.call("GET", url);
        result = result.content + "";
        console.log(result);
        console.log('------\n--------\n-------')
        result = result.substring(result.indexOf("<pod title='Abbreviations used'"), result.length);
        result = result.substring(result.indexOf("<plaintext>"), result.length);
        result = result.substring(0, result.indexOf("</plaintext>"))
        result = result.replace("<plaintext>", "");
        result = result.replace("\n", " ");
        array = result.split("| ");
        console.log(array);
    },
    sendMessage: function(number, message) {
        var data = {};
        data = JSON.parse(Assets.getText("credentials.json"));
        ACCOUNT_SID = data.sid;
        AUTH_TOKEN = data.authToken;
        var result = Meteor.http.post('https://api.twilio.com/2010-04-01/Accounts/' + ACCOUNT_SID + '/Messages/', {
            params: {
                From: "2027602988",
                To: number,
                Body: message, 
            },
            auth: ACCOUNT_SID + ":" + AUTH_TOKEN
        });
        return result;
    },
});
