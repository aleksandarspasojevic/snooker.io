

class Board{
    constructor(boardImage, stickImage, relative_pos, absolute_pos, scale){
        this.boardImage = boardImage
        this.stickImage = stickImage
        if(relative_pos){
            this.relative_pos = relative_pos
            this.pos = createVector(relative_pos.x*width/scale, relative_pos.y*height/scale)             //position of the board
        }else{
            this.pos = createVector(absolute_pos.x/scale, absolute_pos.y/scale)
        }
        this.scale = scale         //board position with all elements on it could be scaled
        this.balls = []
        this.borderShape = []
        this.holes = []
        this.collisionSystem = new CollisionSystem()
        this.width = boardImage.width
        this.height = boardImage.height
        this.createBorderShape()
        this.createBoardHoles()
        this.myBall = this.createBoardBalls()
        this.stick = new Stick(this);
        this.aimHelper = new AimHelper(this);
        this.me_player = null

        //balls info
        this.numRed = 15 //by default
    }

    //everyting is created with board as reference point, all positions are board relative
    createBoardHoles(){
        this.holes.push(new Ball(22, createVector(30, 30), createVector(0, 0), "red"))
        this.holes.push(new Ball(22, createVector(403, 13), createVector(0, 0), "red"))
        this.holes.push(new Ball(22, createVector(768, 33), createVector(0, 0), "red"))
        this.holes.push(new Ball(22, createVector(776, 420), createVector(0, 0), "red"))
        this.holes.push(new Ball(22, createVector(406, 438), createVector(0, 0), "red"))
        this.holes.push(new Ball(22, createVector(29, 422), createVector(0, 0), "red"))

    }

    createBoardBalls(){     //returns to reference to white point
        let first_ball_pos = new createVector(500, 225)
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().sub(293 + 35, -35), createVector(0, 0), "white"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().sub(293 + 0, 70), createVector(0, 0), "green"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().sub(293 + 0, 0), createVector(0, 0), "brown"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().sub(293 + 0, -70), createVector(0, 0), "yellow"));


        this.balls.push(new Ball(ball_r, first_ball_pos, createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(2*ball_r*Math.cos(PI/6), -2*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(2*ball_r*Math.cos(PI/6), 2*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(4*ball_r*Math.cos(PI/6), -4*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(4*ball_r*Math.cos(PI/6), 0), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(4*ball_r*Math.cos(PI/6), 4*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));

        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(6*ball_r*Math.cos(PI/6), -6*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(6*ball_r*Math.cos(PI/6), -6*ball_r*Math.sin(PI/6)+2*ball_r), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(6*ball_r*Math.cos(PI/6), -6*ball_r*Math.sin(PI/6)+4*ball_r), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(6*ball_r*Math.cos(PI/6), -6*ball_r*Math.sin(PI/6)+6*ball_r), createVector(0, 0), "red"));

        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(8*ball_r*Math.cos(PI/6), -8*ball_r*Math.sin(PI/6)), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(8*ball_r*Math.cos(PI/6), -8*ball_r*Math.sin(PI/6)+2*ball_r), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(8*ball_r*Math.cos(PI/6), -8*ball_r*Math.sin(PI/6)+4*ball_r), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(8*ball_r*Math.cos(PI/6), -8*ball_r*Math.sin(PI/6)+6*ball_r), createVector(0, 0), "red"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(8*ball_r*Math.cos(PI/6), -8*ball_r*Math.sin(PI/6)+8*ball_r), createVector(0, 0), "red"));

        this.balls.push(new Ball(ball_r, first_ball_pos.copy().sub(2*ball_r*Math.cos(PI/6), 0), createVector(0, 0), "pink"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(-10*ball_r*Math.cos(PI/6), 0), createVector(0, 0), "blue"));
        this.balls.push(new Ball(ball_r, first_ball_pos.copy().add(18*ball_r*Math.cos(PI/6), 0), createVector(0, 0), "black"));

        return this.balls[0]
    }

    createBorderShape(){
        this.borderShape.push(new BorderLine(createVector(76, 50), createVector(378, 50)))
        this.borderShape.push(new BorderLine(createVector(428, 50), createVector(727, 50)))
        this.borderShape.push(new BorderLine(createVector(750, 79), createVector(750, 374)))
        this.borderShape.push(new BorderLine(createVector(430, 402), createVector(726, 402)))
        this.borderShape.push(new BorderLine(createVector(76, 402), createVector(378, 402)))
        this.borderShape.push(new BorderLine(createVector(50, 78), createVector(50, 373)))
        //smaller segments
        this.borderShape.push(new BorderLine(createVector(60, 31), createVector(76, 50)))
        this.borderShape.push(new BorderLine(createVector(26, 52), createVector(50, 78)))
        this.borderShape.push(new BorderLine(createVector(378, 50), createVector(387, 31)))
        this.borderShape.push(new BorderLine(createVector(421, 33), createVector(428, 50)))
        this.borderShape.push(new BorderLine(createVector(727, 50), createVector(741, 36)))
        this.borderShape.push(new BorderLine(createVector(750, 79), createVector(764, 61)))
        this.borderShape.push(new BorderLine(createVector(750, 374), createVector(764, 389)))
        this.borderShape.push(new BorderLine(createVector(726, 402), createVector(742, 416)))
        this.borderShape.push(new BorderLine(createVector(430, 402), createVector(422, 417)))
        this.borderShape.push(new BorderLine(createVector(378, 402), createVector(387, 417)))
        this.borderShape.push(new BorderLine(createVector(76, 402), createVector(62, 416)))
        this.borderShape.push(new BorderLine(createVector(50, 373), createVector(30, 394)))
    }

    getColor(val){
        switch(val){
            case 1:
                return 'red'
            case 2:
                return 'yellow'
            case 3:
                return 'green'
            case 4:
                return 'brown'
            case 5:
                return 'blue'
            case 6:
                return 'pink'
            case 7:
                return 'black'
            default: return 'any'
        }
    }

    toBoardCoordinates(x, y){
        x = (x / this.scale - this.pos.x + this.width/2)            //relative to board
        y = (y / this.scale - this.pos.y + this.height/2)
        return createVector(x, y)
    }

    update(){
        for(let i = 0; i < this.balls.length; i++){
            this.balls[i].update();

            for(let j = i + 1; j < this.balls.length; j++){
                this.collisionSystem.handleBallCollision(this.balls[i], this.balls[j], 1.0);
            }
            if(this.collisionSystem.handleHolesCollision(this.balls[i], this.holes)){
                this.me_player.pointBall(this.balls[i])
                this.balls[i].putInHole()
                // this.balls.splice(i, 1);    //we wont delete the ball - just hide -- cause we will often get the ball back to board
                continue
            }
            this.collisionSystem.handleShapeBorderCollision(this.balls[i], this.borderShape)
            // collisionSystem.handleWallCollision(balls[i], createVector(52, 52), createVector(747, 397));   //older method
        }
    }

    show(){
        push()
        scale(this.scale)
        image(this.boardImage, this.pos.x - this.width/2, this.pos.y - this.height/2);
        translate(this.pos.x - this.boardImage.width/2, this.pos.y - this.boardImage.height/2);
        
        // borderShape.forEach(border => {   //show borders //not required
        //   border.unhide()
        //   border.update()
        //   border.show()
        // });
        

        this.balls.forEach(ball => {
            ball.show();
        });

        // holes.forEach(ball => {
        //   ball.show();
        // });

        translate(-this.pos.x, -this.pos.y)
        this.aimHelper.show();
        this.stick.show();

        pop()
    }
}