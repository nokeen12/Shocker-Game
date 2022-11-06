function setSize(){
    if(window.innerWidth < window.innerHeight){
        document.getElementById("game-box").style.width = '90vw';
        document.getElementById("game-box").style.height = document.getElementById("game-box").style.width
    }else{
        document.getElementById("game-box").style.height = '90vh';
        document.getElementById("game-box").style.width = document.getElementById("game-box").style.height;
    }
}
setSize()
window.addEventListener('resize', (e)=>{
    setSize()
})
class CharacterObject {
    constructor(x, y, width, height, canvasContext, color) {
        this.x = x;
        this.y = y;
        this.vxl = 0;
        this.vxr = 0;
        this.vyu = 0;
        this.vyd = 0;
        this.width = width;
        this.height = height;
        this.ctx = canvasContext;
        this.color = color;
    }
    updatePosition(){
        if(this.x <= 0){
            this.x += 4;  
        }if((this.x+this.width) >= document.querySelector('canvas').width){
            this.x -= 4;
        }if(this.y <= 0){
            this.y += 4;  
        }if((this.y+this.height) >= document.querySelector('canvas').height){
            this.y -= 4;
        }
        else{
            this.x += this.vxl;
            this.x += this.vxr;
            this.y += this.vyu;
            this.y += this.vyd;
        }
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class LaserObject {
    constructor(x, y, width, height, state, direction, canvasContext, color, timer, lid){
        this.x = x;
        this.y = y;
        this.pw = 20;
        this.ph = 20;
        this.width = width;
        this.height = height;
        this.state = state;
        this.direction = direction;
        this.ctx = canvasContext;
        this.color = color;
        this.timer = timer;
        this.lid = lid
    }
    draw(){
        this.ctx.fillStyle = this.color;
        if(this.direction == 1){
            this.timer < 100 ? this.ctx.fillRect(this.x, this.y, this.width, this.height) : this.ctx.fillRect(this.x+this.width/2, this.y, 5, this.height)
        }else{
            this.timer < 100 ? this.ctx.fillRect(this.x, this.y, this.width, this.height) : this.ctx.fillRect(this.x, this.y+this.height/2, this.width, 5)
        }
    }
    update(){
        this.draw();
        this.timer -= 1;
        this.timer < 100 ? this.state = true : null
    }
}
class PointObject {
    constructor(x, y, radius, canvasContext, color, id){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = canvasContext;
        this.color = color;
        this.id = id
    }
    draw(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.ctx.fill()
    }
}
window.onload = () => {
    $(".loader-wrapper").fadeOut("slow");
    //create a starting frame count of zero
    let totalFrameCount = 0;
    let laserArray = [];
    let pointArray = [];
    //reset game when player dies/loses
    function reset(){
        setTimeout(() => {
            const myCanvas = document.querySelector('canvas');
            const ctx = myCanvas.getContext('2d');
            myCanvas.style.visibility = 'hidden';
            document.getElementById('score').style.visibility = 'hidden';
            menu.style.visibility = 'visible';
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
            totalFrameCount = 0;
            document.querySelector("#score span").innerHTML = 0;
            laserArray = [];
            pointArray = [];
            started = false
        }, 5000)
    }
    const menu = document.getElementById('main-menu');
    let started = false
    document.addEventListener('keydown', (e)=>{
        if(started == false && e.key == ' '){
            
            const myCanvas = document.querySelector('canvas');
            const ctx = myCanvas.getContext('2d');
            menu.style.visibility = 'visible';
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

            setTimeout(() =>{
                started = true;
                menu.style.visibility = 'hidden';
                myCanvas.style.visibility = 'visible';
                document.getElementById('score').style.visibility = 'visible';
                startGame();
            },500)
        }
    })

    //game loop
    function startGame() {
        intervalId = setInterval(startGame, 1)
        //canvas and context
        const myCanvas = document.querySelector('canvas');
        const ctx = myCanvas.getContext('2d');
    
        //creates player
        const player = new CharacterObject(myCanvas.width/2, myCanvas.height/2, myCanvas.width/20, myCanvas.width/20, ctx, 'grey');

        var frames;
        let score = 0;
        let points = document.querySelector("#score span");
        let id = 0;
        let lid = 0; //laser id
        let difficulty = 1;
        //will update objects ingame and collision detection
        function updateGame(){
            frames = totalFrameCount++;
            if(totalFrameCount % 1000 === 0){
                difficulty++;
            }
            if(totalFrameCount % (500/difficulty*3) === 0){
                let x;
                let y;
                let direction;
                lid++
                if (Math.random() < 0.5){
                    x = 0;
                    y = Math.random()*myCanvas.height;
                    direction = 0;
                }else{
                    x = Math.random() * myCanvas.width;
                    y = 0;
                    direction = 1;
                }
                if(direction == 0){
                    laserArray.push(new LaserObject(x, y, myCanvas.width, myCanvas.width/20, false, direction, ctx, 'red', 500, lid))
                }else{
                    laserArray.push(new LaserObject(x, y, myCanvas.width/20, myCanvas.height, false, direction, ctx, 'red', 500, lid))
                }
            }
            if(totalFrameCount % 250 === 0){
                id++;
                pointArray.push(new PointObject(Math.random()*myCanvas.height, Math.random()*myCanvas.width, player.width/6, ctx, 'white', id))
            }
            laserArray.forEach((laser, index) => {
                laser.update()
                //laser and player collision
                if(laser.direction === 1){
                    if(laser.state && Math.abs(laser.x-player.x)<20){
                        runGame = false;
                        reset();
                        console.log('game over')
                    }
                }else{
                    if(laser.state && Math.abs(laser.y-player.y)<20){
                        runGame = false;
                        reset();
                        console.log('game over')
                    }
                }
                setTimeout(() =>{
                    if(laser.timer < 2){
                        // laserArray.splice(index, 1);
                        laserArray = laserArray.filter(e => e.lid !== laser.lid)
                    }
                }, 0)
            })
            pointArray.forEach((point, index) => {
                point.draw()
                //point and player collision
                const distBetween = Math.hypot(point.x - (player.x+player.width/2), point.y - (player.y+player.height/2))
                if(distBetween-player.width/2-point.radius/2<1){
                    setTimeout(() =>{
                        pointArray = pointArray.filter(e => e.id !== point.id)
                        score += 10;
                        points.innerHTML = score;
                    }, 0)
                }
            })
        }
        
        let runGame = true;
        startGame()
        function startGame(){ 
            if (runGame === true){
                //update player position
                player.updatePosition();
                //clear canvas
                ctx.fillStyle = 'blue';
                ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
                //redraw player
                player.draw();
                updateGame();
            }
        }
        
        //player movement
        document.addEventListener('keydown', (event) => {
            if(started){
                switch(event.code){
                    case 'ArrowLeft':
                    case 'KeyA':
                        player.vxl = -2;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        player.vxr = 2;
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        player.vyu = -2;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        player.vyd = 2;
                        break;
                }
            }
        });
        //stop the player if no key is pressed
        document.addEventListener('keyup', (event) => {
            if(started){
                switch(event.code){
                case 'ArrowLeft':
                case 'KeyA':
                    player.vxl = 0;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    player.vxr = 0;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    player.vyu = 0;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    player.vyd = 0;
                    break;
                }
            }
        });
    }
    const cursor = document.getElementById("cursor");
    document.onclick = e => {
        cursor.classList.add('expand');
        setTimeout(() =>{
            cursor.classList.remove('expand');
        }, 100)
    }
    document.addEventListener('mousemove', e =>{
        cursor.setAttribute("style", "top: "+(e.pageY-10)+"px; left: "+(e.pageX-10)+"px;")
    })
}