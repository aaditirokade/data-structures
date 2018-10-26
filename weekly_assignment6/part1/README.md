### **Weekly Assignment 6 Part1 : Documentation**

#### Part1

1. New table [aalocations1](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/table_output.txt) was created in PostgreSQL database based on the JSON output from the [Assignment7](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7) :: parsing all zones (I've borrowed [Michael's parser code](https://github.com/wolfm2/data-structures/blob/master/week_7/parseZones.js) temporarily to base the next bits of this assignment upon. I'll be building alternate one for future use.) + acquiring geocodes latitude and longitude info for locations from all zones + adding latitude and longitudes to the original JSON objects

2. Constructed following [query](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/index_createTable.js) to create table with aa data parameters:

``` var thisQuery = "CREATE TABLE aalocations1 (oldAddress varchar(255),newAddress varchar(255),lat double precision, long double precision, title varchar(255), wheelc boolean, meetings integer, day varchar(100), startTime varchar(100), endTime varchar(100), meetingType varchar(50), details varchar(255));" ```

:this SQL query is based on JSON [combinedm0XAddress.json](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment6/part1) files obnained as an output of assignment7.

3. Constructed following [query](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/index_insertToTable.js) to add entries to the table aalocations1 for all zones. 
``` var thisQuery = "INSERT INTO aalocations1 VALUES (E'"+ value.oldAddress.replace('\'', ' ') + "', '" + value.newAddress.replace('\'', ' ') + "','" +value.lat+ "','" +value.long+ "','" + value.title.replace('\'', ' ') + "','" +value.wheelc+ "','" +value.meetings.length+ "','" +value.meetings[i][0]+ "','" +value.meetings[i][1]+ "', '" +value.meetings[i][2]+ "','" +value.meetings[i][3]+ "','"+ value.details.replace('\'', ' ') + "');"; ```

Loop to iterate through independent JSON files obtained for each zone:
```    for(j=1; j<11;j++) {
              if(j<10){
                  var addressesForDb = JSON.parse(fs.readFileSync('combinedm0'+j+'Address.json'));}
              else{
                  var addressesForDb = JSON.parse(fs.readFileSync('combinedm'+j+'Address.json')); } ```
```

Table [aalocations1](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/table_output.txt) now has all aa data. 

4. Below query fetches condition based entries from the table:
```var thisQuery = "SELECT oldAddress, newAddress, lat, long FROM aalocations1 WHERE day = 'Mondays' AND startTime='1:00 PM';";```

:: [query output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part1/queryOutput.txt)



