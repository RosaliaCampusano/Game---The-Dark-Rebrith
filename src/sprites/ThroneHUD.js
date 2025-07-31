import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Sprite from "./Sprites.js";

export class ThroneHUD extends Sprite
{
    constructor()
    {
        super(
            SpriteID.THRONEHUB, 
            State.MADNESS_0, 
            619, 4, 
            new ImageSet(336, 627, 83, 89, 83, 87, 0, 0),
            new Frames(5,100), null, new HitBox(0,0,0,0)
        )
    }

    update(){
        super.update()
        this.xPos = 223;
        this.yPos = 20;

        this.updateAnimationFrames()
        this.flicker()
    }

    flicker()
    {
        if (globals.isThroneFlicker)
        {
            this.imageSet.xSize = 0;
        }

        if (!this.flickerTimer)
        {
            this.flickerTimer = 0;
        }

        this.flickerTimer++;
        if (this.flickerTimer >= 10)
        {
            this.imageSet.xSize = 83;
            this.flickerTimer = 0;
        }
    }

    updateAnimationFrames()
    {  
         if (globals.isMergeWithTheThrone && globals.action.merge) 
        { 
            globals.life -= 10;
        
            if (this.frames.frameCounter < this.frames.framesPerState) 
            {
                this.frames.frameCounter++; 
                globals.isMergeWithTheThrone = false;
            }

            if (this.frames.frameCounter === 5)
            {
                globals.life -= 50;
            } 
        }

        if (globals.madnessDeleted === true && this.frames.frameCounter === 5) 
        {
            this.frames.frameCounter = 0;
            globals.isMergeWithTheThrone = false;
        }
    }
}