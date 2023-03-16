
class Stick{
    constructor(board, rotation = 0){
        this.board = board
        this.pos = board.myBall.pos;
        this.stickImage = board.stickImage
        this.myBall = board.myBall
        this.shoot_intensity = 0
        this.rotation = rotation
        this.hidden = false
        this.stick_vec = createVector(1, 0)

        this.shootIncrement = 0.0
    }

    startShoot(){
        this.shootIncrement = 1
        this.shoot_intensity = 0
    }

    shootEnd(stick_vec = this.stick_vec){     //we could send stick vector externaly, or just call without params, it would shoot based on stick_vec calculated in update method
        this.myBall.setVelocity(stick_vec);   //kick the ball
        this.shootIncrement = 0
        this.shoot_intensity = 0
    }

    setStickVec(stick_vec){
        this.stick_vec.set(stick_vec)
    }

    setOrientation(x, y){    //x and y are global coordinates
        let x_relative = this.board.toBoardCoordinates(x, y).x
        let y_relative = this.board.toBoardCoordinates(x, y).y

        this.stick_vec.set(x_relative - this.myBall.pos.x, y_relative - this.myBall.pos.y).setMag(this.shoot_intensity / 2 + 1)
    }

    setShootIntensity(shoot_intensity){
        this.shoot_intensity = shoot_intensity
    }

    update(){
        this.shoot_intensity += this.shootIncrement
        this.shoot_intensity = this.shoot_intensity > 70 ? 70 : this.shoot_intensity;
        this.stick_vec.setMag(this.shoot_intensity / 2 + 1)
        this.rotation = this.stick_vec.heading();
    }

    hide(){
        this.hidden = true;
    }

    unhide(){
        this.hidden = false;
    }

    show(){
        if(this.hidden) return;
        push();
        translate(this.pos.x + this.board.pos.x, this.pos.y + this.board.pos.y);
        imageMode(CENTER);
        rotate(this.rotation)
        translate(-151 - this.shoot_intensity, 5);
        image(this.stickImage, 0, 0, 280, 75);
        pop();
    }


}