

class CollisionSystem{
    constructor(){}

    handleBallCollision(ball1, ball2, restitiution){
        if(ball1.inHole || ball2.inHole) return
        var dir = p5.Vector.sub(ball2.pos, ball1.pos);
        var d = dir.mag();
        
        if(d == 0.0 || d > (ball1.radius + ball2.radius)) return;

        dir.normalize();

        var corr = (ball1.radius + ball2.radius - d) / 2.0;
        ball1.pos.add(dir.copy().mult(-corr));
        ball2.pos.add(dir.copy().mult(corr));


        var v1 = ball1.vel.copy().dot(dir);
        var v2 = ball2.vel.copy().dot(dir);

        var m1 = ball1.mass;
        var m2 = ball2.mass;

        var newV1 = (m1*v1 + m2*v2 - m2*(v1 - v2)*restitiution)/(m1 + m2);
        var newV2 = (m1*v1 + m2*v2 - m1*(v2 - v1)*restitiution)/(m1 + m2);

        ball1.vel.add(dir.copy().mult(newV1 - v1));
        ball2.vel.add(dir.copy().mult(newV2 - v2));

        ball1.ballsCollided.push(ball2)
    }


    handleBorderCollision(ball, borderLine){
        if(ball.inHole) return
        let x0 = ball.pos.x
        let y0 = ball.pos.y

        let x1 = borderLine.point1.x
        let y1 = borderLine.point1.y
        let x2 = borderLine.point2.x
        let y2 = borderLine.point2.y

        let d = Math.abs((x2 - x1)*(y1 - y0) - (x1 - x0)*(y2 - y1))/Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))  //nearest distance from ball

        let a = y1 - y2
        let b = x2 - x1
        let c = x1*(y2 - y1) - y1*(x2 - x1)

        let tx = (b * (b * x0 - a*y0) - a*c)/(a*a + b*b)
        let ty = (a*(-b*x0 + a*y0) - b*c)/(a*a + b*b)   //point of ball - line segment intersection

        let dist_from_p1 = createVector(tx, ty).dist(borderLine.point1)
        let dist_from_p2 = createVector(tx, ty).dist(borderLine.point2)
        let dist_from_p1_to_p2 = borderLine.point1.dist(borderLine.point2)

        // console.log(tx, ty)
        // ellipse(tx, ty, 10, 10)

        if(d < ball.radius && dist_from_p1 + dist_from_p2 <= dist_from_p1_to_p2){

            let moving_vec = ball.vel.copy().normalize().mult(-1)
            moving_vec.setMag(ball.radius - d+1); 
            ball.pos.add(moving_vec)

            let alpha = ball.vel.copy().angleBetween(borderLine.border_vec)
            // console.log(alpha*180/PI)

            ball.vel.rotate(alpha*2)
            
            // ball.radius = 20  //for debugging
        }

    }

    stationaryState(balls){

        for(let ball of balls){
          if(ball.inHole) continue     //check only balls on board
          if(ball.isMoving()) return false
        }
      
        return true
      }

    handleHolesCollision(ball, holes){
        if(ball.inHole) return   //ball is already in hole
        for(let hole of holes){
            if(ball.pos.dist(hole.pos) < ball.radius + hole.radius){
                console.log("IN DA HOLE")
                return true
            }
        }
        return false
    }

    

    handleShapeBorderCollision(ball, borderShape){
        borderShape.forEach(border => {
            this.handleBorderCollision(ball, border)
        });
    }


}