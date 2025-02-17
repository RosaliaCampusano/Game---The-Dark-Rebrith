import { DisplaysID, SpriteID, State, Tile } from "../constants.js";
import { Display } from "../Display.js";
import Frames from "../Frames.js";
import { deleteHUD } from "../gameRender.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import Sprite from "../sprites/Sprites.js";

export default class Loading extends Display
{
    display = -1;
    init() {
        this.initLoadJoseph();
    }

    initLoadJoseph()
    {
        const imageSet = new ImageSet(0, 779, 19, 19, 19, 19, 0, 0);
        const frames = new Frames(4);

        const physics = new Physics(40);

        const loadJoseph = new Sprite(SpriteID.LOAD_JOSEPH, State.LEFT_JOSEPH, 250, 130, imageSet, frames, physics, null);
        
        globals.spriteLoading.push(loadJoseph);
    }

    destroy() {
        this.spriteLoading = [];
    }

    render() {
        deleteHUD();
        
        const canvasDividedBy2 = globals.canvas.width / 2;
        globals.ctx.textAlign = 'center';
    
        //Title
        let title = "LOADING";
    
        globals.ctx.font = '20px emulogic';
        globals.ctx.fillStyle ='white';
        globals.ctx.fillText("" + title, canvasDividedBy2 - 5, 120);
    
        for (let i = 0; i < globals.spriteLoading.length; i++)
        {
            const sprite = globals.spriteLoading[i];
    
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;
    
            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);
    
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize, sprite.imageSet.ySize
            );
        }
    }

    update() {
        for (let i = 0; i < globals.spriteLoading.length; i++)
        {
            const sprite = globals.spriteLoading[i]
            const type = sprite.id;
            switch(type)
            {
                case SpriteID.LOAD_JOSEPH:
                    this.updateLoadJoseph(sprite);
                    break;
        
                default:
                    break;
            }
        }
    }

    updateLoadJoseph(sprite)
    {
        const state = sprite.state;
        switch(state)
        {
            case State.LEFT_JOSEPH:
                sprite.physics.vx = -sprite.physics.vLimit;
                break;
    
            default:
                console.error("Error, Game State invalid");
        }
    
        sprite.xPos += sprite.physics.vx * globals.deltaTime;

        if (sprite.xPos < 150) globals.gameState = this.display;
    
        sprite.updateAnimationFrames();
    }
}