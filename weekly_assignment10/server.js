var express = require('express'), // npm install express
app = express();

const { Pool } = require('pg'); //npm install pg

var AWS = require('aws-sdk');  //npm install aws-sdk

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'aaditirokade';
db_credentials.host = 'mydb.cizrmttbtymm.us-east-1.rds.amazonaws.com';
// db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'thisdb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// // AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

//var dynamodb = new AWS.DynamoDB();


// ***** SENSOR *****
// respond to requests for /sensor
app.get('/sensor', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query sensorTime sensorValue   //AVG(sensorValue::int) as num_obs //ORDER BY sensorday;`; //GROUP BY sensorValue
    //, EXTRACT(DAY FROM sensorTime) as sensorday
    // var q = `SELECT sensorValue
    //          FROM sensorData1
    //          GROUP BY (DAY FROM sensorTime);`;

    var q = `SELECT sensorValue, COUNT(sensorValue), EXTRACT(DAY FROM sensorTime) as sensorday
                      FROM sensorData1
                      GROUP BY sensorValue, sensorday ;`;

    // var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
    //                           COUNT(sensorValue = 'false') as num_obs
    //                           FROM sensorData
    //                           GROUP BY sensorday
    //                           ORDER BY sensorday;`;



    // var q = `SELECT sensorValue, sensorTime FROM sensorData1 GROUP BY sensorValue;`;

    //var p = `SELECT *FROM sensorData1;`;

    client.connect();
        client.query(q, (qerr, qres) => {
            if (qerr) { throw qerr }
            else {
                res.send(qres.rows);
                client.end();
                console.log('1) responded to request for sensor data');
            }
        });

});


// ***** AA MEETINGS *****
// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var thisQuery = `SELECT newAddress, title as location, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'latitude', lat, 'longitude', long, 'type', meetingtype, 'details', details )) as meetings
                 FROM aalocations1
                 WHERE day = 'Saturdays' OR day = 'Sundays'
                 GROUP BY newAddress, title
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});


// ***** DEAR DIARY *****
// respond to requests for /deardiary

app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
    //AND #rd = :round AND #water = :water
    var params = {
        TableName: 'newdeardiary',
        KeyConditionExpression: '#dt = :date AND #rd = :round', // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt" : 'date',
            "#rd" : 'round'
            // "#dt3" : 'date'
            // "#rd" : 'round'
        },
        ExpressionAttributeValues: { // the query values
            ':date': {S: 'Nov 02 2018'},
            ':round': {N: '1'}
            // ':date3': {S: 'Nov 03 2018'}
        // ":minDate": {N: new Date("September 1, 2018").valueOf().toString()},
        // ":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}

        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
