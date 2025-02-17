import { DisplaysID, SpriteID, State, Tile } from "../constants.js";
import { Display } from "../Display.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";
import Sprite from "../sprites/Sprites.js";

export default class Story extends Display
{

    state = {
        currentLine: 0,  
        currentChar: 0, 
        story: [
            "Joseph's delusions have only been increasing,",
            "his obsession with the cursed throne",
            "is consuming his soul.",
            "He swears that every evening goblins are after",
            "the throne and he has to stop them",
            "and the strange shadows that appear",
            "to mug him in the course of the night.",
            "His only salvation is the dawn",
            "where it seems to be the only moment of calm."
        ],
        lineSpacing: 15,
        baseY: 85,
        timer: 0,
        delayBetweenLines: 3,  
        delayBetweenChars: 3,  
        maxLinesVisible: 9,
        eventListenerAdded: false
    }

    init() {
        this.initBackgroundStory();
    }

    initBackgroundStory()
    {
        const imageSet = new ImageSet(1382, 5, 344, 265, 344, 290, 0, 0);
        const frames = new Frames(1);
    
        const backgroundStory = new Sprite(SpriteID.BACKGROUND_STORY, State.BE, 0, 0, imageSet, frames);
    
        globals.spriteStory.push(backgroundStory);
    }

    destroy() {
        this.state.currentLine = 0;
        this.state.timer = 0;
        globals.spriteStory = [];
    }

    render() {
        globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
        
        for (let i = 0; i < globals.spriteStory.length; i++) {
            const sprite = globals.spriteStory[i];
    
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;
    
            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);
    
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize * 1.5, sprite.imageSet.ySize
            );
        }
    
        const canvasDividedBy2 = globals.canvas.width / 2;
    
        const title = "STORY";
        globals.ctx.font = '25px emulogic';
        globals.ctx.strokeStyle = "white";
        globals.ctx.strokeText(title, canvasDividedBy2, 40);
        globals.ctx.fillStyle = "black";
        globals.ctx.fillText(title, canvasDividedBy2, 40);
    
        const chapter = "CHAPTER 1";
        globals.ctx.font = '12px emulogic';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText(chapter, canvasDividedBy2, 65);
    
        globals.ctx.textAlign = 'center';
        globals.ctx.font = '7px emulogic';
        globals.ctx.fillStyle = 'white';
    
        const visibleStart = Math.max(0, this.state.currentLine - this.state.maxLinesVisible + 1);

        for (let i = visibleStart; i <= this.state.currentLine; i++) {
            if (this.state.story[i]) { 
                const yPosition = this.state.baseY + (i - visibleStart) * this.state.lineSpacing;
                const lineText = this.state.story[i];

                const visibleText = (i < this.state.currentLine) ? lineText : lineText.substring(0, this.state.currentChar);
                globals.ctx.fillText(visibleText, canvasDividedBy2, yPosition);
            }
        }

        this.state.timer++; 

        if (this.state.timer >= this.state.delayBetweenChars && this.state.currentChar < this.state.story[this.state.currentLine]?.length) {
            this.state.currentChar++;  
            this.state.timer = 0; 
            this.state.currentLine++;
            this.state.currentChar = 0;
        }
    
        globals.ctx.fillStyle = 'gray';
        globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 49);
        globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 260);

        globals.ctx.font = '8px emulogic';
        globals.ctx.fillStyle = 'lightgray';
        globals.ctx.fillText("Press ESC to exit", canvasDividedBy2, 280);

        const handlerKeyDownStory = (event) => {
            if (event.key === 'Escape') {  
                globals.gameState = DisplaysID.MAIN_MENU;  
                this.removeKeyListener();
            }
        }
    
        if (!this.state.eventListenerAdded) {
            document.addEventListener('keydown', handlerKeyDownStory);
            this.state.eventListenerAdded = true;

            this.state.keyListener = handlerKeyDownStory;
        }
    }

    removeKeyListener() {
        if (this.state.eventListenerAdded) {
            document.removeEventListener("keydown", this.state.keyListener);
            this.state.eventListenerAdded = false;
        }
    }
}