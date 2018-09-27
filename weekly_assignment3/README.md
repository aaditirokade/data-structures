### **Weekly Assignment 3 : Documentation**


1. Originally, the files were created in [AWS Cloud9](https://console.aws.amazon.com/cloud9/ide/b7302c5d5d9e4cdea20fc8f53b1356a2?#)

2. [*index3.js*](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment3/index3.js) contains the JS for this assignment

3. An account was created with [*Texas A&M GeoServices*](https://geoservices.tamu.edu/Signup/) and the *apikey* (to use to build a URL to retrive the Geocodes details) was copied from the account and added to a variable using terminal commands 
```export NEW_VAR="Content of NEW_VAR variable"``` &
```printenv | grep NEW_VAR```

4. ```async.eachSeries``` [*An asynchronous function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) is a function which operates asynchronously via the event loop, using an implicit Promise to return its result. Syntax:
```async function name([param[, param[, ... param]]]) {statements}```

5. String concatenation used to build URL with the street address, city and state. The URL also takes _apikey_ retrieved earlier. Request was logged for this URL using ```request(apiRequest, function(err, resp, body) { });``` It returns the HTML content in _body_ which was then parsed to _tamuGeo_ ```var tamuGeo = JSON.parse(body);```

6. ```var thisGeo = {}; ``` was appended to create an object with elements- Street address, Latitude and Longitude. After observing the parsed HTML content and investigating the hierarchy, Latitude and Longitudes were found to be at ```tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude``` & ```tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude``` These objects were pused to _meetingsData_ array using ```meetingsData.push(thisGeo)```

7. [*JSON.stringify*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) was used to convert JavaScript value to a JSON string. A *'first.json'* file was created manually and it was re-written using ```fs.writeFileSync('first.json', JSON.stringify(meetingsData));``` with the objects stored in meetingsData using File System package.

8. Final output is thus stored in the _*first.json*_ file and contans following format for each address input: ```{"Address":"252 W 46TH ST New York NY ","Lat":"40.7593831","Long":"-73.9872329"}```
