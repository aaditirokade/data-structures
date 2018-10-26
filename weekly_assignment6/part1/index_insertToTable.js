const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'aaditirokade';
db_credentials.host = 'mydb.cizrmttbtymm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'thisdb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// const client = new Client(db_credentials);
// client.connect();
// var thisQuery = "SELECT * FROM aalocations1;";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

//var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];

for(j=1; j<11;j++) {
    
    if(j<10){
    var addressesForDb = JSON.parse(fs.readFileSync('combinedm0'+j+'Address.json'));}
    else{
      var addressesForDb = JSON.parse(fs.readFileSync('combinedm'+j+'Address.json')); 
    }



//var addressesForDb = JSON.parse(fs.readFileSync('zone4locations.json'));
//var addressesForDb = JSON.parse(fs.readFileSync('combinedm01Address001.json'));

// addressesForDb.forEach((value)=>{
//     // console.log(value.oldAddress);
//     // console.log(value.newAddress);
//     // console.log(value.lat);
//     // console.log(value.long);
//     console.log(value.title.replace('\'', ' '));
//     // console.log(value.wheelc);
//     // console.log(value.meetings.length);
//     // for(i=0;i<value.meetings.length;i++){
//     // console.log(value.meetings[i][0]);
//     // console.log(value.meetings[i][1]);
//     // console.log(value.meetings[i][2]);
//     // }
    
//     // console.log(value.details);
// });


async.eachSeries(addressesForDb, function(value, callback) {
    
    //loop to access all the items of meetings array
    for(i=0;i<value.meetings.length;i++){
        
    const client = new Client(db_credentials);
    client.connect();
    //var thisQuery = "INSERT INTO aalocations1 VALUES (E'" + value.Address + "', " + value.Lat + ", " + value.Long + ");";
    //var thisQuery = "SELECT * FROM aalocations1;";

        //E' is escape notation, following query accesses data from addressesForDb variable to insert it into the table
        
        var thisQuery = "INSERT INTO aalocations1 VALUES (E'"+ value.oldAddress.replace('\'', ' ') + "', '" + value.newAddress.replace('\'', ' ') + "','" +value.lat+ "','" +value.long+ "','" + value.title.replace('\'', ' ') + "','" +value.wheelc+ "','" +value.meetings.length+ "','" +value.meetings[i][0]+ "','" +value.meetings[i][1]+ "', '" +value.meetings[i][2]+ "','" +value.meetings[i][3]+ "','"+ value.details.replace('\'', ' ') + "');";
    
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    }
    
    setTimeout(callback, 2000); 
   
}); 

}
