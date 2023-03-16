

class Player{
    constructor(board, score, helper, multiplayer_mode = true){
        this.board = board
        this.socket = null
        this.helper = helper
        this.multiplayer_mode = multiplayer_mode

        this.stick = board.stick             //stick comes with board
        this.aimHelper = board.aimHelper     //board gives option to help in aiming
        this.score = score 
        this.balls = board.balls
        this.collisionSystem = board.collisionSystem  //player has collisionSystem for detecting state on the board
        this.myBall = board.myBall

        this.myTurn = false
        this.num = 0           //myNum

        this.moving = false
        this.ballsPointed = []

        this.allowedShot = {
            "type": "red",      //this could be red or any 
            "val": 1            //value of the ball, particularly needed for colored ones
        }

        this.numRedBefore = this.board.numRed     //before an shot, num of balls
    }

    update(){
        // if(!this.myTurn) return;
        if(this.collisionSystem.stationaryState(this.balls)){
            this.stick.unhide();
            this.aimHelper.unhide();

            if(this.moving){ this.ballsStopped(); this.moving = false}
        }
        else{
            this.moving = true
            this.stick.hide(); 
            this.aimHelper.hide();
        }
        this.aimHelper.update();
        this.stick.update();
    }


    setSocket(socket){
        this.socket = socket
    }

    moveStick(mouseX, mouseY){
        if(!this.myTurn) return;

        if(this.stick) this.stick.setOrientation(mouseX, mouseY);   
    }

    setStickIntensity(intensity){
        if(this.stick) this.stick.setShootIntensity(intensity)
    }

    startShoot(){
        if(this.stick.hidden) return;
        if(!this.myTurn) return;   //we are not on turn, cant play

        this.stick.startShoot();
    }

    endShoot(data){    //endShoot could be called localy without params, and should be called when we receive another players shoot with data
        //no matter which player is on the move, we count an ball numbers 
        this.numRedBefore = this.board.numRed;    //store num of reds before a shot

        if(data){      //data from server
            let vel_vec = createVector(data.stick_vec.x, data.stick_vec.y)  //create aim vector from server data
            this.stick.shootEnd(vel_vec);
            return
        }

        if(this.stick.hidden) return;
        if(!this.myTurn) return;   //we are not on turn, cant play

        //send shoot event data to server
        if(this.socket && this.multiplayer_mode){
            this.socket.emit('shoot', 
            {
                "stick_vec": this.stick.stick_vec,
                "shoot_intensity": this.stick.shoot_intensity
            });
        }
        
        this.stick.shootEnd();
    }

    pointBall(ball){   //called when ball enters the hole
        if(ball.type != "white"){
            if(ball.type == "red") this.board.numRed--;
            else{
                if(this.numRedBefore == 0) this.allowedShot.val = ball.value_points + 1 //next
            }
            
            // Potting a ball "not-on
            let foul = this.pottedWrong(ball)
            if(this.score){
                if(!foul){
                    this.score.addPoints(ball, this.myBall, this.myTurn ? "me" : "other")   //set mine score or other player's
                }
                else{
                    this.score.addPoints(ball, this.myBall, !this.myTurn ? "me" : "other")   //set oponents score, cause i made a foult
                }
            } 
        }
        this.ballsPointed.push(ball)
    }


    returnBallsRequired(){
        if(this.numRedBefore > 0){     //if we scored colored one, and there were reds on the board, we should return the colored one
            this.ballsPointed.forEach(ball => {
                if(ball.type != 'white' && ball.type != 'red'){
                    ball.getFromHole()
                }
            });
        }
    }
   

    ballsStopped(){  //blayer sees if balls had stopped
        console.log("STOPED")
        this.gameRules()
        console.log(this.allowedShot)

        if(this.helper){
            if(this.allowedShot.type == 'red'){
                this.helper.addHint('Aim red')
            }else if(this.allowedShot.val > 1){
                this.helper.addHint('Aim ' + this.board.getColor(this.allowedShot.val))
            }else{
                this.helper.addHint('Aim colored')
            }
        }
        
        this.returnBallsRequired()
        this.myBall.ballsCollided = []
        this.ballsPointed = []
    }

    gameRules(){
        let foul = this.checkFoul()

        if(foul.foul){
            console.log(foul)
            if(this.helper) this.helper.addHint('FOUL')
            if(this.numRedBefore > 0){  
                this.allowedShot.type = 'red'
            }
            if(this.multiplayer_mode) this.myTurn = !this.myTurn
        }else{
            //no foul here
            let scored = this.ballsPointed.length > 0

            if(scored){
                if(this.numRedBefore > 0){
                    this.allowedShot.type = this.allowedShot.type == 'red' ? 'any' : 'red';

                    //we pointed last red
                    if(this.board.numRed == 0){
                        this.allowedShot.val = 2
                    }
                }
            }else{ // no foult and no points, give turn  
                if(this.numRedBefore > 0){  
                    this.allowedShot.type = 'red'
                }
                if(this.multiplayer_mode) this.myTurn = !this.myTurn
            }

        }

    }

    pottedWrong(ball){
        let foul = false
        if(this.allowedShot.type == 'red' && ball.type != 'red' || this.allowedShot.type == 'any' && ball.type == 'red'){
            foul = true
        }
        else if(this.allowedShot.type == 'any' && this.numRedBefore == 0 && ball.value_points != this.allowedShot.val && this.allowedShot.val != 1){  //no reds, should shoot colored ones in defined order 
            foul = true
        }

        return foul
    }

    checkFoul(){   //should be called when all balls stop

        let foul = {"foul": false, "value": 0}
        //Failing to hit any other ball with the cue ball.
        if(this.myBall.ballsCollided.length == 0){
            foul.foul = true
        }

        // First hitting a ball "not-on" with the cue ball.
        if(this.myBall.ballsCollided.length){
            let ball = this.myBall.ballsCollided[0]   //first ball we kicked
            console.log(ball.type, this.allowedShot.type)
            if(this.allowedShot.type == 'red' && ball.type != 'red' || this.allowedShot.type == 'any' && ball.type == 'red'){
                foul.foul = true
            }
            else if(this.allowedShot.type == 'any' && this.numRedBefore == 0 && ball.value_points != this.allowedShot.val && this.allowedShot.val != 1){  //no reds, should shoot colored ones in defined order 
                foul.foul = true
            }
        }

        // Potting a ball "not-on".    -- and if we potted we should return the value of the ball potted
        // Potting the cue ball (in-off)           //and if so, get the ball out
        this.ballsPointed.forEach(ball => {
            console.log(ball.type, this.allowedShot.type)
            if(ball.type == 'white'){
                ball.getFromHole()
                foul.foul = true
            }
            else{
                if(this.allowedShot.type == 'red' && ball.type != 'red' || this.allowedShot.type == 'any' && ball.type == 'red'){
                    foul.foul = true
                    foul.value = ball.value_points
                }
                else if(this.allowedShot.type == 'any' && this.numRedBefore == 0 && ball.value_points != this.allowedShot.val && this.allowedShot.val != 1){  //no reds, should shoot colored ones in defined order 
                    foul.foul = true
                    foul.value = ball.value_points
                }
            }
        });

        return foul
    }




}

