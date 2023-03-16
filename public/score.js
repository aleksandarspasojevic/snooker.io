

class Score{
    constructor(board, multiplayer = true){
        this.board = board
        this.multiplayer = multiplayer
        this.score1 = 0 
        this.score2 = 0 
        this.animationList = []

    }

    addPoints(ball, myBall, whome, message=""){
        if(whome == 'me'){
            this.score1 += ball.value_points
        }else{
            this.score2 += ball.value_points
        }
        
        this.animationList.push({
            "points": "+"+ball.value_points + " " + message,
            "pos": myBall.pos.copy().add(ball.pos.copy().sub(myBall.pos).mult(0.3)),  
            "size": {"min": 120, "max":40, "value": 60},
            "opacity": {"min": 255, "max":100, "value": 255},
            "percentage": 0,
            "speed": 2
        })

    }

    update(){
        this.animationList.forEach(anim => {
            anim.opacity.value = map(anim.percentage, 0, 100, anim.opacity.min, anim.opacity.max)
            anim.size.value = map(anim.percentage, 0, 100, anim.size.min, anim.size.max)
            anim.percentage+=anim.speed
            if(anim.percentage > 100){
                this.animationList.splice(anim)
            }
        });
    }

    show(){
        push()

        noStroke()
        textFont(fontBold);
        textSize(50)
        if(this.multiplayer){
            if(this.board.me_player.myTurn){
                fill(255, 255, 255, 200)
                ellipse(width*0.18, 55, 20, 20)
            }else fill(0, 0, 0, 200)
            text("YOU: " + this.score1, width*0.2, 70)
            
            
            if(!this.board.me_player.myTurn){
                fill(255, 255, 255, 200)
                ellipse(width*0.63, 55, 20, 20)
            }else fill(0, 0, 0, 200)
            text("OPP: " + this.score2, width*0.65, 70)
            
        }else{
            fill(255, 255, 255, 200)
            text("YOU: " + this.score1, width*0.4, 70)
        }

        scale(this.board.scale)
        translate(this.board.pos.x - this.board.boardImage.width/2, this.board.pos.y - this.board.boardImage.height/2);

        this.animationList.forEach(anim => {
            textSize(anim.size.value)
            fill(255, 255, 255, anim.opacity.value)
            textFont(fontBold);
            text(anim.points, anim.pos.x, anim.pos.y)

        });
        pop()
    }

}