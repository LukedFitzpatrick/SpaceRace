// * * * * * * * * * * *
// * SpaceRace game.js
// * By Daniel Vassilev
// * 16/05/2013 - v0.1
// * * * * * * * * * * *

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Variables
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var W_KEY = 87;
var A_KEY = 65;
var S_KEY = 83;
var D_KEY = 68;

// Game objects
var player1 = {
    speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var player2 = {
    speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var target = {
    x: 0,
	y: 0
};

var player1Score = 0;
var player2Score = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Player2 image
var player1Ready = false;
var player1Image = new Image();
player1Image.onload = function () {
    player1Ready = true;
};
player1Image.src = "images/player1.png";

// Player2 image
var player2Ready = false;
var player2Image = new Image();
player2Image.onload = function () {
	player2Ready = true;
};
player2Image.src = "images/player2.png";

// Target image
var targetReady = false;
var targetImage = new Image();
targetImage.onload = function () {
    targetReady = true;
};
targetImage.src = "images/target.png";

// Reset the game
var reset = function () {
    // Place player1 randomly on the screen
    player1.x = 32 + (Math.random() * (canvas.width - 64));
	player1.y = 32 + (Math.random() * (canvas.height - 64));
    
	// Place player2 randomly on the screen
	player2.x = 32 + (Math.random() * (canvas.width - 64));
	player2.y = 32 + (Math.random() * (canvas.height - 64));
    
    // Place target randomly on the screen
    target.x = 32 + (Math.random() * (canvas.width - 64));
	target.y = 32 + (Math.random() * (canvas.height - 64));
};

// Reset the target position
var resetTarget = function () {
    // Place target randomly on the screen
    target.x = 32 + (Math.random() * (canvas.width - 64));
	target.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
    if (UP_ARROW in keysDown) { // Player1 holding up
		player1.y -= player1.speed * modifier;
	}
	if (DOWN_ARROW in keysDown) { // Player1 holding down
		player1.y += player1.speed * modifier;
	}
	if (LEFT_ARROW in keysDown) { // Player1 holding left
		player1.x -= player1.speed * modifier;
	}
	if (RIGHT_ARROW in keysDown) { // Player1 holding right
		player1.x += player1.speed * modifier;
	}
    
    if (W_KEY in keysDown) { // Player2 holding up
    	player2.y -= player2.speed * modifier;
	}
	if (S_KEY in keysDown) { // Player2 holding down
		player2.y += player2.speed * modifier;
	}
	if (A_KEY in keysDown) { // Player2 holding left
		player2.x -= player2.speed * modifier;
	}
	if (D_KEY in keysDown) { // Player2 holding right
		player2.x += player2.speed * modifier;
	}

	// Player1 touching target?
	if (
		player1.x <= (target.x + 32)
		&& target.x <= (player1.x + 32)
		&& player1.y <= (target.y + 32)
		&& target.y <= (player1.y + 32)
	) {
		++player1Score;
		resetTarget();
	}
    
    // Player2 touching target?
    if (
        player2.x <= (target.x + 32)
    	&& target.x <= (player2.x + 32)
		&& player2.y <= (target.y + 32)
		&& target.y <= (player2.y + 32)
    ) {
        ++player2Score;
        resetTarget();
    }
    
};

// Draw everything
var render = function () {
    if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (player1Ready) {
		ctx.drawImage(player1Image, player1.x, player1.y);
	}

	if (player2Ready) {
		ctx.drawImage(player2Image, player2.x, player2.y);
	}
    
    if (targetReady) {
        ctx.drawImage(targetImage, target.x, target.y)
    }

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Player 1: " + player1Score + " - Player 2: " + player2Score, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible