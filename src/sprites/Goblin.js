import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import { Enemies } from "./Sprites.js";

export class Goblin extends Enemies
{
    counterLeftCollision = 0;
    counterRightCollision = 0;
    counterTopCollision = 0;
    counterBottomCollision = 0;
    multiplierMovement;

    constructor(xPos, yPos, moveSpeed = 1, multiplierMovement = true)
    {
        super(
            SpriteID.GOBLIN, 
            State.LEFT_2, 
            xPos, yPos, 
            new ImageSet(0, 6, 57, 56, 57, 59, 0, 0), 
            new Frames(4, 5), new Physics(40), 
            Math.floor(Math.random() * 2) + 1, 
            new HitBox(15, 30, 8, 2),
            2
        );

        this.moveSpeed = moveSpeed;
        this.multiplierMovement = multiplierMovement;
    }
    update(){
        super.update();
        if (this.isDead) {
            return;
        }
        if (this.isCollidingWithObstacleOnTheLeft) 
        {
            this.state = State.RIGHT_2
            this.counterLeftCollision++;
        }
        else if(this.isCollidingWithObstacleOnTheRight)
        {
            this.state = State.LEFT_2
            this.counterRightCollision++;
        }
        else if (this.isCollidingWithObstacleOnTheTop) 
        {
            this.state = State.DOWN_2
            this.counterTopCollision++;
        }
        else if(this.isCollidingWithObstacleOnTheBottom)
        {
            this.state = State.UP_2
            this.counterBottomCollision++;
        }
    
        switch (this.state)
        {
            case State.RIGHT_2:
                this.physics.vx = this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;
    
            case State.LEFT_2:
                this.physics.vx = -this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;
            
            case State.DOWN_2:
                this.physics.vx = 0;
                this.physics.vy = this.physics.vLimit * this.moveSpeed;
                break;
    
            case State.UP_2:
                this.physics.vx = 0;
                this.physics.vy = -this.physics.vLimit * this.moveSpeed;
                break;
    
            default:
                console.error("Error, Game State invalid");
        }
    
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
    
        this.updateAnimationFrames();

        if(this.multiplierMovement)
        {
            this.changeDirection();
        }
    }

    changeDirection()
    {
        if(this.counterLeftCollision == 2)
        {
            this.state = State.UP_2;
            this.counterLeftCollision = 0;
        }
        else if(this.counterRightCollision == 2)
        {
            this.state = State.DOWN_2;
            this.counterRightCollision = 0;
        }
        else if(this.counterTopCollision == 2)
        {
            this.state = State.RIGHT_2;
            this.counterTopCollision = 0;
        }
        else if(this.counterBottomCollision == 2)
        {
            this.state = State.LEFT_2;
            this.counterBottomCollision = 0;
        }
    }
}