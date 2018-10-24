var request = require('request'); // npm install request
// module for dealing with asychronisty (in order)
var async = require('async'); // npm install async
var fs = require('fs');

var apiKey = process.env.TAMU_KEY; 

var meetingsData = [];
//var addresses = ["207 West 96th Street","120 West 69th Street","422 West 57th Street"]; // an array 
var addresses = JSON.parse(fs.readFileSync("m08Address.txt"))
// we want the lat and long of these addresses 

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) { // does this in order
    // the stem of the URL for the request - we can add the API Key and API Version bc they are required 
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    // value is provided in the callback function of the addresses 
    // which is an array - the value of each series is whatever the array is at that time in the series 
    // %20 is the ampersand in the url 
    // this street address is equal to 63%20 fifth%20 Ave%20
    apiRequest += 'streetAddress=' + value.split(' ').join('%20'); 
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    // we want a JSON format 
    apiRequest += '&format=json&version=4.01';
    
    //making this request by putting in the URL we just constructed 
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body); //parsing to make it a JS object 
            var thisGeo = {};
            thisGeo.streetAddress = tamuGeo['InputAddress']['StreetAddress'];
            thisGeo.lat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'];
            thisGeo.long = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'];
            console.log(thisGeo);
            //console.log(tamuGeo['FeatureMatchingResultType']); // logging the result type 
            meetingsData.push(thisGeo);
            //meetingsData.push(tamuGeo); // pushing the result to the empty meetings data array 
        }
    });
    setTimeout(callback, 500);
}, function() {
    fs.writeFileSync('m08Address.json', JSON.stringify(meetingsData)); // writing a file with this info 
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});