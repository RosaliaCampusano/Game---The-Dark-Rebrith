import { ParticleID, ParticleState } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";

class Particle
{
    constructor(id, state, xPos, yPos, radius, alpha, physics)
    {
        this.id =          id;
        this.state =    state;
        this.xPos =      xPos;
        this.yPos =      yPos;
        this.radius =  radius;
        this.alpha =    alpha;
        this.physics = physics;
    }
}


export class RedLight extends Particle
{
    timeToFade  = 1 * Math.random() + 1;
    fadeCounter = 0;
    imageSet = new ImageSet(0, 816, 44, 44, 22, 22, 0, 0);
    frames = new Frames(1);

    constructor (xPos, yPos, radius, alpha, physics)
    {
        super(ParticleID.RED, 
            ParticleState.ON, 
            xPos, yPos, radius, 
            alpha, physics);
    }

    update()
    {
        this.moveRender();

        this.fadeCounter += globals.deltaTime;
        
        switch(this.state)
        {
            case ParticleState.ON:
                if(this.fadeCounter > this.timeToFade)
                {
                    this.fadeCounter = 0;
                    this.state = ParticleState.FADE;
                }
                break;
            
            case ParticleState.FADE:
                this.alpha -= 0.05;
    
    
                if (this.alpha <= 0)
                {
                    this.state = ParticleState.OFF;
                }
                break;
            
            case ParticleState.OFF:
                globals.ctxHUD.globalAlpha = this.alpha;
                globals.ctxHUD.beginPath();
                globals.ctxHUD.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
                globals.ctxHUD.globalAlpha = 1;
                break;
            
            default:
                break;
        }
    
        this.physics.vx += this.physics.ax * globals.deltaTime;
        this.physics.vy += this.physics.ay * globals.deltaTime;
    
        const velModule = Math.sqrt(Math.pow(this.physics.vx , 2) + Math.pow(this.physics.vy, 2));
    
        if (velModule < 1)
        {
            this.physics.vx = 0;
            this.physics.vy = 0;
        }
    
    
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
    }

    moveRender()
    {
        const randomAngle = Math.random() * 2 * Math.PI;
        this.physics.xv = this.physics.vLimit * Math.cos(randomAngle);
        this.physics.vy = this.physics.vLimit * Math.sin(randomAngle);

        this.physics.ax = -this.physics.aLimit * Math.cos(randomAngle);
        this.physics.ay = -this.physics.aLimit * Math.sin(randomAngle);
    }
}