var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Percentage:</strong> <span style='color:red'>" + formatPercent(d.num_obs) + "</span>";
  });


  ////

  //.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

x.domain(data.map(function(d) { return d.sensorday; }));

y.domain([0, d3.max(data, function(d) { return d.num_obs; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Percentage");

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.sensorday); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.num_obs); })
    .attr("height", function(d) { return height - y(d.num_obs); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)





    ////

    // var calendar = svg.selectAll(".bar").data(data).enter().append("rect")
    //                   .attr('x', (d, i)=> {return (20+i*15);})
    //                   .attr('y', (d)=> {if(d.sensormonth == 11){return 40;}else if(d.sensormonth ==11){return 60;}})
    //                   .attr('width', 10).attr('height',10)
    //                   .attr('fill','red')
    //                   .attr('opacity',(d,i)=>{return d.sensorValue/10})
