import { Display } from "../Display.js";
import { DisplaysID, SpriteID, State, Tile } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";
import Sprite from "../sprites/Sprites.js";
import { deleteHUD } from "../gameRender.js";

export default class Win extends Display {
    internalTimer = 0;
    maxInternalTimer = 30;
    init() {
        this.initWinScreen();
    }

    initWinScreen()
    {
        const imageSet = new ImageSet(0, 1163, 407, 385, 407, 385, 0, 0);
        const frames = new Frames(1);

        const winScreen = new Sprite(SpriteID.WIN_SCREEN, State.BE, 0, 0, imageSet, frames);

        globals.spriteWinScreen.push(winScreen);
    }

    destroy() {
        globals.spriteWinScreen = [];
    }

    render() {
        deleteHUD();

        for (let i = 0; i < globals.spriteWinScreen.length; i++) {
            const sprite = globals.spriteWinScreen[i];

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

        const canvasDividedBy2 = globals.canvas.width / 2;

        const title = "YOU WIN";
        globals.ctx.font = '30px emulogic';
        globals.ctx.strokeStyle = "red";
        globals.ctx.strokeText(title, 90, 60);
        globals.ctx.fillStyle = "black";
        globals.ctx.fillText(title, 91, 60);

        globals.ctx.textAlign = 'center';
        globals.ctx.font = '7px emulogic';
        globals.ctx.fillStyle = 'white';

        const message = 
        [
            "Joseph awakens from his nightmare",
            "disoriented but with the feeling",
            "that something has changed.",
            "The curse of the throne has been destroyed",
            "for now.",
            "Dawn begins to break, but a new challenge",
            "lurks in the shadows.",
            " Will he finally escape his own illusions,",
            " or Will the cycle start again?",
        ]

        let yCoordinate = 90;

        for (let i = 0; i < message.length; i++)
        {
            globals.ctx.fillText(message[i], canvasDividedBy2, yCoordinate);

            yCoordinate += 22;
        }        
    }

    update() {

        if (this.internalTimer < this.maxInternalTimer) this.internalTimer += 1 * globals.deltaTime;
        else globals.gameState = DisplaysID.MAIN_MENU
    }
}