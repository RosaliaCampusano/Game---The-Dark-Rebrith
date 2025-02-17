import { Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import Sprite from "./Sprites.js";

export default class Key extends Sprite
{
    internalID = 0;
    constructor(xPos, yPos, imageSet, internalID)
    {
        super(SpriteID.KEY, State.BE, 
            xPos, yPos, imageSet, 
            new Frames(1), null, new HitBox(40, 40, 0, 0)
        );

        this.internalID = internalID;
    }

    update() {
        if (this.isCollidingWithPlayer){
            this.xPos = -50;
            this.yPos = -50;
        }
    }

    detectCollisionsBetweenPlayerAndSprite(player) {
        const isOverLap = this.detectCollisionsBetweenSpriteAndSprite(player);

        if (isOverLap)
        {
            globals.currentSound = Sound.KEY;
            this.isCollidingWithPlayer = true;
            if (this.internalID === globals.activedKey.internalID) 
            {
                globals.messageToDoor.text = "You found a key";
                player.isCollidingWithKey = true;
            }else
            {
                globals.messageToDoor.text = "The door is locked";
            }
        }
        else
        {
            this.isCollidingWithPlayer = false;
        }
    }
}