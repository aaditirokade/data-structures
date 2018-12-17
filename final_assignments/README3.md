# data-structures
MSDV fa18: Data structures

### [Final Assignment 3](https://github.com/visualizedata/data-structures/tree/master/assignments/final_assignment_01) 
Documentation:: Tilt Sensor

1. I decide to capture data on the 'daily wake up time' i.e. amount of time taken by me (since I take my time) to be slightly awake to completely awake and ready to start day's activities.

2. The photon was set up in a circuit with tilt sensor. The circuit was connected to the local wi-fi (internet).
The photon was programed to take the readings every minutes (as suited for its purpose in this scenario).

3. Titl ball sensor gives analog value, false: when in normal position and true: when tilted. I decided to capture my 'wake up time' by tilting the sensor when I first made sense of the surrounding after a good-night's sleep- each morning. The sensor was kept tilted till I woke up completely to tilt it back to its normal upright position.

4. The total 'true' count for each day is equivalent to the minutes taken by me be awake.

5. [This](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment11/UIconceptSensor.png) is what the visualization should look like. 
- Data mapping: 8 hrs (in minutes mapped to big circle), small circle represents "wake" time (from hearing 1st alarm to actualing getting up)
  (optional: provide a wave of recorded digital values for last two days)
- Assumptions: Sensor was tilted every time the alarm buzzed and was registered.

Considering above conditions, the variables I require are: 
sensorValue, sensorcount, day

query:

``` var q = `SELECT sensorValue, COUNT(sensorValue), EXTRACT(DAY FROM sensorTime) as sensorday
                      FROM sensorData1
                      GROUP BY sensorValue, sensorday ;`;```
                      
[Output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment10/output/http:localhost:8080:sensor.pdf)

6. Table creation and Query outputs:
https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment9/part1_output
https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment9/query


7. Hence, 
[query] (https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server1.js)

```var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                    FROM sensorData1 WHERE sensorvalue='true'
                    GROUP BY sensorValue, sensorday, sensormonth
                    ORDER BY sensorday, sensormonth DESC;`; ```

&
[Render](http://34.205.15.113:8080/)
