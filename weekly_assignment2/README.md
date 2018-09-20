### **Weekly Assignment 2 : Documentation**


1. Originally, the files were created in [AWS Cloud9](https://console.aws.amazon.com/cloud9/ide/b7302c5d5d9e4cdea20fc8f53b1356a2?#)

2. [*npm install cheerio*](https://cheerio.js.org/) package was installed/imported using ```npm install cheerio``` in the node terminal 

3. **require()** method was used to load [File System](https://nodejs.org/api/fs.html) & [Cheerio](https://cheerio.js.org/)
```var request = require('request');```
```var fs = require('fs');```
```var cheerio = require('cheerio');```

6. [*.readFileSync](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) used to read file *'m04'* to extract addresses
```var content = fs.readFileSync('m04.txt');```

7. Cheerio's [.load()](http://dillonbuchanan.com/programming/html-scraping-in-nodejs-with-cheerio/) method used to load HTML contents ```var $ = cheerio.load(content);```

8. From the [HTML](https://parsons.nyc/aa/m04.html) structure snippet below we understand that the entire address is contained within **td** tag with a particular *'style'* and which also breaks at **br** for each address line.
Therefore, the string was split at br and comma It was also trimmed for additional spaces. The required address lines lie at different indices of the styled array.
Each address was added to *m04Addresses* using *+=* operator. ```if($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px'){ }```


         ``` <td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
              <h4 style="margin:0;padding:0;">46th Street Club House</h4><br />
				  	   <b>4 THE GRACE - </b><br />
					        252 West 46th Street, 3rd Floor,
						<br />(Betw Broadway & 8th Avenue) 10036
					     <br />
					     <br />
               </td>```
               

9. Finally, the contents of the variable were loaded to a separate text file *m04Addresses* ```fs.writeFileSync('m04Addresses.txt', m04Addresses)```
