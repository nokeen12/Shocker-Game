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
            this.x += 2;  
        }if((this.x+this.width) >= 800){
            this.x -= 2;
        }if(this.y <= 0){
            this.y += 2;  
        }if((this.y+this.height) >= 800){
            this.y -= 2;
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
    constructor(x, y, width, height, state, direction, canvasContext, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.state = state;
        this.direction = direction;
        this.ctx = canvasContext;
        this.color = color;
        this.timer = 1000;
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    update(){
        this.draw();
        this.timer -= 1;
        this.timer < 500 ? this.state = true : null
    }
}
class PointObject {
    constructor(x, y, width, height, canvasContext, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = canvasContext;
        this.color = color;
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    update(){
        this.draw();
    }
}
window.onload = () => {
    $(".loader-wrapper").fadeOut("slow");
    //create a starting frame count of zero
    let totalFrameCount = 0;
    let laserArray = [];
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
            laserArray = [];
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
        
        //will update objects ingame and collision detection
        function updateGame(){
            frames = totalFrameCount++;
            if(totalFrameCount % 1000 === 0){
                let x;
                let y;
                let direction;
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
                    laserArray.push(new LaserObject(x, y, myCanvas.width, myCanvas.width/20, false, direction, ctx, 'red'))
                }else{
                    laserArray.push(new LaserObject(x, y, myCanvas.width/20, myCanvas.height, false, direction, ctx, 'red'))
                }
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
                    if(laserArray[index].timer < 1){
                        laserArray.splice(index, 1);
                    }
                }, 0)
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
            // if(started){
                switch(event.code){
                    case 'ArrowLeft':
                    case 'KeyA':
                        player.vxl = -1;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        player.vxr = 1;
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        player.vyu = -1;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        player.vyd = 1;
                        break;
                }
            // }
        });
        //stop the player if no key is pressed
        document.addEventListener('keyup', (event) => {
            // if(started){
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
            // }
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