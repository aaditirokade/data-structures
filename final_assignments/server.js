var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone'); // moment-timezone --save

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'aaditirokade';
db_credentials.host = 'mydb.cizrmttbtymm.us-east-1.rds.amazonaws.com';
db_credentials.database = 'thisdb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


//-----------------------------------  DATA ----------------------------------------------------------

// ******** AA DATA *****************
// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
                      FROM aalocations1 WHERE day='Saturdays' OR day='Sundays'
                      GROUP BY newAddress, title, lat, long`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});



// ******** DEAR DIARY DATA *****************
// // respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

  // // AWS DynamoDB credentials
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.AWS_ID;
  AWS.config.secretAccessKey = process.env.AWS_KEY;
  AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
    var params = {
        TableName: "newdeardiary",
        KeyConditionExpression: '#dt = :date AND #rd = :round', // the query expression
        // KeyConditionExpression: '#dt = :date AND #rd = :round', // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#dt" : 'date',
            "#rd" : 'round'
        },
        ExpressionAttributeValues: { // the query values
            ':date': {S: 'Nov 02 2018'},
            ':round': {N: '1'}
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


// ******** SENSOR DATA *****************

// respond to requests for /sensor
app.get('/sensor', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    //  // SQL query
    // var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
    //                   FROM sensorData1 WHERE sensorvalue='true'
    //                   GROUP BY sensorValue, sensorday, sensormonth;`;

   //  // SQL query
   // var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
   //                   FROM sensorData1 WHERE sensorvalue='true' AND EXTRACT(MONTH FROM sensorTime)=11
   //                   GROUP BY sensorValue, sensorday, sensormonth
   //                   ORDER BY sensorday;`;

   // SQL query
  var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                    FROM sensorData1 WHERE sensorvalue='true'
                    GROUP BY sensorValue, sensorday, sensormonth
                    ORDER BY sensorday, sensormonth DESC;`;

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


//----------------------------------- HTML ----------------------------------------------------------
// ******** AA : VERSION1 HTML ********************

        // create templates
        var hx = `<!doctype html>
        <html lang="en">
        <head>

          <meta charset="utf-8">
          <title>AA Meetings</title>
          <meta name="description" content="Meetings of AA in Manhattan">
          <meta name="aaditi" content="AA">

        <!--  <script src="https://d3js.org/d3.v5.min.js"></script>
          <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.js'></script>
          <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.css' rel='stylesheet' /> -->

          <!--<link rel="stylesheet" href="css/styles.css?v=1.0">-->

                  <!-- Leaflet CSS file-->
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
           integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
           crossorigin=""/>

           <!-- Make sure you put this AFTER Leaflet's CSS -->
          <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
          integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
          crossorigin=""></script>

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
          <script src="http://js.api.here.com/v3/3.0/mapsjs-core.js"></script>
          <script src="http://js.api.here.com/v3/3.0/mapsjs-service.js"></script>


          <style>

            #mapid{
              width: 100%;
              height: 800px;
              position: fixed;
            }

            #mapid .leaflet-pane.leaflet-tile-pane {
              filter: saturate(65%);
            }


              #overlay {
                padding-top: 12px;

                    position: fixed;
                    display: inline;
                    width: 18%;
                    height: 8%;
                    top: 5%;
                    left: 3%;
                    right: 85%;
                    bottom: 80%;
                    z-index: 2;
                    background-color: black;
                    opacity:0.7;
            }


            #text1{
                  padding-top: 20px;
                  position: absolute;
                  top: 0%;
                  left: 15%;
                  font-size: 15px;
                  font-family: Lato, Helvetica, arial, sans serif;
                  color: white;
                  stroke: white; strokeWeight: 1px;

             }


            #text{
                  padding-top: 20px;
                  margin-top: 10px;
                  position: absolute;
                  top: 20%;
                  left: 25%;
                  font-size: 15px;
                  font-family: Lato, Helvetica, arial, sans serif;
                  color: gold;
                  stroke: gold; strokeWeight: 3px;
             }

          </style>
        </head>

        <body>

            <div id="overlay">
              <div id="text1"> WEEKENDLY AA MEETINGS </div>
              <div id="text"> - MANHATTAN - </div>
            </div>

            <div id="mapid"></div>


           <!-- Make sure you put this AFTER Leaflet's CSS -->
            <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
            integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
            crossorigin=""></script>
          <script>

          var data =
          `;

        var jx = `;

            var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiYWFkaXRpcm9rYWRlMSIsImEiOiJjam5vdHA1NDIwMDl3M2pudmp2N3VnNjFuIn0.365E4Awu0MI2iuzZbYmaSQ'
                }).addTo(mymap);

                mymap.zoomControl.remove();

            // SAT - CIRCLE FOR EACH MEETING
            for(var i = 0; i < data.length; i++){


                    var circle = L.circle([data[i].latitude, data[i].longitude], {
                      color: 'transparent',
                      fillColor: '#FF2459',
                      // fillColor: style(data[i].meetings[j].day),
                      fillOpacity: 0.5,
                      radius: 70
                    }).addTo(mymap);

                    // Tooltip
                    var popupText = '<br>'+ data[i].location +'<br>'+ data[i].newaddress +'<br>';

                    for(var j = 0; j < data[i].meetings.length; j++) {
                      var singleMeeting = data[i].meetings[j];
                      popupText += '<br>';
                      popupText += (singleMeeting.day).substring(0, (singleMeeting.day).length-1) + '<br>';
                      popupText += 'Start time: ' +singleMeeting.st;
                      popupText += 'End time: '+singleMeeting.et + '<br>';
                    }

                    // POPUP
                    circle.bindPopup(popupText);

            }


              function style(feature){
                if(feature=='Saturday'){
                    return {
                      'fillcolor': 'red',
                      'stroke': false
                    };
                }else{
                    return {
                      'fillcolor': 'black',
                      'stroke': false
                    };
                }
              }


            </script>
            </body>
            </html>`;



  // ******** AA : VERSION2 HTML ********************

                    // create templates
                    var hx1 = `<!doctype html>
                    <html lang="en">
                    <head>

                      <meta charset="utf-8">
                      <title>AA Meetings</title>
                      <meta name="description" content="Meetings of AA in Manhattan">
                      <meta name="aaditi" content="AA">

                    <!--  <script src="https://d3js.org/d3.v5.min.js"></script>
                      <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.js'></script>
                      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.css' rel='stylesheet' /> -->

                      <!--<link rel="stylesheet" href="css/styles.css?v=1.0">-->

                              <!-- Leaflet CSS file-->
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
                       integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
                       crossorigin=""/>

                       <!-- Make sure you put this AFTER Leaflet's CSS -->
                      <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
                      integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
                      crossorigin=""></script>

                      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                      <script src="http://js.api.here.com/v3/3.0/mapsjs-core.js"></script>
                      <script src="http://js.api.here.com/v3/3.0/mapsjs-service.js"></script>


                      <style>

                        #mapid{
                          width: 100%; height: 800px; position: fixed;
                        }

                        #mapid .leaflet-pane.leaflet-tile-pane {
                          filter: saturate(65%);
                        }

                          #overlay {
                              padding-top: 12px; position: fixed; width: 18%; height: 8%;
                              top: 5%; left: 3%; right: 85%; bottom: 80%;
                              z-index: 2; background-color: black; opacity:0.7;
                        }


                        #text1{
                              padding-top: 20px; position: absolute; top: 0%;
                              left: 15%; font-size: 15px; font-family: Lato, Helvetica, arial, sans serif;
                              color: white; stroke: white; strokeWeight: 1px;
                            }


                        #text{
                              padding-top: 20px; margin-top: 10px; position: absolute; top: 20%; left: 25%;
                              font-size: 15px; font-family: Lato, Helvetica, arial, sans serif;
                              color: gold; stroke: gold; strokeWeight: 3px;
                            }


                      </style>
                    </head>

                    <body>

                      <div id="overlay">
                        <div id="text1"> WEEKENDLY AA MEETINGS </div>
                        <div id="text"> - MANHATTAN - </div>
                      </div>
                      <div id="mapid"></div>


                      <!-- Make sure you put this AFTER Leaflet's CSS -->
                        <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
                        integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
                        crossorigin=""></script>
                      <script>

                      var data =
                      `;

                    var jx2 = `;


                    // SETUP

                    var satMeets =[]; var sunMeets=[];

                    for(i=0;i<data.length; i++){
                          for (j=0; j<data[i].meetings.length; j++){
                              if((data[i].meetings[j].day) == 'Saturdays'){
                                satMeets.push(new latlong(data[i].latitude, data[i].longitude, data[i].newaddress, data[i].meetings[j].et, data[i].meetings[j].st, data[i].meetings[j].type, data[i].location,data[i].meetings[j].day));
                              }else{
                                sunMeets.push(new latlong(data[i].latitude, data[i].longitude, data[i].newaddress, data[i].meetings[j].et, data[i].meetings[j].st, data[i].meetings[j].type, data[i].location,data[i].meetings[j].day));
                              }
                         }
                    }


                    // Object

                    function latlong(lat, long, add, et, st, type, loc, day){
                      this.lat = lat; this.long = long; this.add = add;
                      this.st= st; this.et=et; this.type=type;
                      this.loc= loc; this.day= day.substring(0, (day.length-1));

                    }

                      var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);

                            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                                maxZoom: 18,
                                id: 'mapbox.streets',
                                accessToken: 'pk.eyJ1IjoiYWFkaXRpcm9rYWRlMSIsImEiOiJjam5vdHA1NDIwMDl3M2pudmp2N3VnNjFuIn0.365E4Awu0MI2iuzZbYmaSQ'
                            }).addTo(mymap);

                            mymap.zoomControl.remove();

                        // SAT - CIRCLE FOR EACH MEETING
                        for(var i = 0; i < satMeets.length; i++){
                              var circle = L.circle([satMeets[i].lat, satMeets[i].long], {
                                color: 'transparent',
                                fillColor: '#ff6a6a',
                                fillOpacity: 0.7,
                                radius: 70
                              }).addTo(mymap);

                              var popupText = satMeets[i].loc +'<br>'+ satMeets[i].add +'<br><br>'+ satMeets[i].day + '<br> ST: '+ satMeets[i].st + ' - ET: '+satMeets[i].et+ ' | Type: '+ satMeets[i].type;
                              circle.bindPopup(popupText);
                          }


                        // SUN - CIRCLE FOR EACH MEETING
                        for(var i = 0; i < sunMeets.length; i++){
                                var circle2 = L.circle([sunMeets[i].lat, sunMeets[i].long], {
                                  color: 'transparent',
                                  fillColor: '#8470ff',
                                  fillOpacity: 0.7,
                                  radius: 70
                                }).addTo(mymap);

                              // Tooltip
                              var popupText2 = sunMeets[i].loc +'<br>'+ sunMeets[i].add +'<br><br>'+ sunMeets[i].day + '<br> ST: '+ sunMeets[i].st + ' - ET: '+sunMeets[i].et+ ' | Type: '+ sunMeets[i].type;

                              // var popupText = JSON.stringify(data[i].meetings);
                              circle2.bindPopup(popupText2);
                      }


                       </script>
                        </body>
                        </html>`;


// ******** DIARY HTML ******************

        var d1x = `<!DOCTYPE html>

        <meta charset="utf-8">
        <!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->

            <style>
                  body {
                    background: url("assets/bgimg.jpg") repeat absolute top left;
                    z-index:999;
                    font-family: Lato, Helvetica, arial, sans-serif;
                    background-color: #fef4ea;;
                  }

                  .title{
                    color: #123456;
                    font-size: 16px;
                    font-family: Lato, Helvetica Nueu, arial, sans serif;
                    font-style: normal;
                    font-weight: bold;
                    text-transform: uppercase;

                  }

                  .title1{
                    color: #123456;
                    font-size: 16px;
                    font-family: Lato, Helvetica Nueu, arial, sans serif;
                    font-style: normal;
                    font-weight: bold;
                    text-transform: uppercase;
                    left: 40%;

                  }

                  .label{
                    color: #123456;
                    font-size: 14px;
                    font-family: Lato, Helvetica Nueu, arial, sans serif;
                    font-style: normal;
                    font-weight: bold;
                    text-transform: uppercase;

                  }

                  .rectPeople{
                    color: 'white';
                    stroke: #ea7b62;
                    strokeWeight: 400;
                  }

                  image.person{
                    position: absolute;
                    z-index: 1;
                  }

                  div#tooltip {
                      position: absolute;
                      text-align: center;
                      width: 100px;
                      height: 40px;
                      padding: 2px;
                      font-size: 14px;
                      background: #fafad2;
                      border-radius: 2px;
                      pointer-events: none;
                      stroke: black;
                      fill: black;
                      color: black;
                  }


            </style>
            <script src="http://d3js.org/d3.v3.min.js"></script>
            <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.js"></script>

        <body>


        <script>
        var data = `;



        var d2x = `;
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = window.innerWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom;


            var svg = d3.select("body").append("svg").attr('class','svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

            svg.append('text').attr('x',200).attr('y',80).attr('class','title').text('dear diary, ')
            svg.append('text').attr('x',300).attr('y',80).attr('class','title').text(' "'+data.Items[0].date.S+'"').attr('fill','#312867')

            svg.append('text').attr('x',200).attr('y',110).attr('class','title1').text('Game:')
            svg.append('text').attr('x',280).attr('y',110).attr('class','title1').text(data.Items[0].round.N).attr('fill','#312867')

            var x = 200; var y=170;

            svg.append('text').attr('x',x).attr('y',y).attr('class','label').text('hold:')
            svg.append('text').attr('x',x+80).attr('y',y).attr('class','label').text(data.Items[0].cardHold.SS[0] +'     '+data.Items[0].cardHold.SS[1]).attr('fill','#782d7f')

            svg.append('text').attr('x',x+5).attr('y',y+40).attr('class','label').text('flop :')
            svg.append('text').attr('x',x+80).attr('y',y+40).attr('class','label').text(data.Items[0].cardFlop.SS[0] +'     '+data.Items[0].cardFlop.SS[1]).attr('fill','#782d7f' +'     ' +data.Items[0].cardFlop.SS[2]).attr('fill','#782d7f')

            svg.append('text').attr('x',x+5).attr('y',y+80).attr('class','label').text('turn :')
            svg.append('text').attr('x',x+80).attr('y',y+80).attr('class','label').text(data.Items[0].cardTurn.S).attr('fill','#782d7f')

            svg.append('text').attr('x',x+5).attr('y',y+120).attr('class','label').text('river :')
            svg.append('text').attr('x',x+80).attr('y',y+120).attr('class','label').text(data.Items[0].cardRiver.S).attr('fill','#782d7f')

            svg.append('text').attr('x',x).attr('y',y+160).attr('class','label').text('result :')
            svg.append('text').attr('x',x+85).attr('y',y+160).attr('class','label').text(data.Items[0].result.S).attr('fill','#782d7f')


            y=330;

            svg.append('text').attr('x',200).attr('y',y+80).attr('class','title1').text('no. of people i talked to')

           for(i=0;i<data.Items[0].people.N;i++){
             svg.append('rect').attr('x',200+i*30).attr('y',y+100).attr('class','rectPeople').attr('width', 20).attr('height',20).attr('fill','#bb4974')
           }

            svg.append('text').attr('x',200).attr('y',y+180).attr('class','title1').text('Water consumed')
            svg.append('rect').attr('x',200).attr('y',y+200).attr('class','rectPeople').attr('width', 500).attr('height',20).attr('fill','transparent')
            svg.append('rect').attr('x',200).attr('y',y+200).attr('class','rectPeople').attr('width', parseFloat(data.Items[0].water.S)*100).attr('height',20).attr('fill','#ea7b62')
            svg.append('text').attr('x',200).attr('y',y+237).attr('class','title1').text('0 ltr')
            svg.append('text').attr('x',667).attr('y',y+237).attr('class','title1').text('5 ltr')


            var x = 130; y=400;

      svg.selectAll('p').data(data).enter().append('rect')
             .attr('x', (d, i)=> {return (5+i*10);})
             .attr('y', 200)
             .attr('width',10)
             .attr('height',10)
             .attr('fill', '#f9d128')


  </script>`;


// ******** SENSOR HTML *****************
// VAR 1

      var s1x = `<!DOCTYPE html>
      <meta charset="utf-8">
      <!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->

      <style>

    body {
      font: 10px Lato, Helvetica, arial, sans-serif;
      background-color: #fef4ea;;
    }

    .axis path,
    .axis line {
      position: absolute;
      z-index: 0;
      fill: salmon;
      // stroke: #000;
      shape-rendering: crispEdges;
      strokeWeight: 1px;
      stroke-width: 1px;
    }

    .bar {
    stroke: #d75b68;
    strokeWeight: 0.5;
    border: #d75b68;
    }

    .bar:hover {
      fill: salmon ;
    }


    .d3-tip {
      line-height: 1;
      font-weight: bold;
      padding: 12px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      border-radius: 2px;
    }

    /* Creates a small triangle extender for the tooltip */
    .d3-tip:after {
      box-sizing: border-box;
      display: inline;
      font-size: 10px;
      width: 50%;
      height: 50%;
      line-height: 1;
      color: lightgray;
      position: absolute;
      text-align: center;
    }

    /* Style northward tooltips differently */
    .d3-tip.n:after {
      margin: -1px 0 0 0;
      top: 100%;
      left: 0;
    }

    div#tooltip {
        position: absolute;
        text-align: center;
        width: 100px;
        height: 40px;
        padding: 2px;
        font-size: 14px;
        background: #fafad2;
        border-radius: 2px;
        pointer-events: none;
        stroke: black;
        fill: black;
        color: black;
    }


  .domain {
      color: transparent;
      fill: transparent;
      stroke: brown;
      stroke-width: 2px;
      align:right;
    }

    .label{
      text-transform: uppercase;
      color: #8b0000;
      fill:#542b78;
      stroke:#542b78;
      font-size: 56px;
      stroke-width:1px;
      text-align: left;
    }

    .label2{
      text-transform: uppercase;
      color: #8b0000;
      fill:#8b0000;
      stroke:#8b0000;
      font-size: 21px;
      stroke-width:1px;
      text-align: left;
    }

    .legend{
      text-transform: uppercase;
      color: #8b0000;
      fill:#8b0000;
      stroke:#8b0000;
      font-size: 16px;
      stroke-width:1px;
      text-align: left;

    }



      </style>

      <body>

      <script src="http://d3js.org/d3.v3.min.js"></script>
      <!-- <script src="https://d3js.org/d3.v5.min.js"></script> -->
      <script src="https://d3js.org/d3-axis.v1.min.js"></script>
      <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.js"></script>

      <script>
      var data = `;



// VAR 2

      var s2x = `;

//************* TO HANDLE HUMAN ERROR ************ (fault tolerance)
//FORGOT TO TILT THE SENSOR BACK AFTER I WOKE UP //FORGOT TO TILT AT ALL
// If count >200 minutes, resets its value to avgverage of the rest

      var sum=0; var counter=0;

      // get sum and count of the rest
      for(i=0;i<data.length;i++){ if(data[i].count<200){ sum= sum + Number(data[i].count); counter+=1; }}

      // compute average
      var avg= sum/counter;

      // assign to count if count > 200 minutes
      for(i=0;i<data.length;i++){ if(data[i].count>200 || data[i].count<5){ data[i].count=avg.toFixed(2); }}



//***************** SEPARATE MONTHS 11 and 12 ***********************

var countNov=[]; var countDec=[];

    for(i=0;i<data.length;i++){

       if( data[i].sensormonth == 11){
         countNov.push(new monthh(data[i].count, data[i].sensorday));
       }else{
         countDec.push(new monthh(data[i].count, data[i].sensorday));
       }
    }


   // OBJECT
   function monthh(count, day) {
      this.count = count;
      this.sensorday = day;
   }

// **************** CHART SETUP ***************************

// DIV FOR TOOLTIP
 var div = d3.select("body").append("div").attr("id", "tooltip").style('visibility','hidden');

// SET MARGINS
var margin = {top: 40, right: 40, bottom: 20, left: 40},

// WIDTH AND HEIGHT
width = window.innerWidth/2+100 - margin.left - margin.right,
height = window.innerHeight/2-100 - margin.top - margin.bottom;

// FOR TICK FORMAT
var formatPercent = d3.format(".0f");

// SCALES - ORDINAL (MEASUREMENT LEVEL OF VARIABLE)
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var x2 = d3.scale.ordinal().rangeRoundBands([0, width], .1);

// SCALES - LINEAR
var y = d3.scale.linear().range([height, 0]);
var y2 = d3.scale.linear().range([height, 0]);

// AXES
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(formatPercent);

var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
var yAxis2 = d3.svg.axis().scale(y2).orient("left").tickFormat(formatPercent);

    // SVG
    var svg = d3.select("body").append("svg").attr("width", window.innerWidth).attr("height", 2*window.innerHeight);

    // LABELS
    svg.append('text').attr('class','label2').attr('x',50).attr('y',40).text('wake up time')
    svg.append('text').attr('class','label').attr('x',260).attr('y',220).text("DEC\'18").attr('opacity', 0.1)
    svg.append('text').attr('class','label').attr('x',260).attr('y',570).text("NOV\'18").attr('opacity', 0.1)

    var chart1 = svg.append("g").attr('class','chart').attr("transform", "translate(" + (margin.left+15) + "," + (margin.top+100)+ ")");
    var chart2 = svg.append("g").attr('class','chart').attr("transform", "translate(" + (margin.left+15) + "," + (margin.top+450)+ ")");

    //******* mycode ************

    var idealSleep = svg.append('circle').attr('id','idealSleep').attr("cx", '76%').attr("cy", '23%')
                        .attr("r", 420/2).style("fill", '#bb4974').style('opacity',0.7)

    var wakeSleep = svg.append('circle').attr('id','wakeSleep').attr("cx", '76%').attr("cy", '23%')
                        .attr("r", (countDec[countDec.length-1].count)/2).style("fill", '#ea7b62').style('opacity',1)

    svg.append('text').attr('class','legend').attr('x', '71%').attr('y','40%').text( ' ' + countDec[countDec.length-1].sensorday + ' DEC: ' + countDec[countDec.length-1].count +' minutes' ).attr('opacity', 0.8)




// *************** DEC CHART ********************************

   // MAP VALUES TO X AND Y
      x.domain(countDec.map(function(d) {return d.sensorday; }));
      y.domain([0, 200]);

      x2.domain(countNov.map(function(d) {return d.sensorday; }));
      // y2.domain([0, d3.max(countNov, function(d) { return d.count; })]);
      y2.domain([0, 200]);

    // X, Y AXIS & LABEL
    chart1.append("g").attr("class", "xaxis").attr("transform", "translate(0," + height + ")").call(xAxis);
    chart1.append("g").attr("class", "yaxis").call(customYAxis)
          .append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("minutes");

    // X, Y AXIS
    chart2.append("g").attr("class", "xaxis").attr("transform", "translate(0," + height + ")").call(xAxis2);
    chart2.append("g").attr("class", "yaxis").call(customYAxis2)
          .append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("minutes");

      // ROUNDS
      var rounds = chart1.selectAll(".bar").data(countDec).enter().append("circle").attr("class", "bar")
                     .attr("cx", function(d) { return x(d.sensorday)+20; }).attr("cy", function(d) { return y(d.count); })
                     .attr('r', function(d) { return d.count/4; }).attr('fill', '#d75b68')
                     .attr('opacity', 0.8).on("mouseover", function(d) {

                            // TOOLTIP : VISIBLE
                            document.getElementById("tooltip").style.visibility='visible';

                            // TOOLTIP : TRANSTITION, OPACITY
                            div.transition().duration(200).style("opacity", 1);

                            // TOOLTIP : CONTENT
                            div.html('day: ' +d.sensorday + '<br>mins: ' + d.count).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
                      })
                      .on("mouseout", function(d) {
                            div.transition().duration(500).attr('fill','black').style("opacity", 0);
                      });


      // ROUNDS
      var rounds2 = chart2.selectAll(".bar").data(countNov).enter().append("circle").attr("class", "bar")
                     .attr("cx", function(d) { return x2(d.sensorday)+40; }).attr("cy", function(d) { return y2(d.count); })
                     .attr('r', function(d) { return d.count/4; }).attr('fill', '#d75b68')
                     .attr('opacity', 0.8).on("mouseover", function(d) {

                            // TOOLTIP : VISIBLE
                            document.getElementById("tooltip").style.visibility='visible';

                            // TOOLTIP : TRANSTITION, OPACITY
                            div.transition().duration(200).style("opacity", 1);

                            // TOOLTIP : CONTENT
                            div.html('day: ' +d.sensorday + '<br>minutes: ' + d.count)
                            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
                      })
                      .on("mouseout", function(d) {
                            div.transition().duration(500).attr('fill','black').style("opacity", 0);
                      });


      // CUSTOM Y AXIS

      function customYAxis(g) {
          g.call(yAxis);
          g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "1,1");
          g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
      }

      function customYAxis2(g) {
          g.call(yAxis2);
          g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "1,1");
          g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
      }



      </script>`;




//----------------------------------- VIZ PAGE --------------------------------------------------------

// ******** AA : VERSION1 VIZ *****************

// respond to requests for /aameetings
app.get('/aav1', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York");
    var dayy = now.day().toString();
    var hourr = now.hour().toString();

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // // SQL query
    // var thisQuery = `SELECT newAddress, title as location, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'latitude', lat, 'longitude', long, 'type', meetingtype, 'details', details )) as meetings
    //              FROM aalocations1
    //              WHERE day = 'Saturdays' OR day = 'Sundays'
    //              GROUP BY newAddress, title
    //              ;`;

    // SQL query
    // var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
    //              FROM aalocations1
    //              WHERE day = 'Saturdays' OR day = 'Sundays'
    //              GROUP BY newAddress, title, lat, long
    //              ;`;

    var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
                      FROM aalocations1 WHERE day='Saturdays' OR day='Sundays'
                      GROUP BY newAddress, title, lat, long`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});


// ******** AA : VERSION1 VIZ *****************

// respond to requests for /aameetings
app.get('/aav2', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York");
    var dayy = now.day().toString();
    var hourr = now.hour().toString();

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // // SQL query
    // var thisQuery = `SELECT newAddress, title as location, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'latitude', lat, 'longitude', long, 'type', meetingtype, 'details', details )) as meetings
    //              FROM aalocations1
    //              WHERE day = 'Saturdays' OR day = 'Sundays'
    //              GROUP BY newAddress, title
    //              ;`;

    // SQL query
    // var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
    //              FROM aalocations1
    //              WHERE day = 'Saturdays' OR day = 'Sundays'
    //              GROUP BY newAddress, title, lat, long
    //              ;`;

    var thisQuery = `SELECT newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details )) as meetings
                      FROM aalocations1 WHERE day='Saturdays' OR day='Sundays'
                      GROUP BY newAddress, title, lat, long`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            var resp = hx1 + JSON.stringify(qres.rows) + jx2;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});


// ******** Diary VIZ *****************

// // respond to requests for /deardiary
app.get('/dd', function(req, res) {

  // // AWS DynamoDB credentials
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.AWS_ID;
  AWS.config.secretAccessKey = process.env.AWS_KEY;
  AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
    var params = {
      TableName: "newdeardiary",
      KeyConditionExpression: '#dt = :date AND #rd = :round', // the query expression
      ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
          "#dt" : 'date',
          "#rd" : 'round'
      },
      ExpressionAttributeValues: { // the query values
          ':date': {S: 'Nov 02 2018'},
          ':round': {N: '1'}
      }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            var diary = d1x + JSON.stringify(data) + d2x;
            res.send(diary);
            console.log('3) responded to request for dear diary data');
        }
    });
});



// ******** SENSOR VIZ *****************

// respond to requests for /sensor
app.get('/ss', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // // SQL query
    // var q = `SELECT sensorValue, COUNT(sensorValue), EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth,  EXTRACT(HOUR FROM sensorTime) as sensorhr
    //                   FROM sensorData1
    //                   GROUP BY sensorValue, sensorday, sensormonth, sensorhr;`;

    // var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
    //                   FROM sensorData1 WHERE sensorvalue='true'
    //                   GROUP BY sensorValue, sensorday, sensormonth;`;

   //  // SQL query
   // var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
   //                   FROM sensorData1 WHERE sensorvalue='true' AND EXTRACT(MONTH FROM sensorTime)=11
   //                   GROUP BY sensorValue, sensorday, sensormonth
   //                   ORDER BY sensorday;`;

   // SQL query
  var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                    FROM sensorData1 WHERE sensorvalue='true'
                    GROUP BY sensorValue, sensorday, sensormonth
                    ORDER BY sensorday, sensormonth DESC;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x;
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});




// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
