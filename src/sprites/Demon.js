import { Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import { Enemies } from "./Sprites.js";

export class Demon extends Enemies
{
    constructor(xPos, yPos, moveSpeed = 1)
    {
        super(
            SpriteID.DEMON, 
            State.DOWN_3, 
            xPos, yPos, 
            new ImageSet(0, 650, 64, 63, 64, 65, 0, 0), 
            new Frames(4, 5), new Physics(40), 
            Math.floor(Math.random() * 2) + 1, 
            new HitBox(30, 30, 5, 9),
            5
        );

        this.moveSpeed = moveSpeed;
    }

    update(){
        super.update()
        if (this.isDead) return;
        if (this.isCollidingWithObstacleOnTheTop) 
        {
            this.state = State.DOWN_3
        }
        else if(this.isCollidingWithObstacleOnTheBottom)
        {
            this.state = State.UP_3
        }
    
        switch (this.state)
        {
            case State.DOWN_3:
                this.physics.vx = 0;
                this.physics.vy = this.physics.vLimit * this.moveSpeed;
                break;
            
            case State.UP_3:
                this.physics.vx = 0;
                this.physics.vy = -this.physics.vLimit * this.moveSpeed;
                break;
        
            default:
                console.error("Error, Game State invalid");
        }
    
        this.yPos += this.physics.vy * globals.deltaTime;
    
        this.updateAnimationFrames();
    }
}