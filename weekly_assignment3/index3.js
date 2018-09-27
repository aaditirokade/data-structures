/*npm install cheerio :  run in node to install cheerio package
  https://cheerio.js.org/
*/

/* require() : load or include module File System & Cheerio
  http://fredkschott.com/post/2014/06/require-and-the-module-system/
  File System : https://nodejs.org/api/fs.html
  Cheerio : jQuery for Node.js. Cheerio makes it easy to select, edit, and view DOM elements
  https://cheerio.js.org/
*/

var fs = require('fs');
var cheerio = require('cheerio');
var m04Addresses = '';                 //empty string to store addresses

var request = require('request'); // npm install request
var async = require('async'); // npm install async

var data = [];                         //empty array to store objects containing addresses

/* .readFileSync : load content of m04 in content variable
  https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback */
  
var content = fs.readFileSync('m04.txt');

// tell Cheerio to load the returned HTML so that we can use it.
var $ = cheerio.load(content);

$('td').each(function(i, elem) {                                                     //for each element in td
  if($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px'){       //sddress line has style attribute
    
    //console.log($(elem).html().split('<br>')[3].trim().split(',')[0]);
    
    /*below snippet splits the content inside each td element with the tag specified above at break
    trims it and cocatenates the contents with indices 0, 1 for the element with parent index 2 and index 0 for parent index 3 
    observe & inspect web site structure to understand this hierarchy) */
    
    m04Addresses = $(elem).html().split('<br>')[2].trim().split(',')[0];
  
    data.push(m04Addresses);
    //data.push({'address':m04Addresses});
  }
});

var data1 = '252 West 46th Street';

/*store api-key received by writting following command to terminal
  export NEW_VAR="Content of NEW_VAR variable"
  printenv | grep NEW_VAR
*/

var newVar = process.env.NEW_VAR;  
var meetingsData = [];                      //empty array to store objects with info retrived from the URL request

// console.log(data1.split(' ').join('%20'));
// console.log(newVar);

// eachSeries in the async module iterates over an array and operates on each item in the array in series

/*The async function declaration defines an asynchronous function, which returns an AsyncFunction object
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*/
  
async.eachSeries(data, function(value, callback) {
//build URL using street assress, city and state details (%2a id for spaces in URL)
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + newVar;
    apiRequest += '&format=json&version=4.01';
    
    
//URL for one adddress (testing)  
    // var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    // apiRequest += 'streetAddress=' + data1.split(' ').join('%20');
    // apiRequest += '&city=New%20York&state=NY&apikey=' + newVar;
    // apiRequest += '&format=json&version=4.01';
    
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
              
              //console.log(body);
              // console.log(body.OutputGeocodes[0].OutputGeocode.Latitude);
              var tamuGeo = JSON.parse(body);
              var thisGeo = {};                                        //http://2ality.com/2012/01/object-plus-object.html
              thisGeo.Address = tamuGeo.InputAddress.StreetAddress;
              thisGeo.Lat = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
              thisGeo.Long = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
              console.log(tamuGeo['FeatureMatchingResultType']);
              meetingsData.push(thisGeo);
              console.log('thisGeo' + thisGeo);
              
        }
        console.log('meetingsData'+ meetingsData);
       // fs.writeFileSync('first1.json', JSON.stringify(meetingsData));
  });
setTimeout(callback, 2000);                                           //2000ms delay
}, 
function() {
    fs.writeFileSync('first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});

  