// start slingin' some d3 here.

var body = d3.select('body');

var svgHeight = 500;
var svgWidth = 960;

var svgContainer = body.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);



var r = 20;

var randomPositions = function(n) {
  var positions = [];
  var x, y;

  for (var i = 0; i < n; i++) {
    x = r + Math.random() * (svgWidth - 2 * r);
    y = r + Math.random() * (svgHeight - 2 * r);
    positions.push({x: x,
                    y: y});
  }

  return positions;
};



var positionData = randomPositions(20);

var circles = svgContainer.selectAll('circle')
                          .data(positionData);

//Update
circles.attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; });

//Enter
circles.enter()
       .append('circle')
       .attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; })
       .attr('r', function(d) { return r; });

//Exit
circles.exit().remove();