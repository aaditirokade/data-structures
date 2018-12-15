# data-structures
MSDV fa18: Data structures

### [Final Assignment 1](https://github.com/visualizedata/data-structures/tree/master/assignments/final_assignment_01) 
Documentation:: AA Meetings

1. Data for 10 zones was aquired by making http calls with the usage of 'request' module
2. Aquired data for each zone was written to separate text files with the usage of 'fs' module. These files were stored into a separate folder- 'data'
3. From here onward, we individually worked on the resp. assigned zones. I was assigned zone 04.
4. 'readFileSync' was used to read file 'm04' to extract addresses. The HTML contents from the files were loaded with the help of 'cheerio' model.
5. Extracting meeting addresses: After studying the HTML content, it was realised that the entire address is contained within 'td' tag with a particular 'style' and which also breaks at <br> for each address line in m04. 
 Therefore, with the use of string methods such as - split at br and comma It etc. to extract the address lines:
``` 
<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
       <h4 style="margin:0;padding:0;">46th Street Club House</h4><br />
 		  	   <b>4 THE GRACE - </b><br />
 			        252 West 46th Street, 3rd Floor,
 				<br />(Betw Broadway & 8th Avenue) 10036
 			     <br />
 			     <br />
        </td>
```

6. The contents of the variable were loaded to a separate text file m04Addresses 
```fs.writeFileSync('m04Addresses.txt', m04Addresses)```

7. With the help of [*Texas A&M GeoServices*](https://geoservices.tamu.edu/Signup/) , [*An asynchronous function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and an URL built with String concatenation, Latitude and Longitudes were found to be at ```tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude``` & ```tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude``` These objects with latitude and longitude info were strored in _meetingsData_ array

8.[*JSON.stringify*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) was used to convert JavaScript value to a JSON string. A *'first.json'* file was created manually and it was re-written using ```fs.writeFileSync('first.json', JSON.stringify(meetingsData));``` with the objects stored in meetingsData using File System package.

9. Final output is thus stored in the _*first.json*_ file and contans following format for each address input: ```{"Address":"252 W 46TH ST New York NY ","Lat":"40.7593831","Long":"-73.9872329"}```

10. The [table schema](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment4/part1_table%20schema-01.png) was created in [Illustrator.](https://www.adobe.com/products/illustrator.html?gclid=Cj0KCQjw9NbdBRCwARIsAPLsnFbCEp0dwqvl61sblmvqs_WvFJftp2ErJCCIAgs0cjeQhNi--OYVJEIaAgMXEALw_wcB&sdid=KKQML&mv=search&ef_id=Cj0KCQjw9NbdBRCwARIsAPLsnFbCEp0dwqvl61sblmvqs_WvFJftp2ErJCCIAgs0cjeQhNi--OYVJEIaAgMXEALw_wcB:G:s&s_kwcid=AL!3085!3!196928852568!e!!g!!adobe%20illustrator)

11. After observing the webpage for [Zone04,](https://parsons.nyc/aa/m04.html) I realised that there are 3 major entities: *Meeting, Location, Hours*

   ``` 
       A Meeting has one Location and one Hours       
       A Location has one or many Meetings
       Hours has many meetings
   ```
 I decided to have one table each for Meeting, Location and Hours resp. with FK differently distibuted forming the options.
 
 12.  New table [aalocations1](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/table_output.txt) was created in PostgreSQL database based on the JSON output from the [Assignment7](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7) :: parsing all zones (I've borrowed [Michael's parser code](https://github.com/wolfm2/data-structures/blob/master/week_7/parseZones.js) temporarily to base the next bits of this assignment upon. I'll be building alternate one for future use.) + acquiring geocodes latitude and longitude info for locations from all zones + adding latitude and longitudes to the original JSON objects

13. Constructed following [query](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/index_createTable.js) to create table with aa data parameters:

``` var thisQuery = "CREATE TABLE aalocations1 (oldAddress varchar(255),newAddress varchar(255),lat double precision, long double precision, title varchar(255), wheelc boolean, meetings integer, day varchar(100), startTime varchar(100), endTime varchar(100), meetingType varchar(50), details varchar(255));" ```

:this SQL query is based on JSON [combinedm0XAddress.json](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment6/part1) files obnained as an output of assignment7.

Constructed following [query](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/index_insertToTable.js) to add entries to the table aalocations1 for all zones. 
``` var thisQuery = "INSERT INTO aalocations1 VALUES (E'"+ value.oldAddress.replace('\'', ' ') + "', '" + value.newAddress.replace('\'', ' ') + "','" +value.lat+ "','" +value.long+ "','" + value.title.replace('\'', ' ') + "','" +value.wheelc+ "','" +value.meetings.length+ "','" +value.meetings[i][0]+ "','" +value.meetings[i][1]+ "', '" +value.meetings[i][2]+ "','" +value.meetings[i][3]+ "','"+ value.details.replace('\'', ' ') + "');"; ```

Table [aalocations1](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/table_output.txt) now has all aa data. 

14.  Below query fetches condition based entries from the table:
```var thisQuery = "SELECT oldAddress, newAddress, lat, long FROM aalocations1 WHERE day = 'Mondays' AND startTime='1:00 PM';";```

:: [query output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/queryOutput.txt)

15.  Building on top of the [files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump/output) obtained after parsing, [addresses](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/addresses.js) were extracted for each zone from [original text files](https://github.com/aaditirokade/data-structures/tree/master/weekly%20assignment1/data) :: [output files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump)

16. Using the text files from previous step as input files, JSON files were saved with [Lat Long](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/latlong.js) info for each of the addresses :: [output files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump)

17. #### Combined JSON

[Combined](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/week7final.js) arguments from [output1](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump/output) & [output2](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump) to create a [combinedJSON](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7) for each zone.

18. Query was written to aquire the data needed for visualization as follows:

```    var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
                      FROM aalocations1 WHERE day='Saturdays' OR day='Sundays'
                      GROUP BY newAddress, title, lat, long`;```

19. Finally, the code was edited to connect the HTML and data alongwith JS (d3js) code to render aa meetings on map.

- [This](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment11/UIconceptAAmeetings.png) is what the visualization should look like. 
- Data mapping: Considering the filter (from assumptions)the meetings that meet the criteria should show on the map- mapped based on the latitude, longitude by using circles (with radius equivalent to the number of meetings) and grouped by location.
  (optional: depending on AM-PM selection meetings should be filtered further)
- Default view: map with all weekend meetings
- Assumptions: User wants to know only meetings that happen over the weekend

Considering above conditions, the variables I require are: 
title, newaddress, lat, long, starttime, endtime, meetingtype and details

Hence, 
[query] (https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server1.js)
&
[Render](https://htmlpreview.github.io/?https://github.com/aaditirokade/data-structures/blob/master/final_assignments/public/index.html)

I have developed 2 versions for aa meetings: 

- Version1: the dots are mapped based on lat long info on leaflet map, on selecting a particular dot, use can see info about multiple meetings. Based on the assumptions, the map only shows weekendly meetings. 

- Version 2: different colors are used to indicate meetings that happen on Saturdays and those on Sundays. The shortfall of this version is that the tooltip would not display info for multiple meetings.






