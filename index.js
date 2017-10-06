// Creates a var which holds properties for the different margin values
var margin = {top: 10, right: 10, bottom: 100, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Creates the x axis
var x = d3.scale.linear()
    .range([0, width]);

// Creates the y axis
var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.tickSize(-height);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

var svg = d3.select("svg") //Connect the svg element to the svg variable
    .attr("width", width + margin.left + margin.right) // Calc the width by subtracting the margins
    .attr("height", height + margin.top + margin.bottom) // Calc the height by subtracting the margins
  	.append("g") // Add the g elements to the svg
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Change the starting point of the svg

d3.tsv("data.tsv", type, function(error, data) {
	//Uses the data to determine the x & y values
  	x.domain(d3.extent(data, function(d) { return d.speakers; })).nice();
  	y.domain(data.map(function(d) { return d.language; }));

	svg.selectAll(".bar") // Select all the .bar elements
    	.data(data)
    	.enter().append("rect")
		.attr("fill", "url(#gradient)") //Uses the gradient defined below
      	.attr("class", "bar")
      	.attr("x", function(d) { return x(Math.min(0, d.speakers)); })
      	.attr("y", function(d) { return y(d.language); })
		.attr("height", y.rangeBand())
		.attr("width", 0) // Start with a width of 0 so it will be animated
		.attr("rx", "10") // Rounded corners
		.attr("ry", "10"); // Rounded corners

  	svg.append("g") //Add a g element to the svg
  		.attr("class", "x axis") // Add a class to the g element
      	.attr("transform", "translate(0," + height + ")") // Give it the height of the svg (var height)
      	.call(xAxis)
		// Select the text on the x axis and rotates -35 degrees
		.selectAll("text")
            .style("text-anchor", "end") //Change the allignment to the right
            .attr("y", "10px")
            .attr("transform", function(d) {
                return "rotate(-35)";
                });

  	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + x(0) + ",0)")
		.call(yAxis);

	// ====================ANIMATION====================

	console.log(svg.selectAll(".bar").size());

	//Getting the total amount of bars and adding 1 so the last bar will also be shown
	var totalLanguages = svg.selectAll(".bar").size() + 1;

	var index = 1;
	function animateBar () {
		setTimeout(function () { //Adds a 0.2s delay inbetween the functions calls

		svg.select(".bar:nth-child("+index+")")
			.transition()
			.attr("width", function(d) { return Math.abs(x(d.speakers) - x(0)); });

		index++;                     //  increment the counter

		if (index < totalLanguages) { //If the index in lower than totalLanguages ..
			animateBar();             //  ..  call the function again
		}

	}, 200); //The delay in between each function
	}

	animateBar(); //Start the loop

	// ====================GRADIENT====================

	// Create a defs element with the gradient
	var svgDefs = svg.append('defs');

	var gradient = svgDefs.append('linearGradient')
		.attr('id', 'gradient');

	// Add stops to the gradient for the two colors, one left and one on the right
	gradient.append('stop')
		.attr('class', 'stop-left')
		.attr('offset', '0');

	gradient.append('stop')
		.attr('class', 'stop-right')
		.attr('offset', '1');

});

function type(d) {
  	d.speakers = +d.speakers;
  	return d;
}
