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
                      FROM aalocations1
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

     // SQL query
    var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                      FROM sensorData1 WHERE sensorvalue='true'
                      GROUP BY sensorValue, sensorday, sensormonth;`;

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
// ******** AA HTML ********************

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

          <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js'></script>
          <script src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js'></script>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

          <style>

            #mapid{
              height: 500px;
            }

            #mapid .leaflet-pane.leaflet-tile-pane {
              // filter: saturate(20%) blur(2px);
              filter: saturate(50%);
            }
          </style>
        </head>

        <body>
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
                    // accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
                }).addTo(mymap);



            for (var i=0; i<data.length; i++) {
                  console.log(JSON.stringify(data[i].meetings));
                }

                // CIRCLE FOR EACH EARTHQUAKE
          for(var i = 0; i < data.length; i++){
            var circle = L.circle([data[i].latitude, data[i].longitude], {
              color: 'transparent',      // the dot stroke color
              fillColor: '#FF2459', // the dot fill color
              fillOpacity: 0.6,  // use some transparency so we can see overlaps
              radius: 40
              // info: table.getRow(i)
            }).addTo(mymap);

            // Tooltip
            var popupText = 'Latitude: '+ data[i].latitude + '<br> Longitude: '+ data[i].longitude + '<br> Address : <br>'+ data[i].location +'<br>'+ data[i].newaddress;

            for(var j = 0; j < data[i].meetings.length; j++) {
              var singleMeeting = data[i].meetings[j];
              popupText += '<br><br>';
              popupText += singleMeeting.day + '<br>';
              popupText += singleMeeting.st + '<br>';
              popupText += singleMeeting.et + '<br>';
            }

            // newAddress, title as location, lat as latitude, long as longitude, json_agg(json_build_object('day', day, 'st', starttime, 'et', endtime, 'type', meetingtype, 'details', details

            // var popupText = JSON.stringify(data[i].meetings);
            circle.bindPopup(popupText);
          }

            console.log(data[0].latitude);
            console.log(data[0].latitude);
            console.log(data[0].meetings);

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
                  }

                  .title{
                    color: #123456;
                    font-size: 14px;
                    font-family: Lato, Helvetica Nueu, arial, sans serif;
                    font-style: normal;
                    font-weight: bold;
                    text-transform: uppercase;

                  }

                  .title1{
                    color: #123456;
                    font-size: 14px;
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
                    stroke: red;
                    strokeWeight: 400;
                  }

                  image.person{
                    position: absolute;
                    z-index: 1;
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

            svg.append('text').attr('x',200).attr('y',80).attr('class','title').text('dear diary,')
            svg.append('text').attr('x',300).attr('y',80).attr('class','title').text('"'+data.Items[0].date.S+'"').attr('fill','red')

            svg.append('text').attr('x',200).attr('y',110).attr('class','title1').text('Game :')
            svg.append('text').attr('x',280).attr('y',110).attr('class','title1').text(data.Items[0].round.N).attr('fill','red')

            var x = 115; var y=160;

            svg.append('text').attr('x',x).attr('y',y).attr('class','label').text('hold')
            svg.append('text').attr('x',x+80).attr('y',y).attr('class','label').text(data.Items[0].cardHold.SS[0] +'     '+data.Items[0].cardHold.SS[1]).attr('fill','red')

            svg.append('text').attr('x',x+5).attr('y',y+50).attr('class','label').text('flop')
            svg.append('text').attr('x',x+80).attr('y',y+50).attr('class','label').text(data.Items[0].cardFlop.SS[0] +'     '+data.Items[0].cardFlop.SS[1]).attr('fill','red' +'     '+data.Items[0].cardFlop.SS[2]).attr('fill','red')

            svg.append('text').attr('x',x+5).attr('y',y+100).attr('class','label').text('turn')
            svg.append('text').attr('x',x+80).attr('y',y+100).attr('class','label').text(data.Items[0].cardTurn.S).attr('fill','red')

            svg.append('text').attr('x',x+5).attr('y',y+150).attr('class','label').text('river')
            svg.append('text').attr('x',x+80).attr('y',y+150).attr('class','label').text(data.Items[0].cardRiver.S).attr('fill','red')

            svg.append('text').attr('x',x-10).attr('y',y+200).attr('class','label').text('result')
            svg.append('text').attr('x',x+85).attr('y',y+200).attr('class','label').text(data.Items[0].result.S).attr('fill','red')


            y=340;

            svg.append('text').attr('x',200).attr('y',y+80).attr('class','title1').text('no. of people i talked to')
            // svg.append('rect').attr('x',200).attr('y',y+100).attr('class','rectPeople').attr('width', 1000).attr('height',20).attr('fill','transparent')
            // svg.append('rect').attr('x',200).attr('y',y+100).attr('class','rectPeople').attr('width', data.Items[0].people.N*100).attr('height',20).attr('fill','red')

           for(i=0;i<data.Items[0].people.N;i++){
             svg.append('rect').attr('x',200+i*30).attr('y',y+100).attr('class','rectPeople').attr('width', 20).attr('height',20).attr('fill','red')
             // svg.append('svg:image').attr('class','person').attr('xlink:href', 'heartp.png').attr('x', 200+i*30).attr('y', y+100).attr('width',15).attr('height',30)

           }

            svg.append('text').attr('x',200).attr('y',y+150).attr('class','title1').text('Amount of water I consumed')
            svg.append('rect').attr('x',200).attr('y',y+170).attr('class','rectPeople').attr('width', 500).attr('height',20).attr('fill','transparent')
            svg.append('rect').attr('x',200).attr('y',y+170).attr('class','rectPeople').attr('width', parseFloat(data.Items[0].water.S)*100).attr('height',20).attr('fill','red')

            // for(i=0;i<data.Items[0].people.N;i++){
            //       svg.append('rect').attr('x',200+i*30).attr('y',y+220).attr('class','rectPeople').attr('width', 20).attr('height',20).attr('fill','red')
            // }


            var x = 130; y=400;

            // svg.append('text').attr('x',x).attr('y',y).attr('class','label').text('won')
            // svg.append('text').attr('x',x+5).attr('y',y+70).attr('class','label').text('lost')



              console.log(data);
              console.log(data.Items[0].result.S);
              console.log(data.Items[0].people.N);
              console.log((data.Items[0].water.S).split('l'));
              console.log(parseFloat(data.Items[0].water.S));
              console.log(data.Items[0].date.S);




// won - #f9d128  //lost - #04bca1 // folded - #c4c2c2

      svg.selectAll('p').data(data).enter().append('rect')
             .attr('x', (d, i)=> {return (5+i*10);})
             .attr('y', 200)
             .attr('width',10)
             .attr('height',10)
             .attr('fill', '#f9d128')


// rect(20,20,20,20,20);

        </script>`;


// ******** SENSOR HTML *****************
// VAR 1

      var s1x = `<!DOCTYPE html>
      <meta charset="utf-8">
      <!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->

      <style>

    body {
      font: 10px Helvetica, arial, sans-serif;
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
      // fill: orange;
      color: orchid;
    }

    .bar:hover {
      fill: salmon ;
    }


    // .x.axis path {
    //   display: none;
    //
    // }

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

    div.tooltip {
        position: absolute;
        text-align: center;
        width: 60px;
        height: 28px;
        padding: 2px;
        font: 12px sans-serif;
        background: lightsteelblue;
        border: 0px;
        border-radius: 8px;
        pointer-events: none;
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


    // DIV FOR TOOLTIP
     var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);


    // SET MARGINS
    var margin = {top: 40, right: 20, bottom: 30, left: 40},

    // WIDTH AND HEIGHT OF FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // FOR TICK FORMAT
    var formatPercent = d3.format(".0f");

    // SCALES - ORDINAL (MEASUREMENT LEVEL OF VARIABLE)
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    // SCALES - LINEAR
    var y = d3.scale.linear().range([height, 0]);

    // AXES
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(formatPercent);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        // return "<strong> minutes:</strong> <span style='color:skyblue'>" + formatPercent(d.count) + "</span>";
        return "<strong style='color:lightseagreen'> WakeUpTime:</strong> <span style='color:darkcyan'>" + formatPercent(d.count) + "</span>";
      })

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // TIP
    svg.call(tip);
      x.domain(data.map(function(d) { return d.sensorday; }));
      y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // X AXIS
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    // Y AXIS
    svg.append("g")
          .attr("class", "yaxis")
          .call(customYAxis)

    // LABEL
    .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end") //note
          .text("minutes");

            // // BARS
            // svg.selectAll(".bar")
            //       .data(data)
            //       .enter().append("rect")
            //       .attr("class", "bar")
            //       .attr("x", function(d) { return x(d.sensorday)+ x.rangeBand()/3; })
            //       .attr("width", x.rangeBand()/2)
            //       .attr("y", function(d) { return y(d.count); })
            //       .attr("height", function(d) { return height - y(d.count); })
            //       .on('mouseover', tip.show)
            //       .on('mouseout', tip.hide)


      // ROUNDS
      var rounds = svg.selectAll(".bar")
                     .data(data)
                     .enter().append("circle")
                     .attr("class", "bar")
                     .attr("cx", function(d) { return x(d.sensorday); })
                     // .attr("width", x.rangeBand())
                     .attr("cy", function(d) { return y(d.count); })
                     // .attr("height", function(d) { return height - y(d.count); })
                     // .attr('r', '20px')
                     .attr('r', function(d) { return d.count/2; })
                     .attr('fill', 'orchid')
                     .attr('opacity', 0.6)
                     // .on('mouseover', tip.show)
                     // .on('mouseout', tip.hide)
                     .on("mouseover", function(d) {
                            div.transition()
                                .duration(200)
                                .style("opacity", .9);
                            div.html(d.count)
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                                // .style('left', '100px')
                                // .style('top','100px');
                      })
                      .on("mouseout", function(d) {
                            div.transition()
                               .duration(500)
                               .style("opacity", 0);
                      });


      function customYAxis(g) {
          g.call(yAxis);
          g.select(".domain").attr('fill', 'salmon').attr('stroke-width', 25)
          g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "1,1");
          g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
      }



      //******* mycode ************


      // var calendar = svg.selectAll(".bar").data(data).enter().append("rect")
      //                   .attr('x', (d, i)=> {return (20+i*15);})
      //                   .attr('y', (d)=> {if(d.sensorValue==true){return 40;}else if(d.sensormonth ==11){return 60;}})
      //                   .attr('width', 10).attr('height',10)
      //                   .attr('fill','red')
      //                   .attr('opacity',(d,i)=>{return d.sensorValue/10})
      //
      // var idealSleep = svg.append('circle').attr('id','idealSleep')
      //                     .attr("cx", '50%')
      //                     .attr("cy", '30%')
      //                     .attr("r", 420/4)
      //                     .style("fill", '#092c56')
      //
      // var wakeSleep = svg.append('circle').attr('id','wakeSleep')
      //                     .attr("cx", '50%')
      //                     .attr("cy", '30%')
      //                     .attr("r", 20/4)
      //                     .style("fill", '#092c56')
      //
      //
      // var Sleep = svg.selectAll('circle').data(data).enter().append('circle').attr("class", "sleep")
      //                     .attr("cx", (d, i)=> {return (20+i*100);})
      //                     .attr("cy", '30%')
      //                     .attr("r", (d,i)=> {if(d.sensorValue== true)return(d.count/10);})
      //                     .style("fill", '#transparent')
      //                     .style('stroke','#b1db19');


      console.log(data);

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      console.log(today);console.log(dd);console.log(mm);console.log(yyyy);
      console.log(data[1].sensorday);

      var wakeTime;


        for(i=0;i<data.length;i++){
          if(data[i].sensorday === dd && data[i].sensormonth === mm && data[i].sensorValue === true){

            wakeTime = data[i].count;

          }
        }

      //console.log(wakeTime);


      </script>`;




//----------------------------------- VIZ PAGE --------------------------------------------------------

// ******** AA VIZ *****************

// respond to requests for /aameetings
app.get('/aa', function(req, res) {

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
                     FROM aalocations1
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

    var q = `SELECT sensorValue, COUNT(sensorValue) as count, EXTRACT(DAY FROM sensorTime) as sensorday, EXTRACT(MONTH FROM sensorTime) as sensormonth
                      FROM sensorData1 WHERE sensorvalue='true'
                      GROUP BY sensorValue, sensorday, sensormonth;`;

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
