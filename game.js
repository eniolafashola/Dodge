let gamePiece;
let gameObstacle = [];
let gameScore;
let paused;
let optionA;
let optionB;
let optionC;
let pointTotal;
let highScore;
let localStore;
let info;
let up = document.getElementById("up");
let down = document.getElementById("down");
let left = document.getElementById("left");
let right = document.getElementById("right");
let center = document.getElementById("center");


if(typeof(Storage)!=="undefined"){
	 if(localStorage.points) {
         localStore = JSON.parse(localStorage.getItem("points") );
         
       } else {
        localStore = 0;
     	
     };
     if(localStorage.score) {
     	highScore = JSON.parse(localStorage.getItem("score") );
     } else {
     	highScore = 0;
     };
   }else {
        alert("localStorage not available, change browser to make game accessible game offline");
 };

startGame = function() {
	gamePiece = new component(95, 30, "airship.png", 10, 120, "image");
	gameScore = new component("20px", "Consolas", "black", 210, 100, "text");
	info = new component("30px", "Consolas", "pink", 20, 80, "text");
    points = new component("20px", "Consolas", "white", 70, 28, "text");
    score = new component("20px", "Consolas", "white", 270, 28, "text");
    paused = new component(105, 70, "play.png", 180, 90, "image");
    optionA = new component("35px", "Cursive", "black", 133, 152, "text");
    optionB = new component("35px", "Cursive", "black", 173, 200, "text");
    optionC = new component("35px", "Cursive", "black", 193, 248, "text");
    gameField.loadIndex();
}




startControl = function() {
    moveUp = function() {
	  gamePiece.speedY = -1.2;
    };

    moveDown = function() {
	  gamePiece.speedY = 1.2;
    };

    moveLeft = function() {
	  gamePiece.speedX = -1;
    };

    moveRight = function() {
	  gamePiece.speedX = 1;
    };

    speedUp = function() {
  	  this.runInterval =
	       setInterval(run, 100);
	  this.interval =
		   setInterval(updateField, 0);
    };

    clearMove = function() {
	  gamePiece.speedX = 0;
	  gamePiece.speedY = 0;
	  clearInterval(this.interval);
	  clearInterval(this.runInterval);
    };
  
    pause = function() {
   	  gameField.stop();
      gameField.stopRun();
      endControl();
      paused.newPos();
      paused.update();
      center.onclick = resume;
    };
  
    resume = function() {
  	  gameField.runInterval =
		  setInterval(run, 2500);
      gameField.interval =
		  setInterval(updateField, 20);
	   startControl();
	   center.onclick = " ";
	   console.clear();
   };
}

endControl = function() {
  	let clear = clearMove();
  	moveUp = clear;
      moveDown = clear;
      moveLeft = clear;
      moveRight = clear;
      speedUp = clear;
};

const gameField = {
	canvas :
	document.createElement("canvas"),
	
	loadIndex : function() {
	  this.canvas.width = 480;
	  this.canvas.height = 270;
	  this.context =
	  this.canvas.getContext("2d");
	  this.frameNo = 0;
	  updateIndex();
	  startClick();
	  document.getElementById("canvas"). appendChild(this.canvas);
     },

	
	start : function() {
		console.clear();
		endClick();
		startControl(gamePiece);
		center.ondblclick = pause;        
		this.runNo = 0;
		this.runInterval =
		  setInterval(run, 2500);
        this.interval =
		  setInterval(updateField, 20);
	},
	
	finish: function() {
		gameField.canvas.style.backgroundImage =
 "url(' '), url('gameover.png '), url('Gem Orange.png'), url('Gem Green.png '), url(' ')";
       navigator.vibrate(80);
       gamePiece.y -= 7;
	   gamePiece.x -= 3;
	   gamePiece.explode();
		updatePoints();
		this.stopRun();
		clearMove();
		endControl();
		center.ondblclick = " ";
	   setTimeout(updateFinish, 80);
      },
      
    toggleFullScreen : function() {
        const game = document.getElementById("game");
        if (!document.fullscreenElement){
           game.requestFullscreen();           
           this.clearOption();
           optionA.choose();
           optionB.text = "Exit Screen";
           optionB.unChoose();         
           showOptions();
           
          } else {
           document.exitFullscreen();
           this.clearOption();
           optionA.choose();
           optionB.text = "Full Screen";
           optionB.unChoose();
           showOptions();
           
         };
    },
	
	reset : function() {
		gamePiece.x = 10;
		gamePiece.y = 120;
		gamePiece.image.src = "airship.png";
		gamePiece.width = 95;
		gamePiece.height = 30;
		gameObstacle= [];
		localStore = JSON.parse(localStorage.getItem("points") );
		highScore = JSON.parse(localStorage.getItem("score") );
	},
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	clearOption : function() {
		this.context.clearRect(130, 115, 325, 137);
	},
	
	stop : function() {
			clearInterval(this.interval);
	},
	
	stopRun: function () {
		  clearInterval(this.runInterval);
	}
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.color = color;
	if (type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = gameField.context;
		if(this.type == "image") {
			ctx.drawImage(this.image,
             this.x,
             this.y,
             this.width, this.height);
          } else if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y);
		  } else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
	  }
	}
	
	this.explode = function() {
		this.image.src = "explode.png";
		this.width = 190;
		this.height = 100;
	}
	
	this.choose = function() {
		this.width = "50px";
		this.color = "white";
	}
	
	this.unChoose = function() {
		this.width = "35px";
		this.color = "black";
	}

	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	
	this.crashWith =
	function(otherobj) {
		let myLeft = this.x;
		let myRight = this.x + (this.width) -2;
		let myTop = this.y + 5;
		let myBottom = this.y + (this.height);
		let otherLeft = otherobj.x;
		let otherRight = otherobj.x + (otherobj.width);
		let otherTop = otherobj.y;
		let otherBottom = otherobj.y + (otherobj.height);
		let crash = true;

		if ((myBottom < otherTop) ||
		 (myTop > otherBottom) ||
		 (myRight < otherLeft) ||
	     (myLeft > otherRight)) {
			crash = false;
		}
		return crash;
	}
}

function hoverUp() {
		if(optionA.width == "50px") {
			gameField.clearOption();
		    optionC.choose();
		    optionA.unChoose();
		    showOptions();
	     } else if(optionC.width == "50px") {
		    gameField.clearOption();
		    optionB.choose();
	        optionC.unChoose();
	        showOptions();
	     } else {
		    gameField.clearOption();
		    optionA.choose();
	        optionB.unChoose();
	        showOptions();
	     };
}

function hoverDown() {
		if(optionA.width == "50px") {
			gameField.clearOption();
		    optionB.choose();
		    optionA.unChoose();
		    showOptions();
	     } else if(optionB.width == "50px") {
		    gameField.clearOption();
		    optionC.choose();
	        optionB.unChoose();
	        showOptions();
	     } else {
		    gameField.clearOption();
		    optionA.choose();
	        optionC.unChoose();
	        showOptions();
	     };
}

function select() {
   	if(optionA.width == "50px") {
	   	if(optionA.text == "Restart") {
	   	gameField.reset();
	   	};
	    gameField.canvas.style.backgroundImage = "url(' '), url(' '), url('Gem Orange.png'), url('Gem Green.png '), url(' ')";
	    gameField.start();
    } else if(optionB.width == "50px") {
        gameField.toggleFullScreen();
      } else {
	  if(optionC.text == "Exit") {
	  	window.close();
	    } else {
	    	gameField.canvas.style.backgroundImage = "url(' '), url(' '), url('Gem Orange.png'), url(' Gem Green.png'), url('')";
	    	gameField.reset();
	    	gameField.loadIndex();
	        gameField.clearOption();
	        optionC.unChoose();
	        showOptions();
	    };
      }
}

function startClick() {
	up.onclick = hoverUp;
	down.onclick = hoverDown;
    right.onclick = hoverDown;
    left.onclick = hoverUp;
    center.onclick = select;
}

function endClick() {
	up.onclick = " ";
	down.onclick = " ";
    right.onclick = " ";
    left.onclick = " ";
    center.onclick = " ";
}

function updateIndex() {
	points.text = localStore; 
	points.update();
	score.text = highScore;
	score.update();
	optionA.text = "Play Game";
	if (!document.fullscreenElement) {
	    optionB.text = "Full Screen";
	} else {
		optionB.text = "Exit Screen";
	}
	optionC.text = "Exit";
	optionA.choose();
	showOptions();
}

function showOptions() {
	optionA.update();
	optionB.update();
	optionC.update();
}

function updatePoints() {
	localStorage.setItem("points", JSON.stringify(pointTotal) );
	if(gameField.runNo > highScore) {
		localStorage.setItem("score", JSON.stringify(gameField.runNo) );
	};
}


function updateFinish() {
	gameField.stop();
	setTimeout(() => {
		gameField.clear();
		gameScore.text = "+ " + gameField.runNo;
		gameScore.update();
		points.update();
        score.update();
		gameField.canvas.style.backgroundImage = "url('spaceshipexplode.gif'), url(''), url('Gem Orange.png'), url(' Gem Green.png'), url('')";
	    optionA.text = "Restart";
	    optionC.text = "Home";
	    showOptions();
	    setTimeout(startClick, 150); 
	}, 440);
}

function run() {
	gameField.runNo += 1;
}
	   

function updateField() {
	let x, height, gap, minHeight, maxHeight, minGap, maxGap;
	for (i = 0; i <
		gameObstacle.length; i += 1) {
		if (gamePiece.crashWith(gameObstacle[i])) {
			gameField.finish();
		}
	}
	gameField.clear();
	gameField.frameNo += 1;
	
	if (gameField.frameNo == 1 || everyinterval(150)) {
		x = gameField.canvas.width;
		minHeight = 80;
		maxHeight = 185;
		height =
		Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		minGap = 60;
		maxGap = 275;
		gap =
		Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
		gameObstacle.push(new component(10, height, "yellow", x, 0));
		gameObstacle.push(new component(10, x - height - gap, "yellow", x, height + gap));
	}

	for (i = 0; i < gameObstacle.length; i += 1) {
		gameObstacle[i].speedX = -1;
		gameObstacle[i].newPos();
		gameObstacle[i].update();
	}
	
	
	
	if(gameField.runNo > highScore) {
		score.text = gameField.runNo;
	};
  
	pointTotal = localStore + gameField.runNo;
	points.text = pointTotal;
	points.update();
    score.update();
	gamePiece.newPos();
	gamePiece.update();

	if(pointTotal < 15) {
		info.text = "Hold center button to speed up";
		info.update();
	};
}

function everyinterval(n) {
	if ((gameField.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}