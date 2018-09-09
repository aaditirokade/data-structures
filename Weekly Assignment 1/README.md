### **Weekly Assignment 1 : Documentation**


1. Originally, the files were created in [AWS Cloud9](https://us-east-2.console.aws.amazon.com/cloud9/ide/0fbf7e67daae4743879fe3dc25da2986) environment.

2. [*node_modules*](https://github.com/aaditirokade/data-structures/tree/master/Weekly%20Assignment%201/node_modules) library was installed/imported using ```npm install request``` in the console 

3. A [*data*](https://github.com/aaditirokade/data-structures/tree/master/Weekly%20Assignment%201/data) folder was added to store generated text files to the local environment using ```mkdir data``` in the console 

4. **require** function was used to load the Node.js [**request**](https://github.com/request/request). Request is designed to be the simplest way possible to make http calls. Similarly, [**fs**](https://nodejs.org/api/fs.html) module was loaded. The fs module provides an API for interacting with the file system.
```var request = require('request');```
```var fs = require('fs');```

6. Common part of the urls **'https://parsons.nyc/aa/'** was stored as a separate string and the varying part of the urls **'m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10'** was stored as a separate array of the strings, for concatenation.
```var url = 'https://parsons.nyc/aa/'; ```                                                                        
```var zones = ['m01', 'm02', 'm03','m04','m05','m06','m07','m08','m09','m10']; ```

7. A **for loop** with counter **i** initiated for re-usage of the code snippet for a single url. [**fs.writeFileSync**](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options) fuction with *attributes: filename, body* was called each time for a condition when the request was made successfully: [*response.statusCode*](https://restfulapi.net/http-status-codes/) and when 'no error'.

         ```for (let i=0; i<zones.length; i++){```
            ``` request(url+ zones[i] + '.html', function(error, response, body){```   
             ```if (!error && response.statusCode == 200) {  ```               
                ```fs.writeFileSync('/home/ec2-user/environment/assignment1/data/'+ zones[i] + '.txt', body);```


  *Issue: for loop counter **i** did not work when initiated as *var* but did work when initiated as *let* the reason of which is still a mystery
