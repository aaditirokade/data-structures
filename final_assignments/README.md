### Final Assignment1 : AA Meetings

- UI Screenshots: [Version1](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_aaMeetings_version1.png)  [Version2](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_aaMeetings_version2.png)  [Data](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/screenshot_aameetings_data.png) [Landing page](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_landingPage.png)
- [Documentation](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/README1.md) 
- hosted on: http://172.26.12.173:8080
- Query and javascript [server.js](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server.js)
- Query

```    var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
                      FROM aalocations1 WHERE day='Saturdays' OR day='Sundays'
                      GROUP BY newAddress, title, lat, long`; ```




### Final Assignment2 : Dear diary

- UI Screenshots: [UI](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_dearDiary.png)  [Data](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/screenshot_dearDiary_data.png) . [Landing page](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_landingPage.png)
- [Documentation](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/README2.md) 
- hosted on: http://172.26.12.173:8080
- Query and javascript [server.js](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server.js)
- Query

```  var params = {
        TableName: "newdeardiary",
        KeyConditionExpression: '#dt = :date AND #rd = :round', // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt" : 'date',
            "#rd" : 'round'
        },
        ExpressionAttributeValues: { // the query values
            ':date': {S: 'Nov 02 2018'},
            ':round': {N: '1'}
        } };
```



### Final Assignment3 : Tilt sensor

- Final UI snaps: [UI](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_sensor.png)  [Data](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/screenshot_sensor_data.png) [Landing page](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/screenshots/UI_screenshot_landingPage.png)
- [Documentation](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/README3.md) 
- hosted on: http://172.26.12.173:8080
- Query and javascript [server.js](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server.js)
- Query

```   var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                    FROM sensorData1 WHERE sensorvalue='true'
                    GROUP BY sensorValue, sensorday, sensormonth
                    ORDER BY sensorday, sensormonth DESC;`;```


