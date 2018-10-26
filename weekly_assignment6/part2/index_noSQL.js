// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = 'us-east-1';

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : 'newdeardiary',
    
    //Use the KeyConditionExpression parameter to provide a specific value for the partition key
    'KeyConditionExpression': '#dt = :date AND #rd = :round', 
    'ExpressionAttributeNames': { // name substitution, used for reserved words in DynamoDB
        "#dt" : 'date',
        "#rd" : 'round'
    },
    'ExpressionAttributeValues': { // the query values
        ':date': {S: 'Oct 02 2018'},
        // ":minDate": {N: new Date("September 1, 2018").valueOf().toString()},
        // ":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}
        ':round': {N: '1'}
    }
};

console.log(params);
dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        //console.log(data);
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});