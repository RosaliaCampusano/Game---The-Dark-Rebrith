import { Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import Sprite from "./Sprites.js";

export default class Key extends Sprite
{
    internalID = 0;
    isCollected = false;
    isDelivered = false;
    originalPos = { xPos: 0, yPos: 0 };

    constructor(xPos, yPos, imageSet, internalID)
    {
        super(SpriteID.KEY, State.BE,
            xPos, yPos, imageSet,
            new Frames(1), null, new HitBox(15, 15, 2, 5)
        );

        this.internalID = internalID;
        this.originalPos = { xPos, yPos };
    }

    update() {
        if (this.isCollected && !this.isDelivered){
            this.xPos = -50;
            this.yPos = -50;
        }
    }

    detectCollisionsBetweenPlayerAndSprite(player) {
        if (this.isCollected) return;

        const isOverLap = this.detectCollisionsBetweenSpriteAndSprite(player);

        if (isOverLap)
        {
            const carrying = globals.spritesKeys.some(k => k.isCollected && !k.isDelivered);
            if (carrying) {
                globals.messageToDoor.text = "You carry a key already";
                globals.messageToDoor.x = this.originalPos.xPos;
                globals.messageToDoor.y = this.originalPos.yPos - 5;
                globals.messageTimer = 2.0;
                return;
            }

            globals.currentSound = Sound.KEY;
            this.isCollected = true;
        }
    }
}