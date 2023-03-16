var PORT = 5000
var express = require('express');
var app= express();
var server = app.listen(PORT);     //important serving port
app.use(express.static('public'));

console.log("Server is running on port", PORT);

var socket = require('socket.io');
var io= socket(server);
io.sockets.on('connection', newConnection);





let playersMap = new Map()
let playerNum = 0;
let turn = 0
var stick_data = null

function newConnection(socket){  
  socket.on('init', init)
  socket.on('data', stickData);
  socket.on('shoot', shoot);

  socket.on('giveTurn', () => {
    turn = (turn + 1) % 2;
    // console.log("TURN")
  });

  
  socket.on("disconnect", disconnected);
  

  function init(initData){
    console.log("New connection with id:" + socket.id)

    //somebody sent init message, we should wait other player with first player's socket id, and then send to both players sucess message
    //if init data is not null it should be socket id of player that sent him invite link 

    playersMap.set(socket.id, null)
    if(initData){   //this message sends only second player, who entered the copy link
      if(playersMap.has(initData.socket_id)){
        playersMap.set(socket.id, initData.socket_id)
        playersMap.set(initData.socket_id, socket.id)

        //we have to client waiting for sucess message to start playing
        io.to(initData.socket_id).emit('sucess', {"playerNum" : 0})    //first player
        io.to(socket.id).emit('sucess', {"playerNum" : 1})         // second player
      }
    }
    console.log(playersMap)
    
  }

  function disconnected(reason){
    console.log("disconnected ", socket.id)

    //if socket was paired, delete the pair as well as the broken socket
    if(playersMap.has(socket.id)){
      let paired_socket_id = playersMap.get(socket.id)

      //send message to paired socket, that its pair has lost the connection
      io.to(paired_socket_id).emit('disconnect')

      playersMap.delete(paired_socket_id)
      playersMap.delete(socket.id)
    }
    // console.log(playersMap)
  }
 


  function stickData(data){
    // console.log(data)
    let second_player_socket_id = playersMap.get(socket.id)    //get my pair socket, and send data
    if(!second_player_socket_id) return
    io.to(second_player_socket_id).emit('heartBeat', data)
  }

  function shoot(data){
    let second_player_socket_id = playersMap.get(socket.id)
    if(!second_player_socket_id) return
    io.to(second_player_socket_id).emit('shoot', data)
  }

}

