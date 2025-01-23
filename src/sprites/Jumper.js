import { GRAVITY } from "../constants.js";
import globals from "../globals.js";
import { Enemies } from "./Sprites.js";

export class Jumper extends Enemies
{
    animation = true;
    update(){
        super.update();
        this.physics.ay = GRAVITY;

        // Handle group jumping logic
        this.onGroupJumpGuy();

        if (this.animation) 
        {
            // Update the animation frames
            this.updateAnimationFrames(this);
        }

        // Update the position based on the current velocity
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;

        if (this.yPos > globals.canvas.height - this.imageSet.ySize + 10) {
            this.xPos = 20;
            this.yPos = 0;
            this.physics.vy = 0;
        }
    }

    onGroupJumpGuy() 
    {
        // Check if the this is colliding with the right edge of the canvas
        if (this.yPos > globals.canvas.height - 48 - this.imageSet.ySize 
            && this.xPos < globals.canvas.width - 40 - this.imageSet.xSize)
        {
            // Set the vertical velocity to -50 and disable animation
            this.physics.vy = -50;
            this.animation = false;
        }
    
        // Check if the this is colliding with the left edge of the canvas
        if (this.yPos > globals.canvas.height - 48 - this.imageSet.ySize 
            && this.xPos > globals.canvas.width - 32 - this.imageSet.xSize)
        {
            // Enable this.animation
            this.animation = true;
        }
    
        // Check if the this is colliding with the right obstacle
        if (this.xPos > 48 - this.imageSet.xSize 
            && this.isCollidingWithObstacleOnTheRight
            && this.xPos < globals.canvas.width - 48 - this.imageSet.xSize)
        {
            // Set the vertical velocity to -50
            this.physics.vy = -50;
        }
    
        // Check if the this is colliding with the bottom obstacle
        if (this.isCollidingWithObstacleOnTheBottom) 
        {
            // Set the vertical velocity to -50 and disable this.animation
            this.physics.vy = -50;
            this.animation = false;
        } else
        {
            // Set the horizontal velocity to 56 and update the vertical velocity with gravity
            this.physics.vx = 56;
            this.physics.vy += this.physics.ay * globals.deltaTime * 0.8;
        }
    }
}