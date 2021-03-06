// start slingin' some d3 here.
var svgHeight = 500;
var svgWidth = 960;
var n = 20;
var r = 15;
var timeDelay = 2000;
var highScore = 0;
var currScore = 0;
var numCollisions = 0;
var collisionFlag = false;

var body = d3.select('body');

var svgContainer = body.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var defsContainer = svgContainer.append('defs');

var pattern1 = defsContainer.append('pattern')
  .attr('id', 'shuriken')
  //.attr('patternUnits', 'userSOnUse')
  .attr('width', 2 * r)
  .attr('height', 2 * r);
var img1 = pattern1.append('image')
  .attr('xlink:href', 'shuriken1.png')
  .attr('x', '0')
  .attr('y', '0')
  .attr('width', 2 * r)
  .attr('height', 2 * r);

var drag = d3.drag().on('drag', function() {
  var xLimit = svgWidth - r;
  var yLimit = svgHeight - r;
  var newX = (d3.event.x > xLimit) ? xLimit : ((d3.event.x < r) ? r : d3.event.x);
  var newY = (d3.event.y > yLimit) ? yLimit : ((d3.event.y < r) ? r : d3.event.y);

  d3.select(this).attr('cx', newX)
                 .attr('cy', newY); 
});

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

var update = function(n) {
  var positionData = randomPositions(n);

  var circles = svgContainer.selectAll('.enemy')
                            .data(positionData);
  //console.log(circles);
  var nodes = circles.data();
  //Update
  circles.transition().duration(timeDelay).attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; });

  //Enter
  circles.enter()
         .append('circle')
         .attr('class', 'enemy')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', function(d) { return r; });

  //Exit
  circles.exit().remove();
};

var spawnPlayer = function() {
  var player = svgContainer.append('circle');
  player.attr('class', 'player')
        .attr('cx', r)
        .attr('cy', r)
        .attr('r', r)
        .call(drag);
};

var collide = function() {
  var player = svgContainer.selectAll('.player');
  var enemies = svgContainer.selectAll('.enemy');
  var px = player.attr('cx');
  var py = player.attr('cy');
  var collided = false;
  var ex, ey, dx, dy, d2;

  enemies.each(function(enemy, i) {
    ex = d3.select(this).attr('cx');
    ey = d3.select(this).attr('cy');
    dx = ex - px;
    dy = ey - py;
    d2 = dx * dx + dy * dy;
    collided = d2 < 4 * r * r ? true : collided;
  });
  return collided;
};

var scoreManager = function(collided) {
  if (collided) {
    numCollisions = collisionFlag ? numCollisions : numCollisions + 1;
    collisionFlag = true;
  } else {
    collisionFlag = false;
  }
  currScore = collided ? 0 : currScore + 1;
  highScore = currScore > highScore ? currScore : highScore;
  d3.select('.highscore').select('span').text(highScore);
  d3.select('.current').select('span').text(currScore);
  d3.select('.collisions').select('span').text(numCollisions);  
};

spawnPlayer();
update(n);
update(n);
d3.interval(function() {
  update(n);
}, timeDelay);

d3.interval(function() {
  scoreManager(collide());
}, 100);