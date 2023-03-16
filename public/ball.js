

class Ball{
    constructor(radius, pos, vel, type){
        this.radius = radius;
        this.mass = radius*radius * Math.PI;
        this.pos = pos.copy();
        this.defaultStartPos = this.pos.copy()  // we should rememmber where the ball should be initially
        this.next_pos = pos.copy();   //future position -- required for dynamic collision detection
        this.vel = vel.copy();
        this.friction_coef = 0.98;
        this.type = type                //color 

        this.ballsCollided = []    //list of ball types this ball collided with
        this.inHole = false

        this.value_points = 1 //by default -- defined values by game propositions
        switch(this.type){
            case 'red':
                this.value_points = 1
                break
            case 'yellow':
                this.value_points = 2
                break  
            case 'green':
                this.value_points = 3
                break  
            case 'brown':
                this.value_points = 4
                break
            case 'blue':
                this.value_points = 5
                break
            case 'pink':
                this.value_points = 6
                break
            case 'black':
                this.value_points = 7
                break
        }
    }


    putInHole(){
        this.inHole = true
        this.vel.mult(0)
        this.ballsCollided = []
    }

    getFromHole(){
        this.inHole = false
        this.pos.set(this.defaultStartPos)     //on this pos references stick also, we shouldnt change reference, only set vectors
    }

    isMoving(){
        return this.vel.mag() > 0 
    }

    setVelocity(vel){
        this.vel.set(vel);
    }

    update(){
        if(this.inHole) return 
        if(this.vel.mag() < 0.1) this.vel.mult(0);   //speed gets to low to track the isMoving ball property
        this.vel.mult(this.friction_coef);
        this.pos.add(this.vel);
    }

    show(){
        if(this.inHole) return 
        push();
        switch(this.type){
            case "red":
                fill(222,60,40);
                break;
            case "blue":
                fill(59, 76, 217);
                break;
            case "green":
                fill(13, 222, 62);
                break;
            case "brown":
                fill(138, 60, 35);
                break;
            case "yellow":
                fill(210, 237, 19);
                break;
            case "pink":
                fill(223, 154, 227);
                break;
            case "black":
                fill(0);
                break;
            case "white":
                fill(255);
                break;
        }
        noStroke();
        ellipse(this.pos.x, this.pos.y, 2*this.radius, 2*this.radius);
        pop();
    }

}