
var request = require('request');
var fs = require('fs');

var url = 'https://parsons.nyc/aa/';                                                                          //url string concatenation
var zones = ['m01', 'm02', 'm03','m04','m05','m06','m07','m08','m09','m10'];                                  //urls for all zones

for (let i=0; i<zones.length; i++){
    request(url+ zones[i] + '.html', function(error, response, body){                                         //request urls
    console.log(i);                                                                                           //counter
    if (!error && response.statusCode == 200) {                                                               //if no error loading and request was successful
        fs.writeFileSync('/home/ec2-user/environment/assignment1/data/'+ zones[i] + '.txt', body);         //writing to file
    console.log(zones[i]);
    }
    else {console.log("Request failed!")}                                                                     //print this if request fails
        
    });
    
};
