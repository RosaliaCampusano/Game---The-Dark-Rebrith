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
        { xPos: 230, yPos: 110 },
        { xPos: 310, yPos: 100 },
        { xPos: 250, yPos: 190 },
        { xPos: 69, yPos: 69 },
        { xPos: 432, yPos: 27 },
        { xPos: 576, yPos: 35 },
        { xPos: 691, yPos: 152 },
        { xPos: 599, yPos: 160 },
    ];

    changePosition = false;

    countChangePlayer = 1;
    previousPlayer = null;
    previousPlayerPosition = { xPos: 0, yPos: 0 };
    previousAttackState = false;
    mergeTimer = 0;
    mergeDuration = 700; 
    isMerged = false;

    update()
    {
        super.update();
        
        if (this.changePosition) 
        {
        
            const randomIndex = Math.floor(Math.random() * this.thronePositions.length);
            const newPosition = this.thronePositions[randomIndex];
            this.xPos = newPosition.xPos;
            this.yPos = newPosition.yPos;

            this.changePosition = false;
        }

        if (this.isMerged) {
            this.mergeTimer++;
            if (this.mergeTimer >= this.mergeDuration) {
                this.restorePreviousPlayer();
                globals.isThroneFlicker = false;
            } else {
                if (this.mergeTimer + 50 >= this.mergeDuration)
                {
                    globals.isThroneFlicker = true;
                }
                this.previousPlayerPosition = { 
                    xPos: globals.activedPlayer.xPos, 
                    yPos: globals.activedPlayer.yPos 
                }; 
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
        if (this.focusPlayer && globals.action.merge && this.countChangePlayer == 1 && globals.activedPlayer.id == SpriteID.PLAYER)
        {
            globals.isMergeWithTheThrone = true;
            this.countChangePlayer++;
            this.previousPlayer = globals.activedPlayer; 
            this.previousPlayerPosition = { xPos: player.xPos, yPos: player.yPos }; 
            this.previousAttackState = player.isAttacking || false; 
            player.isAttacking = false; 

            while (true) {
                const randomNumber = Math.floor(Math.random() * globals.spritesPlayers.length);
                const newActivedPlayer = globals.spritesPlayers[randomNumber];

                if (player.id !== newActivedPlayer.id) {
                    newActivedPlayer.xPos = player.xPos;
                    newActivedPlayer.yPos = player.yPos;
                    globals.activedPlayer = newActivedPlayer;
                    this.changePosition = true;

                    globals.isPlayerActive = true;

                    this.isMerged = true;
                    this.mergeTimer = 0;

                    break;
                }
            }
        }

        if (this.blurPlayer) {
            this.countChangePlayer = 1;
        }
    }
    
    restorePreviousPlayer() {
        if (this.previousPlayer) {
            this.previousPlayer.xPos = this.previousPlayerPosition.xPos;
            this.previousPlayer.yPos = this.previousPlayerPosition.yPos;
            this.previousPlayer.isAttacking = this.previousAttackState;
            globals.activedPlayer = this.previousPlayer;
            this.previousPlayer = null;
            this.isMerged = false;
            this.mergeTimer = 0;
            globals.isPlayerActive = false;
        }
    }
}