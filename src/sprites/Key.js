import { Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import Sprite from "./Sprites.js";

export default class Key extends Sprite
{
    internalID = 0;
    isCollected = false;
    constructor(xPos, yPos, imageSet, internalID)
    {
        super(SpriteID.KEY, State.BE,
            xPos, yPos, imageSet,
            new Frames(1), null, new HitBox(15, 15, 2, 5)
        );

        this.internalID = internalID;
    }

    update() {
        if (this.isCollected){
            this.xPos = -50;
            this.yPos = -50;
        }
    }

    detectCollisionsBetweenPlayerAndSprite(player) {
        if (this.isCollected) return;

        const isOverLap = this.detectCollisionsBetweenSpriteAndSprite(player);

        if (isOverLap)
        {
            const playerAlreadyHasKey = globals.spritesKeys.some(
                k => k.isCollected && k !== this && !k.isDelivered
            );
            if (playerAlreadyHasKey) {
                globals.messageToDoor.text = "Deliver your key first";
                globals.incorrectKey = true;
                return;
            }

            globals.currentSound = Sound.KEY;
            this.isCollected = true;

            const allCollected = globals.spritesKeys.every(k => k.isCollected);
            if (allCollected) {
                player.isCollidingWithKey = true;
            } else {
                globals.messageToDoor.text = "Find more keys";
            }
        }
    }
}