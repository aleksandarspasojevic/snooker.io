//GLOBAL GAME PARAMS
ball_r = 10   //ball radius
let snookerTableImg, stickImg, fontBold;

//objects required for multiplayer mode
let me_player
let board
let socket
let score
let helper

let demo_boards = []        //boards and players created for demo screen of the game
let demo_players = []
let spotLight

let demo_mode = true   //while not connected, display some cool animations

function preload() {   //preload all assets needed
  
  snookerTableImg = loadImage('assets/snookerTable.png');
  stickImg = loadImage('assets/stick.png');
  fontBold = loadFont('assets/Brotherhood.ttf');

}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight-1);

  board = new Board(snookerTableImg, stickImg, createVector(0.5, 0.5), null, .9)
  score = new Score(board)
  helper = new Helper()
  me_player = new Player(board, score, helper)
  board.me_player = me_player
  

  startDemoMode()

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const socket_id = urlParams.get('socket_id')
  
  if(socket_id){    //i got an ivnite link 
    console.log(socket_id);
    
    socket = io.connect('http://25.58.132.204:5000');   //server port
    socket.emit('init', {socket_id})  //initialize connection
    socket.on('sucess', sucess);
    socket.on("disconnect", pair_disconnected)

    me_player.setSocket(socket)
  }
}



function draw() {
  background(96, 85, 72);
  if(demo_mode){ 
    demoMode();
    spotLight.setPos(createVector(mouseX, mouseY))
    spotLight.show()
    return
  }
 
  board.update()
  me_player.update()
  score.update()
  helper.update()

  board.show()
  score.show()
  helper.show()
  
}



function singlePlay(){
  demo_mode = false
  demo_boards = []
  demo_players = []
  document.getElementById("a").hidden = true;

  board = new Board(snookerTableImg, stickImg, createVector(0.5, 0.5), null, 0.9)
  score = new Score(board, false)
  me_player = new Player(board, score, helper, false)
  board.me_player = me_player
  me_player.myTurn = true
}



function invite(){
  
  // socket stuff
  socket = io.connect('http://91.187.156.45:5000');   //server port
  socket.on('connect', ()=>{
    document.getElementById("socket_id").value = "http://91.187.156.45:5000/?socket_id=" + socket.id;
  })
  socket.emit('init')  //initialize connection
  socket.on('sucess', sucess);
  
  me_player.setSocket(socket)
}

function startDemoMode(){
  spotLight = new SpotLight(createVector(100, 100), 350, 5)
  for(let i = 0.12; i<1; i+=0.38){
    for(let j = 0.15; j<1; j+=0.35){
      let b = new Board(snookerTableImg, stickImg, null, createVector(i*1536, j*713), 0.4)   //absolute positioning
      demo_boards.push(b)
    }
  }
  
  // score = new Score(boards[0])       //score needs board for getting its position when displaying some data on board

  for(let i in demo_boards){
    demo_players.push(new Player(demo_boards[i], null, null, false))
    demo_boards[i].me_player = demo_players[i]
    demo_players[i].myTurn = true
  }
  
}

function demoMode(){
  demo_boards.forEach(b => {
    b.update()
  });
  demo_players.forEach(p => {
    p.update()
  });

  demo_boards.forEach(b => {
    b.show()
  });

  push()
  fill(0, 0, 0, 100)
  rect(0, 0, width, height)
  pop()
}


//these functions are called even during setup, so we need to ensure if there are object instances craeted, before calling
function mouseMoved(){
  if(me_player) me_player.moveStick(mouseX, mouseY) 

  demo_players.forEach(p => {
    p.moveStick(mouseX, mouseY)
  });
}

function mousePressed(){
  if (mouseButton === LEFT){
    if(me_player) me_player.startShoot()

    demo_players.forEach(p => {
      p.startShoot()
    });
  }
  

  console.log(mouseX, mouseY)
}

function mouseReleased(){
  if (mouseButton === LEFT){
    if(me_player) me_player.endShoot()
    demo_players.forEach(p => {
      p.endShoot()
    });
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight-1);
  if(board) board.pos.set(board.relative_pos.x*width/board.scale, board.relative_pos.y*height/board.scale)
}




//SOCKET

function sucess(data){
  console.log(data)
  me_player.num = data.playerNum
  me_player.myTurn = me_player.num == 0 //if im first player, its my turn

  document.getElementById("a").hidden = true;
  demo_mode = false

  setInterval(sendData, 30)
  socket.on('heartBeat', heartBeat);       //other player's stick info 
  socket.on('shoot', shoot);               //when other player shoot
  socket.on("disconnect", pair_disconnected)
}


function sendData(){
  //we should send stick data continuously, stick rotation and intensity
  if(!me_player.myTurn) return

  socket.emit('data', 
  {
      "stick_vec": me_player.stick.stick_vec,
      "shoot_intensity": me_player.stick.shoot_intensity
  });
}

function heartBeat(data){
  // console.log(data)
  if(me_player.myTurn) return;
  
  me_player.setStickIntensity(data.shoot_intensity)
  if(me_player.stick) me_player.stick.setStickVec(createVector(data.stick_vec.x, data.stick_vec.y))  
}


function shoot(data){      
  console.log(data)

  me_player.endShoot(data)
}


function pair_disconnected(){
  alert("PAIR DISCONNECTED")
  console.log("PAIR DISCONNECTED")
  this.socket = null

  document.getElementById("a").hidden = false;
  document.getElementById("socket_id").value = '';
  demo_mode = true
}



//need to disable blocking insecure private networks
//chrome://flags/#block-insecure-private-network-requests