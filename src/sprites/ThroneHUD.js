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
    }

    updateAnimationFrames(){
        this.frames.frameCounter = Math.floor(globals.defaultTime / globals.time) <= this.frames.framesPerState ? Math.floor(globals.defaultTime / globals.time) : this.frames.framesPerState;
        globals.saturate = 2 - (this.frames.framesPerState + this.frames.frameCounter) / this.frames.framesPerState;
        globals.levelCrazy = (this.frames.framesPerState + this.frames.frameCounter) / this.frames.framesPerState;;
    }
}