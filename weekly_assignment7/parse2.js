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
var m04Addresses = '';                  //empty string to store addresses

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
    
    m04Addresses += $(elem).html().split('<br>')[2].trim().split(',')[0] + ',' + $(elem).html().split('<br>')[2].trim().split(',')[1] + ','+ '\n' + $(elem).html().split('<br>')[3].trim().split(',')[0] +'\n'+'\n';
    
    console.log(m04Addresses);
  }
});

 fs.writeFileSync('m04Addresses.txt', m04Addresses);     // add a new text file and write address to the file
     
    
  