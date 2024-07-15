const canvas = document.getElementById("game");
let lvl1 = [
    [0,0,0,0,0],
    [0,3,1,1,0],
    [0,0,0,1,0],
    [0,2,1,1,0],
    [0,0,0,0,0]
]
let lvl2 = [
    [0,0,0,0,0],
    [0,1,1,2,0],
    [0,1,1,1,0],
    [0,1,1,3,0],
    [0,0,0,0,0]
]
let lvl3 = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,3,0,0,0,0,0,0,0,0,0,0,2,0],
[0,1,0,0,0,0,0,0,0,0,0,0,1,0],
[0,1,0,0,1,1,0,0,0,0,0,0,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,1,0,0,0,0,1,1,0,0,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

let lvl4 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,0,0,0,0,0,0,0,0,0,0,2,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,8,0,0,1,1,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,5,5,0],
    [0,7,1,0,0,0,0,1,1,0,0,5,5,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
let lvl5 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,1,0,1,0,0,2,0,0,1,0,1,0,0,0,0,0],
    [0,1,1,5,1,1,5,1,1,5,1,1,0,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,3,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0],
    [0,0,1,1,1,1,5,1,1,5,1,1,0,1,1,0,0],
    [0,0,6,1,1,0,1,0,0,1,0,1,0,1,1,1,0],
    [0,0,1,1,1,1,1,0,0,1,1,1,0,0,1,1,0],
    [0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]
let can_move = true;
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
let size = 50;


let moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
function     isMovementKey(direction) {
    return moveKeys.includes(direction);
}
class Player {
    constructor() {
        this.moveInterval = 200; // Time in milliseconds between moves
        this.movementIntervals = {}; // Object to store intervals for each direction
        this.x = 0;
        this.y = 0;
        this.lastMove = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 2.5;
        this.isMoving = false;
        this.moveDistance = 50; // Total distance to move
    }
    get indX() {
        return parseInt((this.x - (size/2)) / size)
    }
    get indY() {
        return parseInt((this.y - (size/2)) / size)
    }
    startMoving(direction) {
        console.log(isMovementKey(direction), Object.keys(this.movementIntervals).length);
        if (!isMovementKey(direction) || this.movementIntervals[direction] || Object.keys(this.movementIntervals).length > 0) {
            console.log("WRONG");
            return; // Already moving in this direction
        }
        // Move immediately on keydown
        this.move(direction);

        // Start the interval to keep moving
        console.log("SETTING INTERVA 1", this.movementIntervals);
        let time = Date.now();
        this.movementIntervals[direction] = setInterval(() => {
            console.log("SETTING INTERVAL", Date.now() - time);
            this.move(direction);
            this.isMoving = false;
            time = Date.now();
        }, this.moveInterval);
    }
    resetPlayer() {
        this.x = 0;
        this.y = 0;
        this.lastMove = 0;

    }

    stopMoving(direction) {
        console.log("STOP MOVING");
        if (!isMovementKey(direction))
            return;
        clearInterval(this.movementIntervals[direction]);
        delete this.movementIntervals[direction];
        this.isMoving = false;
    }
    handleBlock(direction, x, y) 
    {
        let currBlock = game._currLvl.lvl[this.indY][this.indX];
        let nextBlock = parseInt(game._currLvl.lvl[y][x]);
        let currOriginalTile = game.levelsCopy[game.levelInd].lvl[this.indY][this.indX];
        if (currOriginalTile == 5) {
            if (currOriginalTile == 10) {
                return 4;
            }
            
            game.levelsCopy[game.levelInd].lvl[this.indY][this.indX] = 10;
            return 10;
        } else if (nextBlock == 7) {
            game._currLvl.key -= 1;
            return 4;
        } else if (nextBlock == 8) {
            if (game._currLvl.key == 0) {
                return 4;
            }
            return 2;
        } else {
            return 4;
        }
    }
    animateMove() {
        if (!this.isMoving || !this.movementIntervals) return;
        // Calculate the distance to move in this frame
        const distanceX = Math.abs(this.targetX - this.x);
        const distanceY = Math.abs(this.targetY - this.y);
        
        // Check if the player is close enough to the target to stop
        if (distanceX <= this.speed && distanceY <= this.speed) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            
            return;
        }

        // Move the player closer to the target position
        if (distanceX !== 0) {
            this.x += this.speed;
        }
        if (distanceY !== 0) {
            this.y += this.speed;
        }
    }
    move(direction) {
        console.log(`Moving ${direction}`);
        let unmovable = [0,4];
        if (!game._currLvl.lvl.some(arr => arr.includes(3)) || this.isMoving || Date.now() - this.lastMove < this.moveInterval) {
            console.log("RETURN", this.isMoving, Date.now() - this.lastMove);
            return;
        }
        console.log(this.indX, this.indY);
        switch(direction) {
            case "ArrowRight":
                {
                    if (unmovable.includes(game._currLvl.lvl[this.indY][this.indX+1])) {
                         return;
                    }
                    let currBlock = this.handleBlock(direction, this.indX+1, this.indY);
                    game._currLvl.lvl[this.indY][this.indX] = currBlock;
                    if (currBlock != 2) {
                        game._currLvl.lvl[this.indY][this.indX+1] = 2;
                    }
                    break;
                }    
                
            case "ArrowLeft":
                {
    
                    if (unmovable.includes(game._currLvl.lvl[this.indY][this.indX-1])) {
                         return;
                    }
                    let currBlock = this.handleBlock(direction, this.indX-1, this.indY);
                    game._currLvl.lvl[this.indY][this.indX] = currBlock;
                    if (currBlock != 2) {
                        game._currLvl.lvl[this.indY][this.indX-1] = 2;
                    }
                    this.isMoving = true;

        
                    break;
                }
               
            case "ArrowUp": 
            {
                if (unmovable.includes(game._currLvl.lvl[this.indY-1][this.indX])) {
                    return;
               }
               let currBlock = this.handleBlock(direction, this.indX, this.indY-1);

                    game._currLvl.lvl[this.indY][this.indX] = currBlock;
                    if (currBlock != 2) {
                        game._currLvl.lvl[this.indY-1][this.indX] = 2;
                    }
                    this.isMoving = true;

                    break;
            }
           
            case "ArrowDown":   
            {
                console.log(game._currLvl.lvl);
                console.log(game._currLvl.lvl[this.indY+1][this.indX]);
                if (unmovable.includes(game._currLvl.lvl[this.indY+1][this.indX])) {
                    return;
               }
               let currBlock = this.handleBlock(direction, this.indX, this.indY+1);

               game._currLvl.lvl[this.indY][this.indX] = currBlock;
               if (currBlock != 2) {
                game._currLvl.lvl[this.indY+1][this.indX] = 2;
               }
               this.isMoving = true;

                    break;
            }
        }
        this.lastMove = Date.now();
        if (!game._currLvl.lvl.some(arr => arr.includes(3))) {
    
            setTimeout(() => {
                game.nextLevel();
            }, 1000);
    
            return;
        }
    }
}
class Game {

    constructor(canvas, size) {
        this.levels = [{lvl: lvl4, key: 1}, {lvl: lvl5, key: 0}, {lvl: lvl3, key: 0}, {lvl: lvl4, key: 1}]
        this.levelsCopy = JSON.parse(JSON.stringify(this.levels));
        this.canvas = canvas;
        this.levelInd = 0;
        this.size = size;
        this._currLvl = JSON.parse(JSON.stringify(this.levels[this.levelInd]));  // Initialize with an empty level structure
        this.player = new Player()
        this.score = 0;
        this.prevScore = 0;
    }

    get currLvl() {
        return this._currLvl;
    }

    set currLvl(newLvl) {
        this._currLvl = newLvl;
        this.updateOffset();  // Update offset whenever currLvl is set
    }

    updateOffset() {
        this.offset = (this.canvas.width - this._currLvl[0].length * this.size) / 2;
    }

    nextLevel() {
        this._currLvl = JSON.parse(JSON.stringify(this.levels[++this.levelInd]));
        this.player.resetPlayer()
        this.prevScore += this.score;
        this.score = 0;
    }

    resetLevel() {
        this._currLvl = JSON.parse(JSON.stringify(this.levels[this.levelInd]));
        this.levelsCopy = JSON.parse(JSON.stringify(this.levels));
        this.player.resetPlayer()
        this.score = 0;
    }
    get offset() {
        return (this.canvas.width - this._currLvl.lvl[0].length * this.size) / 2;
    }

    set offset(value) {
        // No need to set anything here as offset is calculated dynamically
        console.log(`Offset value is now: ${value}`);
    }
}
let game = new Game(canvas, 50);
let score = 0;
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game._currLvl.lvl.forEach((e, y) => {
        e.forEach((tile, x) => {
            ctx.beginPath()
            let xSize = x * size + game.offset;
            let ySize = y * size + game.offset;
            switch (tile) {
                case 0: // Walls
                    ctx.strokeStyle = "orange";
                    ctx.fillStyle = "white"
                    ctx.lineWidth = 2;
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize ,ySize, size, size)
                    break;
                case 1: case 10: // Walkable map
                    ctx.fillStyle="blue";
                    ctx.strokeRect(xSize , ySize , size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 2: // Player
                    ctx.fillStyle="black";
                    game.player.x =  x * size + size / 2 ;
                    game.player.y = y * size + size / 2;
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    ctx.arc(game.player.x + game.offset, game.player.y + game.offset, size / 3, 0, 2 * Math.PI);
                    ctx.strokeStyle = "orange";
                    ctx.stroke();
                    ctx.fill();
                    break;
                case 3: // Finish line
                    ctx.strokeStyle = "orange";
                    ctx.fillStyle="green";
                    ctx.strokeRect(xSize ,ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 4: // Walked over tile
                    ctx.strokeStyle = "orange";
                    ctx.fillStyle="lightblue";
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 5: // Double walk over tiles
                    ctx.strokeStyle = "red";
                    ctx.fillStyle="darkblue";
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 6: // Cash tile
                    ctx.strokeStyle = "lightgreen";
                    ctx.fillStyle="darkgreen";
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 7: //Key
                    ctx.strokeStyle = "yellow";
                    ctx.fillStyle = "yellow";
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)
                    break;
                case 8: //Door
                    ctx.strokeStyle = "brown";
                    ctx.fillStyle = "brown";
                    ctx.strokeRect(xSize, ySize, size, size);
                    ctx.fillRect(xSize, ySize, size, size)            
                    break;
            }
            ctx.closePath()
        })
    })
}

function drawScore() {
    ctx.beginPath()
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${game.score + game.prevScore}`, game._currLvl.lvl[0].length * size, (game._currLvl.lvl.length + 1) * size + game.offset);
    ctx.closePath();
}
document.addEventListener("click", handleClick);

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;
    const metrics = ctx.measureText("Reset");
    let textY = (game._currLvl.lvl.length + 1) * size + game.offset;
    let textX = game.offset
    const textWidth = metrics.width;
    const textHeight = parseInt(ctx.font, 10);
    if (clickX >= textX && e.offsetX <= textX + textWidth &&
        clickY <= textY && clickY >= textY - textHeight
    ) {
        game.resetLevel();
    }
}
function drawReset() {
    ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.fillText("Reset", game.offset, (game._currLvl.lvl.length + 1) * size + game.offset);
    ctx.closePath()


}
document.addEventListener('keydown', (event) => {
    if (event.repeat) return; // Prevent multiple keydown events for the same key
    game.player.startMoving(event.key)
});

document.addEventListener('keyup', (event) => {
    game.player.stopMoving(event.key)
});    
requestAnimationFrame(gameLoop);
function gameLoop() {

    drawMap();
    drawReset();
    drawScore();
    requestAnimationFrame(gameLoop);
}
