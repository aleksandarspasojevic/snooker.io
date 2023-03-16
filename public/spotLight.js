

class SpotLight{
    constructor(pos, radius, brightness){
        this.pos = pos
        this.radius = radius
        this.brightness = brightness
    }

    setPos(pos){
        this.pos.set(pos)
    }

    show(){
        let steps = 20
        push()
        noStroke()
        for(let i = 0; i<steps; i++){
            fill(255, 255, 255, map(i, 0, steps, this.brightness, 0))
            ellipse(this.pos.x, this.pos.y, i/steps *this.radius*2, i/steps *this.radius*2)
        }
        pop()
    }

}