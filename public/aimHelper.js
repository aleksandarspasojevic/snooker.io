

class AimHelper{
    
    constructor(board){
        this.board = board
        this.balls = board.balls
        this.stick = board.stick
        this.myBall = board.myBall  // myBall is ball from which we project raycast
        this.hidden = false
        this.ray_cast_vec = createVector(1, 0)
        this.rayDistance =3000    //should be INF by default
    }

    hide(){
        this.hidden = true
    }

    unhide(){
        this.hidden = false
    }

    update(){
        let x1 = this.myBall.pos.x
        let y1 = this.myBall.pos.y
        let x2 = x1 + this.ray_cast_vec.x
        let y2 = y1 + this.ray_cast_vec.y      //x1 y1 x2 y2 are two points defining raytracing line

        let nearestIntersection = 3000   //SHOULD BE INF
        let got_intersection = false

        for(let ball of this.balls){
            if(ball == this.myBall || ball.inHole) continue;
            let x0 = ball.pos.x
            let y0 = ball.pos.y

            let d = Math.abs((x2 - x1)*(y1 - y0) - (x1 - x0)*(y2 - y1))/Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))  //nearest distance from ball

            // let l = Math.sqrt(Math.pow(this.myBall.radius, 2) - Math.pow(d, 2))  
            // let c = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2))
            // let f = Math.sqrt(Math.pow(c, 2) - Math.pow(d, 2)) 

            let a_vec = ball.pos.copy().sub(this.myBall.pos)  //vector pointing towards the center of the ball
            let a = a_vec.mag()
            let b = ball.radius*2
            let c_vec = this.stick.stick_vec.copy().normalize()
            let beta = Math.abs(a_vec.angleBetween(c_vec))
            let alpha = Math.PI - Math.asin(a*Math.sin(beta)/b)
            let gamma = Math.PI - alpha - beta
            let c_val = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(gamma))

            // console.log(this.stick.stick_vec.angleBetween(a_vec))
            if(Math.abs(this.stick.stick_vec.angleBetween(a_vec)) > PI/2) continue   //dont project ray behind me


            if(d < 2*ball.radius){    //we intersected with some ball
                got_intersection = true
                if(c_val < nearestIntersection){
                    nearestIntersection = c_val
                    // console.log(a, b, gamma * 180/PI, c_val)
                }
            }

        }
        
        if(got_intersection){
            this.rayDistance = nearestIntersection
        }else this.rayDistance = 3000
        

        this.ray_cast_vec = this.stick.stick_vec.copy().setMag(this.rayDistance)

    }

    show(){
        if(this.hidden) return;

        push()
        translate(this.board.pos)
        stroke(255, 255, 255, 100);
        let strokeThickness = 5
        strokeWeight(strokeThickness);
        
        let ray_cast_vec_shorten = this.ray_cast_vec.copy().setMag(this.ray_cast_vec.mag() - this.myBall.radius - strokeThickness/2)
        line(this.myBall.pos.x, this.myBall.pos.y, this.myBall.pos.x + ray_cast_vec_shorten.x, this.myBall.pos.y + ray_cast_vec_shorten.y);

        noFill()
        strokeWeight(3)
        fill(255, 255, 255, 100)
        ellipse(this.myBall.pos.x + this.ray_cast_vec.x, this.myBall.pos.y + this.ray_cast_vec.y, 2*this.myBall.radius, 2*this.myBall.radius)

        pop()
    }

}