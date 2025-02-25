import { Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import Sprite from "./Sprites.js";

export class Attack extends Sprite
{
    countFrameAttack = 0;
    moveSpeed = 1.8;
    left = false;
    right = false;
    top = false;
    bottom = false;
    attackDirection = null;  
    attackSpeedX = 0;  
    attackSpeedY = 0;  
    isActive = false;


    constructor()
    {
        super(
            SpriteID.ATTACK, 
            State.ACTIVE, 
            -10, -10, 
            new ImageSet(287, 258, 19, 22, 17, 19, 0, 0), 
            new Frames(1), 
            new Physics(40, 40, 0.98), 
            new HitBox(6, 6, 3, 3)
        )
    }

    update()
    {
        super.update()
       
            if (this.isActive) {
                this.updateXPos();
                this.updateYPos();
                this.countFrameAttack++;
            }

            if (this.isCollidingOrMaxCountFrameAttack()) {
                this.defaultPositionAndFrame();
            }
        }
    
        startAttack(player, direction) {
           
            if (this.isActive) return;
    
            this.isActive = true;
            this.attackDirection = direction;
            this.countFrameAttack = 0;
    
          
            this.xPos = player.xPos;
            this.yPos = player.yPos;
    
         
            switch (direction) {
                case 'left':
                    this.attackSpeedX = -this.physics.vLimit * this.moveSpeed;
                    this.attackSpeedY = 0;
                    break;
                case 'right':
                    this.attackSpeedX = this.physics.vLimit * this.moveSpeed;
                    this.attackSpeedY = 0;
                    break;
                case 'up':
                    this.attackSpeedX = 0;
                    this.attackSpeedY = -this.physics.vLimit * this.moveSpeed;
                    break;
                case 'down':
                    this.attackSpeedX = 0;
                    this.attackSpeedY = this.physics.vLimit * this.moveSpeed;
                    break;
            }
        }
    
        updateXPos() {
            this.xPos += this.attackSpeedX * globals.deltaTime;
        }
    
        updateYPos() {
            this.yPos += this.attackSpeedY * globals.deltaTime;
        }

    
    
        defaultPositionAndFrame() {
            this.countFrameAttack = 0;
            this.xPos = -10;
            this.yPos = -10;
            this.attackSpeedX = 0;
            this.attackSpeedY = 0;
            this.isActive = false;
        }
    

        isCollidingOrMaxCountFrameAttack()
        {
            return this.isCollidingWithObstacleOnTheLeft || 
            this.isCollidingWithObstacleOnTheRight || 
            this.isCollidingWithObstacleOnTheTop ||
            this.isCollidingWithObstacleOnTheBottom ||
            this.isCollidingWithSprite ||
            this.countFrameAttack === 30;
        }

    detectCollisionsBetweenSpriteAndSprite(sprite)
    {
        const isColliding = super.detectCollisionsBetweenSpriteAndSprite(sprite);
    
        sprite.isCollidingWithAttack = isColliding;

        if (sprite.id === SpriteID.GOBLIN || sprite.id === SpriteID.DEMON) 
        {
            if (sprite.isCollidingWithAttack) 
            {
              
                if (sprite.id === SpriteID.GOBLIN) globals.currentSound = Sound.GOBLIN;
                if (sprite.id === SpriteID.DEMON) globals.currentSound = Sound.DEMON;

                this.isCollidingWithSprite = sprite.isCollidingWithAttack || isColliding;
                this.isCollidingWithSprite = false;
            }
        }

        return isColliding;
    }
}