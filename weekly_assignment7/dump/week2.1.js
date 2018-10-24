// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
var m06Address = [];

// load the m06 text file into a variable, `content`
var content = fs.readFileSync('../Week7Assignment/data/m10.txt'); //goes up to the directory 'data structures', then back down to data, then to m05

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of addresses
$('td').each(function(i, elem) { // "each" is a loop  // all the addresses were in tables 
    //console.log($(elem).attr("style"));
    //console.log('***************************************');
    if ($(elem).attr("style") == 'border-bottom:1px solid #e3e3e3; width:260px') {
        //console.log($(elem).html().split('<br>')[2].trim().split(',')[0])
        //m06Address += ($(elem).html().split('<br>')[2].trim().split(',')[0]) + '\n';
        if ($(elem).html().split('<br>')[2].trim().split(',')[0].split('.')[0] == 
        "Central Park West &amp; 76th Street - basement gymnasium") {
        m06Address.push("160 Central Park West")
        }
        else {
        m06Address.push($(elem).html().split('<br>')[2].trim().split(',')[0].split('.')[0]);
        }
    }
});


// write the addresses to a text file
//var m06Address = ''; // this variable will hold the lines of text
 
fs.writeFileSync('m10Address.txt', JSON.stringify(m06Address));