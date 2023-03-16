
class BorderLine{

    constructor(point1, point2){
        this.point1 = point1
        this.point2 = point2
        this.hidden = true

        this.border_vec = createVector(point2.x - point1.x, point2.y - point1.y)

    }

    hide(){
        this.hidden = true
    }

    unhide(){
        this.hidden = false
    }

    update(){

    }

    show(){
        if(this.hidden) return;

        push()
        stroke(10)
        strokeWeight(2)
        line(this.point1.x, this.point1.y, this.point2.x, this.point2.y)
        pop()
    }

}