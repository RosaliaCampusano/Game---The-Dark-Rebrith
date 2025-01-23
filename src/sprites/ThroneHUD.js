import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Sprite from "./Sprites.js";

export class ThroneHUD extends Sprite
{
    animate = false;
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

        if (this.animate)
        {
            this.updateAnimationFrames()
        }
    }

    updateAnimationFrames(){
        this.frames.framesChangeCounter++;
    
        if (this.frames.framesChangeCounter === this.frames.speed)
        {
            this.frames.frameCounter++;
            this.frames.framesChangeCounter = 0;
        }

        if (this.frames.frameCounter === this.frames.framesPerState)
        {
            this.frames.frameCounter = 0;
            this.animate = false;
        }
    }
}