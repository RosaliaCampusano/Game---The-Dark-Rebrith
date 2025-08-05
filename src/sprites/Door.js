import { Game, Sound, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import { initSprites } from "../initialize.js";
import Sprite from "./Sprites.js";

export default class Door extends Sprite
{
    constructor(xPos, yPos)
    {
        super(SpriteID.DOOR, State.BE, 
            xPos, yPos, 
            new ImageSet(409, 1126, 34, 45, 34, 45, 0, 0), 
            new Frames(1), null, new HitBox(70, 95, 0, 0)
        );
    }

    update() {

        if (globals.fase[0]==2){
            // 746 204
            this.xPos = 746;
            this.yPos = 204;
        }

        if (this.isCollidingWithPlayer){
            this.updateFase()

            globals.activedPlayer.isCollidingWithKey = false;
        }

        globals.messageToDoor.x = this.xPos - 15;
        globals.messageToDoor.y = this.yPos;
    }

    updateFase(){
        if (globals.counterFase === 4) {
            globals.counterFase = 0;
            globals.fase = [1, 1];
            globals.level = globals.levels[0];
            globals.isDark = false;
            // globals.activedPlayer.xPos = 100;
            // globals.activedPlayer.yPos = 10;

            globals.gameState = Game.LOAD_PLAYING;
            return;
        }

        if (globals.fase[1] === 1) {
            globals.fase[1] = 2;
            globals.counterFase++
            globals.isDark = true
            globals.activedPlayer.xPos = 100
            globals.activedPlayer.yPos = 10

            let player = null;
            let playerWizard = null;
            for (let index = 0; index < globals.sprites.length; index++) {
                const sprite = globals.sprites[index];
                if (sprite.id === SpriteID.PLAYER) {
                    player = sprite;
                }

                if (sprite.id === SpriteID.PLAYER_WIZARD) {
                    playerWizard = sprite;
                }
            }

            globals.sprites = []

            globals.sprites.push(player, playerWizard)

            globals.activedPlayer.xPos = 100
            globals.activedPlayer.yPos = 10

            initSprites()

        } else if (globals.fase[1] === 2 && globals.fase[0] === 1) {
            globals.fase[0] = 2;
            globals.fase[1] = 1;
            globals.counterFase++;
            globals.isDark = false;

            globals.level = globals.levels[1]

            let player = null;
            let playerWizard = null;
            for (let index = 0; index < globals.sprites.length; index++) {
                const sprite = globals.sprites[index];
                if (sprite.id === SpriteID.PLAYER) {
                    player = sprite;
                }

                if (sprite.id === SpriteID.PLAYER_WIZARD) {
                    playerWizard = sprite;
                }
            }

            globals.sprites = []

            globals.sprites.push(player, playerWizard)

            globals.activedPlayer.xPos = 100
            globals.activedPlayer.yPos = 10

            initSprites()
        }
    }

    detectCollisionsBetweenPlayerAndSprite(player) {
        const isOverLap = this.detectCollisionsBetweenSpriteAndSprite(player);

        if (isOverLap)
        {
            if (player.isCollidingWithKey)
            {
                this.isCollidingWithPlayer = true;
            } else 
            {
                globals.currentSound = Sound.LOCKED_DOOR;
                globals.incorrectKey = true;
            }
        }
        else
        {
            this.isCollidingWithPlayer = false;
        }
    }
}