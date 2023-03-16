
class Helper{
    constructor(){
        this.animationList = []
    }

    addHint(message){
        console.log(message)
        this.animationList.push({
            "message": message,
            "pos": createVector(random(width*0.7) + 0.2*width, height*0.9),  
            "size": {"min": 60, "max": 50, "value": 60},
            "opacity": {"min": 150, "max": 0, "value": 150},
            "percentage": 0,
            "speed": 0.3
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

        this.animationList.forEach(anim => {
            textSize(anim.size.value)
            fill(255, 255, 255, anim.opacity.value)
            textFont(fontBold);
            text(anim.message, anim.pos.x, anim.pos.y)
        });
        pop()
    }

}