import globals from "./globals.js";
import {Game, SpriteID} from "./constants.js";
import { Tile } from "./constants.js";

export default function render()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            //Draw loading spinner
            break;

        case Game.PLAYING:
            drawGame();
            break;

        default: 
        console.error("Error: Game State invalid");

    }
}

function drawGame()
{
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);
    renderMap();

    renderHUD();
    renderSprites();

}



    function renderSpritesHUD()
    {
        for ( let i = 0; i < globals.spritesHUD.length; i++)
        {

            const sprite = globals.spritesHUD[i];
            //Calculate the position in the TileMap to draw
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);

            //Draw the new frame of sprite in the right position
            globals.ctxHUD.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize, sprite.imageSet.ySize
            );
        }
    }
    
    function renderSprites()
    {
        for ( let i = 0; i < globals.sprites.length; i++)
        {

            const sprite = globals.sprites[i];
            //Calculate the position in the TileMap to draw
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);
            
            //Draw the new frame of sprite in the right position
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize * 0.6, sprite.imageSet.ySize * 0.6
            );
        }
    }


function renderMap()
{
    const COL_NUM = 16;
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for(let i = 0; i < num_fil; i++)
    {
        for(let j = 0; j < num_col; j++)
        {
            const xTile = Math.floor((levelData[i][j] - 1) % COL_NUM) * brickSize;
            const yTile = Math.floor((levelData[i][j] - 1) / COL_NUM) * brickSize;
            const xPos = j * brickSize;
            const yPos = i * brickSize;

            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_16],
                xTile, yTile,
                brickSize, brickSize,
                xPos, yPos,
                brickSize, brickSize
            );
        }
    }
}


function renderHUD()
{
    const score = 1500;
    const highScore = 130000;
    const time = 3000; 

    //Draw score
    globals.ctxHUD.font = '8px emulogic';
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("SCORE", 65, 57);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + score, 61, 71);

    //Draw High Score
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("HIGH SCORE", 110, 25);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + highScore, 117, 40);

    //Draw Time
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("TIME", 190, 57);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + time, 183, 71);

    //Draw Life
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("LIFE", 135, 77);

    //Draw Madness
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("MADNESS", 233, 15);

    //Draw Level
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("Level", 9, 37);

    renderSpritesHUD();

}