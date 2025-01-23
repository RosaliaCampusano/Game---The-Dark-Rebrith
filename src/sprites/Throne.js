import { SpriteID } from "../constants.js";
import globals from "../globals.js";
import Sprite from "./Sprites.js";

export class Throne extends Sprite
{
    thronePositions = [
        { xPos: 75, yPos: 180 },
        { xPos: 20, yPos: 20 },
        { xPos: 150, yPos: 170 },
        { xPos: 100, yPos: 50 },
        { xPos: 205, yPos: 20 },
        { xPos: 230, yPos: 110 },
        { xPos: 310, yPos: 100 },
        { xPos: 230, yPos: 20 },
        { xPos: 250, yPos: 190 },
        { xPos: 69, yPos: 69 },
        { xPos: 432, yPos: 27 },
        { xPos: 576, yPos: 35 },
        { xPos: 691, yPos: 152 },
        { xPos: 599, yPos: 160 },
    ];

    throneHUB;

    changePosition = false;
    
    maxInternalTimer = 7;

    countChangePlayer = 1;

    update()
    {
        super.update();

        this.getThroneHUB();
        
        if (this.internalTimer >= this.maxInternalTimer || this.changePosition) 
        {
        
            const randomIndex = Math.floor(Math.random() * this.thronePositions.length);
            const newPosition = this.thronePositions[randomIndex];
            this.xPos = newPosition.xPos;
            this.yPos = newPosition.yPos;

            this.changePosition = false;
        }
    }

    getThroneHUB()
    {
        for (let index = 0; index < globals.spritesHUD.length; index++) 
        {
            const sprite = globals.spritesHUD[index];
            if (sprite.id == SpriteID.THRONEHUB) 
            {
                this.throneHUB = sprite;
            }
        }
    }

    detectCollisionsBetweenPlayerAndSprite(player)
    {
        const isOverLap = super.detectCollisionsBetweenPlayerAndSprite(player);
        
        this.event(player);
        
        return isOverLap;
    }

    event(player)
    {
        if (this.focusPlayer && globals.action.merge && this.countChangePlayer == 1)
        {
            this.countChangePlayer++
            while (true) {
                const randomNumber = Math.floor(Math.random() * globals.spritesPlayers.length);
                const newActivedPlayer = globals.spritesPlayers[randomNumber]
                const xPos = globals.activedPlayer.xPos;
                const yPos = globals.activedPlayer.yPos;
    
                if (player.id != newActivedPlayer.id)
                {
                    newActivedPlayer.xPos = xPos;
                    newActivedPlayer.yPos = yPos;
                    globals.activedPlayer = newActivedPlayer;
                    this.changePosition = true;
                    console.log(this.throneHUB)
                    this.throneHUB.animate = true;
                    break;
                }
            }
        }

        if (this.blurPlayer){

            this.countChangePlayer = 1;
        }
    }
}