import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import { Enemies } from "./Sprites.js";

export class Bat extends Enemies
{
    constructor(xPos, yPos, moveSpeed = 1)
    {
        super(
            SpriteID.BAT, 
            State.LEFT_4, 
            xPos, yPos, 
            new ImageSet(512, 292, 51, 58, 47, 58, 0, 0), 
            new Frames(3, 5), new Physics(40), 
            Math.floor(Math.random() * 2) + 1, 
            new HitBox(20, 20, 0, 12),
            1
        );

        this.moveSpeed = moveSpeed;
    }
    update(){
        super.update();
        
        if (this.isDead) return;

        switch (this.state) 
        {
            case State.UP_4:
                this.physics.vx = 20 * this.moveSpeed; 
                this.physics.vy = -this.physics.vLimit * this.moveSpeed; 
                break;
            case State.DOWN_4:
                this.physics.vx = 20 * this.moveSpeed;
                this.physics.vy = this.physics.vLimit * this.moveSpeed; 
                break;
            case State.RIGHT_4:
                this.physics.vx = this.physics.vLimit * this.moveSpeed; 
                this.physics.vy = 20 * this.moveSpeed; 
                break;
            case State.LEFT_4:
                this.physics.vx = -this.physics.vLimit * this.moveSpeed; 
                this.physics.vy = 20 * this.moveSpeed; 
                break;
            default:
                console.error("Error, Game State invalid");
                return;
        }

        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;

        this.updateAnimationFrames();
        this.updateDirectionRandom();

        const isCollision = this.calculateCollisionWithBorders();
        if (isCollision)
        {
            this.adjustPositionAfterCollision();
            this.swapDirectionBat();
        }
    }

    swapDirectionBat()
    {
        const directions = [State.UP_4, State.DOWN_4, State.LEFT_4, State.RIGHT_4];
    
        const randomIndex = Math.floor(Math.random() * directions.length);
    
        this.state = directions[randomIndex];
    
    }
}