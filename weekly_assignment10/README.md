
### **Weekly Assignment 10 : Documentation**

##### 1. AA meetings:

- [This](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment11/UIconceptAAmeetings.png) is what the visualization should look like. 
- Data mapping: Considering the filter (from assumptions)the meetings that meet the criteria should show on the map- mapped based on the latitude, longitude by using circles (with radius equivalent to the number of meetings) and grouped by location.
  (optional: depending on AM-PM selection meetings should be filtered further)
- Default view: map with all weekend meetings
- Assumptions: User wants to know only meetings that happen over the weekend

Considering above conditions, the variables I require are: 
title, newaddress, lat, long, starttime, endtime, meetingtype and details

Hence, query:

```var thisQuery = `SELECT newAddress, title as location, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'latitude', lat, 'longitude', long, 'type', meetingtype, 'details', details )) as meetings
                 FROM aalocations1
                 WHERE day = 'Saturdays' OR day = 'Sundays'
                 GROUP BY newAddress, title
                 ;`; ```

[Output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment10/output/http:localhost:8080:aameetings.pdf)


##### 2. Dear Diary:

- [This](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment11/UIconceptDeardiary.png) is what the visualization should look like. 
- Data mapping: Overall game performance section should show colored blocks equivalent to games won/lost/folded till date.
  Similarly, "No. pf people I talked to" & "Water Consumption" sections display blocks but only for last 3 days.
- Assumptions: User is interested in knowing data on "No. pf people I talked to" & "Water Consumption" only for last 3 days.

Considering above conditions, the variables I require are: 
result, people, water

query(using primary and combined key):

```var params = {
        TableName: 'newdeardiary',
        KeyConditionExpression: '#dt = :date AND #rd = :round',
        ExpressionAttributeNames: { 
            "#dt" : 'date',
            "#rd" : 'round'
        },
        ExpressionAttributeValues: {
            ':date': {S: 'Nov 02 2018'},
            ':round': {N: '1'}
       }
   };
   ```

[Output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment10/output/http:localhost:8080:deardiary.pdf)

##### 3. Sensor:

- [This](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment11/UIconceptSensor.png) is what the visualization should look like. 
- Data mapping: 8 hrs (in minutes mapped to big circle), small circle represents "wake" time (from hearing 1st alarm to actualing getting up)
  (optional: provide a wave of recorded digital values for last two days)
- Assumptions: Sensor was tilted every time the alarm buzzed and was registered.

Considering above conditions, the variables I require are: 
sensorValue, sensorcount, day

query:

``` var q = `SELECT sensorValue, COUNT(sensorValue), EXTRACT(DAY FROM sensorTime) as sensorday
                      FROM sensorData1
                      GROUP BY sensorValue, sensorday ;`;```
                      
[Output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment10/output/http:localhost:8080:sensor2.pdf)



