var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d') //es el pincel para dibujar en el lienzo

//ctx.fillRect(0,0,50,50)

//Variables globales

var interval;
var frames = 0;
var images = {
    bg: 'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/bg.png?raw=true',
    flappy: 'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/flappy.png?raw=true',
    pipe1:'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_bottom.png?raw=true', 
    pipe2:'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_top.png?raw=true'
}
var pipes =[];

//Clases

//El board sabe cómo dibujarse a sí mismo
class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.image = new Image()
        this.image.src = images.bg
        this.image.onload = () => {
            this.draw()
        }
        this.music = new Audio()
        this.music.src = "./voyage.mp3"
    }
    draw(){
        this.x-=.5
        if(this.x < -canvas.width) this.x=0
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height)
        ctx.font = '50px VT323'
        ctx.fillStyle='white'
        ctx.fillText(Math.floor(frames/60),100,100)
    }
}

class Flappy{
    constructor(){
        this.x = 150
        this.y = 150
        this.width = 40
        this.height = 30
        this.image = new Image()
        this.image.src = images.flappy
        this.image.onload = () => {
            this.draw()
        }
        this.gravity = 3
        this.crash = new Audio()
        this.crash.src = "crash.mp3"
    }
    draw(){
        if(this.y<canvas.height-40) this.y += this.gravity;
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

    crashWith(item){
        var crash = (this.x < item.x + item.width) && 
                (this.x + this.width > item.x) && 
                (this.y <item.y + item.height) && 
                (this.y + this.height > item.y);
        if (crash) this.crash.play()
        return crash;
    }
}

class Pipe{
    constructor(y, height, pipeName = "pipe2"){
        this.x = canvas.width - 50
        this.y = y ? y:0 //operador ternario, validaciòn por si no se le pasa el valor en el parèntesis del constructos
        this.width = 50
        this.height = height || 100
        this.image = new Image()
        this.image.src = images[pipeName]
        this.image.onload = () => {
            this.draw()
        }
    }
    draw(){
        this.x-=2
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}

//instancias
var board = new Board()
var flappy = new Flappy()


//funciones principales
//update borra el canvas para limpiarlo
function update(){
    frames++
    ctx.clearRect(0,0,canvas.width,canvas.height)
    //poner el objeto que se va a dibujar:
    board.draw()
    flappy.draw()
    
    //1. Generar pipes
    generatePipes()
    //2. Dibujar pipes
    drawPipes()
    checkCollitions()
}

function start(){
    if(interval) return
    pipes = []
    frames = 0
    //start crea un intervalo que ejecuta a update 60 veces por segundo
    interval = setInterval(update,1000/60)
}

function gameOver(){
    clearInterval(interval)
    //<link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    ctx.font = "80px VT323"
    ctx.fillText("Game Over", 50, 250)
    ctx.font = "50px VT323"
    ctx.fillStyle = "yellow"
    ctx.fillText("Press esc to restart", 50, 300)
    interval = null
    board.music.pause()
}

//funciones auxiliares
function generatePipes(){
    if (frames % 200 === 0){
        //1. Generar el tubo de arriba new Pipe(y,alto,'pipe1')
        var y=0
        var alto = Math.floor(Math.random() * 400) + 20
        var topPipe = new Pipe (y,alto,'pipe2')

        //2. Establecer el espacio donde pasa Flappy
        var window = 100
        var alto2 = canvas.height - (window + alto)
        
        //3. Generar el tubo de abajo
        var bottomPipe = new Pipe (canvas.height - alto2, alto2, 'pipe1')

        //4. Dónde poner los tubos
        pipes.push(topPipe)
        pipes.push(bottomPipe)
    } 
}

function drawPipes(){
    pipes.forEach(function(pipe){
        pipe.draw()
    })
}

function checkCollitions(){
    pipes.forEach(function(pipe){
    if (flappy.crashWith(pipe)){
        gameOver()
    }
    })
}
    


//los observadores
addEventListener('keydown',function(e){ //recibe un evento (e)
    if(e.keyCode === 32 && flappy.y > 50){
        flappy.y -= 70
    }
    if(e.keyCode===27){
        start()
    }
    if(e.keyCode === 13){
        start()
        board.music.play()
    }
})
