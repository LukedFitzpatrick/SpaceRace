// * * * * * * * * * * *
// * SpaceRace game.js
// * By Daniel Vassilev
// * 16/05/2013 - v0.1
// * * * * * * * * * * *

var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
 
myHeight -= 5;
myWidth -= 5;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = myWidth;
canvas.height = myHeight;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/spacebg.png";

// Player1 image
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
    image: player1Image,
    acceleration: 0.02,
    xSpeed: 0,
    ySpeed: 0,
    score: 0,
	x: 0,
	y: 0
};

var player2 = {
    image: player2Image,
    acceleration: 0.02,
    xSpeed: 0,
    ySpeed: 0,
    score: 0,
	x: 0,
	y: 0
};

var target = {
    x: 0,
	y: 0
};

var ACTION = {
    title: "title",
    game: "game",
    pause: "pause"
}

var status = ACTION.title;

// Button Variables

var playBtnPos = {
        x: 32,
        y: 64,
        width: 50,
        height: 30
    }
    
// END Button Variables

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener('mouseup', function (e){
    var mousePos = getMousePos(canvas, e);

    if (mouseReleased(mousePos, playBtnPos)) {
        status = ACTION.game;
    }
}, false);

function mouseReleased(mousePos, buttonPos) {
    if ((mousePos.x >= buttonPos.x && mousePos.x <= buttonPos.x + buttonPos.width) 
    && (mousePos.y >= buttonPos.y && mousePos.y <= buttonPos.y + buttonPos.height)) {
        return true;
    } else {
        return false;
    }
}

// Reset the game
var reset = function () {
    // Place player1 randomly on the screen
    placeObject(player1);
    
	// Place player2 randomly on the screen
    placeObject(player2);
    
    // Place target randomly on the screen
    placeObject(target);
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
        if (player1.ySpeed > 0) {
            player1.ySpeed = 0;
        } else {
            player1.ySpeed -= player1.acceleration;
        }
	}
	if (DOWN_ARROW in keysDown) { // Player1 holding down
        if (player1.ySpeed < 0) {
            player1.ySpeed = 0;
        } else {
            player1.ySpeed += player1.acceleration;
        }
	}
	if (LEFT_ARROW in keysDown) { // Player1 holding left
        if (player1.xSpeed > 0) {
            player1.xSpeed = 0;
        } else {
            player1.xSpeed -= player1.acceleration;
        }
	}
	if (RIGHT_ARROW in keysDown) { // Player1 holding right
        if (player1.xSpeed < 0) {
            player1.xSpeed = 0;
        } else {
            player1.xSpeed += player1.acceleration;
        }
	}
    
    if (W_KEY in keysDown) { // Player2 holding up
        if (player2.ySpeed > 0) {
            player2.ySpeed = 0;
        } else {
            player2.ySpeed -= player2.acceleration;
        }
	}
	if (S_KEY in keysDown) { // Player2 holding down
        if (player2.ySpeed < 0) {
            player2.ySpeed = 0;
        } else {
            player2.ySpeed += player2.acceleration;
        }
	}
	if (A_KEY in keysDown) { // Player2 holding left
        if (player2.xSpeed > 0) {
            player2.xSpeed = 0;
        } else {
            player2.xSpeed -= player2.acceleration;
        }
	}
	if (D_KEY in keysDown) { // Player2 holding right
        if (player2.xSpeed < 0) {
            player2.xSpeed = 0;
        } else {
            player2.xSpeed += player2.acceleration;
        }
	}
    
    //Apply the speed to the coordinates
    player1.y += player1.ySpeed;
    player1.x += player1.xSpeed;
    
    player2.y += player2.ySpeed;
    player2.x += player2.xSpeed;

	// Player1 touching target?
	targetCollision(player1);
    
    // Player2 touching target?
    targetCollision(player2);
    
    // Player1 touching walls?
    horizontalWallCollision(player1);
    verticalWallCollision(player1);
    
    // Player2 touching  walls?
    horizontalWallCollision(player2);
    verticalWallCollision(player2);
};

function targetCollision (player) {
    if (
        player.x <= (target.x + 32)
        && target.x <= (player.x + 32)
		&& player.y <= (target.y + 32)
		&& target.y <= (player.y + 32)
    ) {
        ++player.score;
        resetTarget();
    }
}

// Checks to see if there is a collision with vertical wall
// if there is, it changes player direction
function verticalWallCollision (player) {
    if (player.x < 0) {
        player.x = 0;
        player.xSpeed = -player.xSpeed;
    } else if (player.x > (canvas.width - player.image.width)) {
        player.x = (canvas.width - player.image.width);
        player.xSpeed = -player.xSpeed;
    }
}

// Checks to see if there is a collision with horiztonal wall
// if there is, it changes player direction
function horizontalWallCollision (player) {
    if (player.y < 0) {
        player.y = 0;
        player.ySpeed = -player.ySpeed;
    } else if (player.y > (canvas.height - player.image.height)) {
        player.y = (canvas.height - player.image.height);
        player.ySpeed = -player.ySpeed;
    }
}

// Place object randomly on the screen
function placeObject (object) {
    object.x = 32 + (Math.random() * (canvas.width - 64));
    object.y = 32 + (Math.random() * (canvas.height - 64));
    
}

// Get position of mouse
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

// Draw everything
var render = function () {
    if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
    
    if (status == ACTION.game) {
        // Game
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
    	ctx.font = "20px Helvetica";
    	ctx.textAlign = "left";
    	ctx.textBaseline = "top";
    	ctx.fillText("Player 1: " + player1.score + " - Player 2: " + player2.score, 32, 32);
    } else if (status == ACTION.title) {
        // Title
        ctx.fillStyle = "rgb(250, 250, 250)";
    	ctx.font = "20px Helvetica";
    	ctx.textAlign = "left";
    	ctx.textBaseline = "top";
    	ctx.fillText("Space Race", 32, 32);
        
        ctx.beginPath();
        ctx.rect(playBtnPos.x, playBtnPos.y, playBtnPos.width, playBtnPos.height);
        ctx.fillStyle = 'yellow';
        //ctx.fill();
        ctx.lineWidth = 7;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillText("PLAY", 35, 67);
        
        
    }
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
var snd = new Audio("audio/title.mp3"); // buffers automatically when created
snd.play();