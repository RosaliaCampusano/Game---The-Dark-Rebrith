import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Sprite from "./Sprites.js";

const defaultPosition = {
    x: -40,
    y: -40
}

class Explotion extends Sprite
{
    constructor(id, imageSet, frames)
    {
        super(
            id, State.ACTIVE, defaultPosition.x, defaultPosition.y, 
            imageSet, frames, null, 
            new HitBox(0,0,0,0)
        )
    }

    update()
    {
        if (this.xPos === defaultPosition.x && this.yPos === defaultPosition.y) return;

        if (this.frames.frameCounter + 1 === this.frames.framesPerState)
        {
            this.xPos = defaultPosition.x;
            this.yPos = defaultPosition.y;
            this.frames.frameCounter = 0;
        }
        this.updateAnimationFrames()
    }

    getPosition(xPos, yPos)
    {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

export class BlueExplotion extends Explotion
{
    constructor()
    {
        super(
            SpriteID.BLUE_EXPLOTION, 
            new ImageSet(0, 940, 82, 85, 82, 85, 0, 0), 
            new Frames(8)
        )
    }
}

export class RedExplotion extends Explotion
{
    constructor()
    {
        super(
            SpriteID.RED_EXPLOTION, 
            new ImageSet(4, 1025, 82, 86, 82, 86, 0, 0), 
            new Frames(9, 15)
        )
    }
}