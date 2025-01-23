import { SpriteID, State } from "../constants.js";
import globals from "../globals.js";

export default class Sprite
{
    blurPlayer = false;
    focusPlayer = false;

    internalTimer = 0;
    isInternalTimerActive = false;
    maxInternalTimer = 10;

    moveSpeed = 1;
    
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox)
    {
        this.id =                       id;
        this.state =                 state;
        this.xPos =                   xPos;
        this.yPos =                   yPos;
        this.imageSet =           imageSet;
        this.frames =               frames;
        this.physics =             physics;
        this.hitBox =               hitBox;
        this.isCollidingWithPlayer = false;
        this.isCollidingWithSprite = false;
        this.isCollidingWithAttack = false;
        this.isCollidingWithObstacleOnTheTop =      false;
        this.isCollidingWithObstacleOnTheLeft =     false;
        this.isCollidingWithObstacleOnTheBottom =   false;
        this.isCollidingWithObstacleOnTheRight =    false;
    }

    update()
    {
        this.listenEvents();
    }

    updateAnimationFrames()
    {
        switch (this.state)
        {
            case State.STILL_UP:
            case State.STILL_LEFT:
            case State.STILL_DOWN:
            case State.STILL_RIGHT:
                // Reset the animation frames to the first frame
                this.frames.frameCounter = 0;
                this.frames.framesChangeCounter = 0;
                break;
            default:
                // Increment the animation frame counter
                this.frames.framesChangeCounter++;
                
                // If the counter has reached the speed, increment the frame counter and reset the counter
                if (this.frames.framesChangeCounter === this.frames.speed)
                {
                    this.frames.frameCounter++;
                    this.frames.framesChangeCounter = 0;
                }

                // If the frame counter has reached the number of frames per state, reset it to 0
                if (this.frames.frameCounter === this.frames.framesPerState)
                {
                    this.frames.frameCounter = 0;
                }
        }
    }

    calculateCollisionWithBorders() 
    {
        let isCollision = false;
    
        if (this.yPos + this.imageSet.ySize > globals.canvas.height) 
        {
            isCollision = true;
        }
        else if (this.yPos < 0) 
        {
            isCollision = true;
        }
        else if (this.xPos + this.imageSet.xSize > globals.canvas.width * 2) 
        {
            isCollision = true;
        }
        else if (this.xPos < 0) 
        {
            isCollision = true;
            this.xPos = 0;
        }
    
        return isCollision;
    }

    adjustPositionAfterCollision() 
    {
        if (this.xPos < 0) 
        {
            this.xPos = 0;
        } else if (this.xPos + this.imageSet.xSize > globals.canvas.width * 2) 
        {
            this.xPos = globals.canvas.width * 2 - this.imageSet.xSize - 1;
        }
        if (this.yPos < 0) 
        {
            this.yPos = 0;
        } else if (this.yPos > globals.canvas.height - this.imageSet.ySize) 
        {
            this.yPos = globals.canvas.height - this.imageSet.ySize - 1;
        }
    }

    getMapTileId(xPos, yPos)
    {
        const brickSize = globals.level.imageSet.xGridSize;
        const levelData = globals.level.data;
    
        const fil = Math.floor(yPos / brickSize);
        const col = Math.floor(xPos / brickSize);
    
        return levelData[fil][col];
    }

    isCollidingWithObstacleAt(xPos, yPos, obstacleId) {
        
        const id = this.getMapTileId(xPos, yPos);

        if (id === obstacleId)
        {
            this.interaction()
        }
        return id === obstacleId;
    }

    detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds)
    {
    
        let xPos;
        let yPos;
        let isCollidingOnPos1;
        let isCollidingOnPos2;
        let isCollidingOnPos3;
        let isCollidingOnPos4;
        let isCollidingOnPos5;
        let isCollidingOnPos6;
    
        const brickSize = globals.level.imageSet.xGridSize;
    
        
        this.isCollidingWithObstacleOnTheRight = false;
        this.isCollidingWithObstacleOnTheLeft = false;
        this.isCollidingWithObstacleOnTheTop = false;
        this.isCollidingWithObstacleOnTheBottom = false;
    

        let overlapX;
        let overlapY;
    
        if (this.physics.vx > 0) 
        {
            xPos = this.xPos + this.hitBox.xOffset + this.hitBox.xSize;
            yPos = this.yPos + this.hitBox.yOffset;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos2 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos2)
                {
                    overlapX = Math.floor(xPos) % brickSize + 1;
        
                    this.xPos -= overlapX;
                    this.isCollidingWithObstacleOnTheRight = true;
                    this.physics.vx = 0;
                }   
            }
    
            // Check for collision at the right-middle position
            xPos = this.xPos + this.hitBox.xOffset + this.hitBox.xSize;
            yPos = this.yPos + this.hitBox.yOffset + (this.hitBox.ySize / 2);
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos4 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos4)
                {
                    overlapX = Math.floor(xPos) % brickSize + 1;
        
                    this.xPos -= overlapX;
                    this.isCollidingWithObstacleOnTheRight = true;
                    this.physics.vx = 0;
                }   
            }
    
            // Check for collision at the right-bottom corner
            xPos = this.xPos + this.hitBox.xOffset + this.hitBox.xSize;
            yPos = this.yPos + this.hitBox.yOffset + this.hitBox.ySize;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos6 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos6)
                {
                    overlapX = Math.floor(xPos) % brickSize + 1;
        
                    this.xPos -= overlapX;
                    this.isCollidingWithObstacleOnTheRight = true;
                    this.physics.vx = 0;
                }   
            }
        }
    
        if (this.physics.vx < 0)
        {
            // Check for collision on the left-top corner
            xPos = this.xPos + this.hitBox.xOffset - 1;
            yPos = this.yPos + this.hitBox.yOffset - 1;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos1)
                {
                    // Calculate overlap between the this and the obstacle
                    overlapX = brickSize - Math.floor(xPos) % brickSize;
        
                    // Adjust this position and set collision flags
                    this.xPos += overlapX;
                    this.isCollidingWithObstacleOnTheLeft = true;
                    this.physics.vx = 0;
                }   
            }
    
            // Check for collision on the left-middle side
            xPos = this.xPos + this.hitBox.xOffset - 1;
            yPos = this.yPos + this.hitBox.yOffset - 1 + (this.hitBox.ySize / 2);
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos3 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos3)
                {
                    // Calculate overlap between the this and the obstacle
                    overlapX = brickSize - Math.floor(xPos) % brickSize;
        
                    // Adjust this position and set collision flags
                    this.xPos += overlapX;
                    this.isCollidingWithObstacleOnTheLeft = true;
                    this.physics.vx = 0;
                }   
            }
    
            // Check for collision on the left-bottom corner
            xPos = this.xPos + this.hitBox.xOffset - 1;
            yPos = this.yPos + this.hitBox.yOffset - 1 + this.hitBox.ySize;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos5 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos5)
                {
                    // Calculate overlap between the this and the obstacle
                    overlapX = brickSize - Math.floor(xPos) % brickSize;
        
                    // Adjust this position and set collision flags
                    this.xPos += overlapX;
                    this.isCollidingWithObstacleOnTheLeft = true;
                    this.physics.vx = 0;
                }   
            }        
        }
    
        if (this.physics.vy < 0) // Movement to the top
        {
            // Check for collision on the top-left corner
            xPos = this.xPos + this.hitBox.xOffset - 1;
            yPos = this.yPos + this.hitBox.yOffset - 1;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos1 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos1)
                {
                    // Calculate overlap between the this and the obstacle
                    overlapY = brickSize - Math.floor(yPos) % brickSize;
                    // Adjust this position and set collision flags
                    this.yPos += overlapY;
                    this.isCollidingWithObstacleOnTheTop = true;
                    this.physics.vy = 0;
                }   
            }
    
            // Check for collision on the top-right corner
            xPos = this.xPos + this.hitBox.xOffset - 1 + this.hitBox.xSize;
            yPos = this.yPos + this.hitBox.yOffset - 1;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                isCollidingOnPos2 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos2)
                {
                    // Calculate overlap between the this and the obstacle
                    overlapY = brickSize - Math.floor(yPos) % brickSize;
                    // Adjust this position and set collision flags
                    this.yPos += overlapY;
                    this.isCollidingWithObstacleOnTheTop = true;
                    this.physics.vy = 0;
                }   
            }
        }
    
        if (this.physics.vy > 0) // Movement to the down
        {
            // Check for collision on the bottom-left corner
            xPos = this.xPos + this.hitBox.xOffset;
            yPos = this.yPos + this.hitBox.yOffset + this.hitBox.ySize;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                // Check if the this is colliding with the obstacle at the current position
                isCollidingOnPos5 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos5)
                {
                    // Calculate the overlap between the this and the obstacle
                    overlapY = Math.floor(yPos) % brickSize + 1;
        
                    // Adjust the this's position and set the appropriate flags
                    this.yPos -= overlapY;
                    this.isCollidingWithObstacleOnTheBottom = true;
                    this.physics.vy = 0;
                }   
            }
    
            // Check for collision on the bottom-right corner
            xPos = this.xPos + this.hitBox.xOffset + this.hitBox.xSize;
            yPos = this.yPos + this.hitBox.yOffset + this.hitBox.ySize;
    
            for (let i = 0; i < obstaclesIds.length; i++)
            {
                // Check if the this is colliding with the obstacle at the current position
                isCollidingOnPos6 = this.isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
                if (isCollidingOnPos6)
                {
                    // Calculate the overlap between the this and the obstacle
                    overlapY = Math.floor(yPos) % brickSize + 1;
        
                    // Adjust the this's position and set the appropriate flags
                    this.yPos -= overlapY;
                    this.isCollidingWithObstacleOnTheBottom = true;
                    this.physics.vy = 0;
                }   
            }
        }
    }

    interaction()
    {
        if(this.id === SpriteID.PLAYER || this.id === SpriteID.PLAYER_WIZARD || this.id === SpriteID.THRONE || this.id === SpriteID.POTION)
        {
            return;
        } 
        this.hitBox.color = "blue"
        setTimeout(() => {this.hitBox.color = this.hitBox.defaultColor}, 1);
    }

    detectCollisionsBetweenSpriteAndSprite(sprite)
    {   
        // Check if the sprite is the sprite itself
        if (this.id === sprite.id)
        {
            return;
        }

        // Check if the sprite is overlapping with the sprite
        const x1 = sprite.xPos + sprite.hitBox.xOffset;
        const y1 = sprite.yPos + sprite.hitBox.yOffset;
        const w1 = sprite.hitBox.xSize;
        const h1 = sprite.hitBox.ySize;

        const x2 = this.xPos + this.hitBox.xOffset;
        const y2 = this.yPos + this.hitBox.yOffset;
        const w2 = this.hitBox.xSize;
        const h2 = this.hitBox.ySize;

        // const isOverLap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);
        const isOverLap = this.rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

        if (isOverLap)
        {
            this.interaction()
            sprite.interaction()
        }     

        return isOverLap
    }

    detectCollisionsBetweenPlayerAndSprite(player)
    {

        const isOverLap = this.detectCollisionsBetweenSpriteAndSprite(player);

        if (isOverLap)
        {
            this.isCollidingWithPlayer = true;
            player.interaction()
        }
        else
        {
            this.isCollidingWithPlayer = false;
            // player.isCollidingWithSprite = false;
        }
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
    {
        let isOverlap;
        
        // check x and y for overlap
        if(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
        {
            // if any of the conditions are true, it means the rectangles don't overlap
            isOverlap = false;
        }
        else 
            // if none of the conditions are true, it means the rectangles do overlap
            isOverlap = true;

        return isOverlap;
    }

    listenEvents(){
        if (this.isCollidingWithPlayer) 
        {
            this.focusPlayer = true;
            this.blurPlayer = false;
        }

        if (this.blurPlayer && !this.isCollidingWithPlayer) {
            this.blurPlayer = false;
        }

        if (this.focusPlayer && !this.isCollidingWithPlayer)
        {
            this.focusPlayer = false;
            this.blurPlayer = true;
        }

        if (this.internalTimer >= this.maxInternalTimer)
        {
            this.internalTimer = 0;
            this.isInternalTimerActive = false;
        }

        if (this.internalTimer <= this.maxInternalTimer)
        {
            this.internalTimer += globals.deltaTime;
            this.isInternalTimerActive = true;
        }
    }
}

export class Enemies extends Sprite
{
    redExplotion;
    constructor(id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection, hitBox, life = 1)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);

        this.defaultImageSetXSize = imageSet.xSize;
        this.defaultImageSetYSize = imageSet.ySize;
        this.defaultHitBoxXSize = hitBox.xSize;
        this.defaultHitBoxYSize = hitBox.ySize;
        this.life = life;
        this.scorePerKill = life * 100;
        this.defaultLife = life;
        this.isDead = false;
        this.directionChangeCounter = 0;       
        this.maxTimeToChangeDirection = maxTimeToChangeDirection;
    }

    update()
    {
        super.update();
        if (this.isDead)
        {
            this.dead();
            if (this.internalTimer >= this.maxInternalTimer)
            {
                this.revive();
            }else
            {
                return;
            }
        }

        for (let index = 0; index < globals.sprites.length; index++) 
        {
            const sprite = globals.sprites[index];
            if (sprite.id == SpriteID.RED_EXPLOTION) 
            {
                this.redExplotion = sprite
                this.redExplotion.update();
            }
        }

        if (this.isCollidingWithPlayer) {
            globals.life--;
        }

        if (this.isCollidingWithAttack && this.life > 0)
        {
            this.life--;
        }

        if (this.life === 0)
        {
            this.isDead = true;
            globals.score += this.scorePerKill;
            this.redExplotion.getPosition(this.xPos, this.yPos);
        }

        // random movement speed
        if (this.internalTimer >= this.maxInternalTimer)
        {
            let randomNumber = Math.floor(Math.random() * this.life) + 1;

            if (randomNumber > this.life / 2) return;

            this.moveSpeed += randomNumber;

            setTimeout(() => {
                this.moveSpeed -= randomNumber
            }, randomNumber * 1000);
        }
    }

    updateDirectionRandom()
    {
        this.directionChangeCounter += globals.deltaTime;
    
        if (this.directionChangeCounter > this.maxTimeToChangeDirection)
        {
            this.directionChangeCounter = 0;
            this.maxTimeToChangeDirection = Math.floor(Math.random() * 8) + 1;
        }
    }

    dead()
    {
        this.imageSet.xSize = 0;
        this.imageSet.ySize = 0;
        this.hitBox.xSize = 0;
        this.hitBox.ySize = 0;
    }

    revive()
    {
        this.imageSet.xSize = this.defaultImageSetXSize;
        this.imageSet.ySize = this.defaultImageSetYSize;
        this.hitBox.xSize = this.defaultHitBoxXSize;
        this.hitBox.ySize = this.defaultHitBoxYSize;
        this.isDead = false;
        this.life = this.defaultLife;
    }
}