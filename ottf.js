levels = [
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 2, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 3, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 1, 4, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
];

// Number of horizontal and vertical cells, respectively
var NX = 9;
var NY = 5;

var playground = document.getElementById('playground');
var template = document.getElementById('template');
var levelLabel = document.getElementById('level_label');
var timeLabel = document.getElementById('time_label');
var restartButton = document.getElementById('restart_button');
var pointsLabel = document.getElementById('points_label');

// cells[] is the set of <td>'s which make up the playground
// values are the numbers contained on those cells
var cells = [];
var values = [];

// seconds resets at the start of every level
// levelTime is the thread that controls the time label
var currentLevel = 0;
var seconds = 0;
var levelTime;

function initLevel(level) {
	currentLevel = level;
	levelLabel.innerHTML = 'Level ' + (level+1).toString();
	// update the time label
	seconds = 0;
	timeLabel.innerHTML = seconds + ' s';
	if (level > 0) {
		clearInterval(levelTime);
	}
	levelTime = setInterval(function() {
		seconds++;
		timeLabel.innerHTML = seconds + ' s';
	}, 1000);
}

// Sets values[i][j] = 0 for all i, j
function initValues() {
	values = [];
	for (var i=0; i<NY; i++) {
		var row = [];
		for (var j=0; j<NX; j++) {
			row.push(0);
		}
		values.push(row);
	}
}

// Sets all cells to have the empty image
function initCells() {
	for (var i=0; i<NY; i++) {
		for (var j=0; j<NX; j++) {
			cells[i][j].innerHTML = '<img src="images/i0.png" />';
			template.children[i].children[j].innerHTML = levels[currentLevel][i][j]==0?' ':levels[currentLevel][i][j].toString();
		}
	}
}

// Increases appropriately the neighbors to the [i, j] cell
function updateNeighbors(i, j) {
	if (i>0) {
		if (values[i-1][j] > 0) {
			values[i-1][j] += values[i-1][j]==4?-3:1;
			var imRoute = 'images/i' + values[i-1][j].toString() + '.png';
			cells[i-1][j].innerHTML = '<img src="' + imRoute + '" />';
		}
	}
	if (j>0) {
		if (values[i][j-1] > 0) {
			values[i][j-1] += values[i][j-1]==4?-3:1;
			var imRoute = 'images/i' + values[i][j-1].toString() + '.png';
			cells[i][j-1].innerHTML = '<img src="' + imRoute + '" />';
		}
	}
	if (i<NY-1) {
		if (values[i+1][j] > 0) {
			values[i+1][j] += values[i+1][j]==4?-3:1;
			var imRoute = 'images/i' + values[i+1][j].toString() + '.png';
			cells[i+1][j].innerHTML = '<img src="' + imRoute + '" />';
		}
	}
	if (j<NX-1) {
		if (values[i][j+1] > 0) {
			values[i][j+1] += values[i][j+1]==4?-3:1;
			var imRoute = 'images/i' + values[i][j+1].toString() + '.png';
			cells[i][j+1].innerHTML = '<img src="' + imRoute + '" />';
		}
	}
}

// Creates a new td with attributes containing its row and column
function createCell(i, j) {
	newCell = document.createElement('td');
	newCell.setAttribute('row', i.toString());
	newCell.setAttribute('col', j.toString());
	newCell.setAttribute('class', 'pg-cell');
	return newCell;
}

// Initializes the values and cells matrices
function initTables() {
	for (var i=0; i<NY; i++) {
		// Create a new table row both for template and playground
		var newRow = [];
		var newTr = document.createElement('tr');
		var newTmpTr = document.createElement('tr');
		
		for (var j=0; j<NX; j++) {
			//add cell to the playground
			var newCell = createCell(i, j);
			newRow.push(newCell);
			newTr.appendChild(newCell);
			
			// add cell to the template
			var newTmpCell = document.createElement('td');
			newTmpCell.setAttribute('class', 'tmp-cell');
			newTmpTr.appendChild(newTmpCell);
		}
		// Add the new rows to the playground and the template
		cells.push(newRow);
		playground.appendChild(newTr);
		template.appendChild(newTmpTr);
	}
}

// Returns true if the current level is complete, and false otherwise
function levelCompleted() {
	completed = true;
	for (var i=0; i<NY; i++) {
		for (var j=0; j<NX; j++) {
			if (values[i][j] != levels[currentLevel][i][j]) {
				completed = false;
			}
		}
	}
	return completed;
}

/* Increases the total points
If a level is solved in x seconds then
2000/(x+1) + 300 points are awarded
Rounding is done if necessary
*/
function increasePoints() {
	var points = parseInt(pointsLabel.innerHTML);
	newPoints = 20 / (seconds + 1) + 3;
	newPoints = Math.round(newPoints);
	newPoints *= 100;
	points += newPoints;
	pointsLabel.innerHTML = points;
}

// Checks if the current values coincide with the level's solution
function checkCompletion() {
	if (levelCompleted()) {
		increasePoints();
		initLevel(currentLevel + 1);
		initValues();
		initCells();
	}
}

// Adds the necessary event listeners
function addListeners() {
	for (var i=0; i<NY; i++) {
		for (var j=0; j<NX; j++) {
			cells[i][j].addEventListener('mouseenter', function() {
				var tmpCells = document.getElementsByClassName('tmp-cell');
				for (var k=0; k<tmpCells.length; k++) {
					tmpCells[k].style.backgroundColor = '#fffa65';
				}
				x = parseInt(this.getAttribute('col'));
				y = parseInt(this.getAttribute('row'));
				template.children[y].children[x].style.backgroundColor = '#FF5557';
			});
			cells[i][j].addEventListener('click', function() {
				x = parseInt(this.getAttribute('col'));
				y = parseInt(this.getAttribute('row'));
				if (values[y][x] == 0) {
					values[y][x] += values[y][x]==4?-3:1;
					var imgRoute = 'images/i' + values[y][x].toString() + '.png';
					cells[y][x].innerHTML = '<img src="' + imgRoute + '" />';
					updateNeighbors(y, x);
					checkCompletion();
				}
			});
		}
	}
	restartButton.addEventListener('click', function() {
		initValues();
		initCells();
	});
}

initLevel(0);
initValues();
initTables();
initCells();
addListeners();
