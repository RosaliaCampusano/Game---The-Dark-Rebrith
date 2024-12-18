import globals from "./globals.js";
import {Game, SpriteID, MainMenuTexts, WayOut} from "./constants.js";
import { Tile } from "./constants.js";

export default function render()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            //Draw loading spinner
            break;

        case Game.MAIN_MENU: 
            drawMainMenu();
            break;

        case Game.PLAYING:
            drawGame();
            break;

        case Game.CONTROLS:
            drawControls();
            break;

        case Game.HIGHSCORE:
            renderHihgscore();
            break;
        
        case Game.STORY:
            renderStory();
            break;
        
        case Game.OVER:
            renderGameOver();
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

function drawMainMenu()
{
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    renderMainMenu();
}

function drawControls()
{
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    renderControls();
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

    //Draw score
    globals.ctxHUD.font = '8px emulogic';
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("SCORE", 58, 70);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + score, 55, 85);

    //Draw High Score
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("HIGH SCORE", 95, 32);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + highScore, 97, 50);


    //Draw Life
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("LIFE", 169, 70);

    //Draw Madness
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("MADNESS", 233, 15);

    //Draw Level
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("Level", 5, 32);


    renderSpritesHUD();

}

function deleteHUDAndClearScreen()
{
    
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    const canvasHeight = 200;
    const canvasHUDHeight = 80;

    globals.canvasHUD.style.display = 'none';
    globals.canvas.style.height = 'auto';
    globals.canvas.height = canvasHeight + canvasHUDHeight;
}

function renderMainMenu()
{
    deleteHUDAndClearScreen();

    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';

    //Title
    let title = "THE DARK REBIRTH";

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle ='darkred';
    globals.ctx.fillText("" + title, canvasDividedBy2, 85);

    //Design
    globals.ctx.font = '12px emulogic';
    globals.ctx.fillStyle ='white';
    globals.ctx.fillText("-----------------------------", canvasDividedBy2, 45);
    globals.ctx.fillText("-----------------------------", canvasDividedBy2, 250);

    let yCoordinate = 130;
    

    for (let i = 0; i < MainMenuTexts.length; i++)
    {
        globals.ctx.fillText(MainMenuTexts[i], canvasDividedBy2, yCoordinate);

        yCoordinate += 25;
    }

    for ( let j = 0; j < globals.spriteMenu.length; j++)
        {

            const sprite = globals.spriteMenu[j];
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
                sprite.imageSet.xSize, sprite.imageSet.ySize
            );
        }

}

function renderHihgscore()
{
    deleteHUDAndClearScreen();
    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';
    //Title
    let highScore = "HIGHSCORE";

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle ='red';
    globals.ctx.fillText("" + highScore, canvasDividedBy2, 35);

    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText("------------------", canvasDividedBy2, 58);

    //Category
    let rankCategory = "RANK";

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle ='darkred';
    globals.ctx.textAlign = 'auto';
    globals.ctx.fillText("" + rankCategory, canvasDividedBy2 * 0.3, 100);

    ////////////////////////////
    let nameCategory = "NAME";

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle ='darkred';
    globals.ctx.textAlign = 'right';
    globals.ctx.fillText("" + nameCategory, canvasDividedBy2, 100);

    ///////////////////////////////
    let scoreCategory = "SCORE";

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle ='darkred';
    globals.ctx.textAlign = 'left';
    globals.ctx.fillText("" + scoreCategory, canvasDividedBy2 * 1.3, 100);
    
    const xPosition = globals.canvas.width * 0.2; // Left
    const xName = globals.canvas.width * 0.4;    // Center
    const xScore = globals.canvas.width * 0.8;   // Right

    //Initial Y coordinate and height between rows
    let yCoordinate = 150;
    const spaceLine = 30;

    const position = 
    [ 
        "1ST", 
        "2ND", 
        "3RD"
    ];

    const name = 
    [ 
        "AAA",
        "BBB",
        "CCC"
    ];

    const score = 
    [
        "012000",
        "009000",
        "007000"
    ];

    for (let i = 0; i < position.length; i++) {

        globals.ctx.textAlign = 'right';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText(position[i], xPosition, yCoordinate);

        globals.ctx.textAlign = 'center';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText(name[i], xName, yCoordinate);

        globals.ctx.textAlign = 'auto';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText(score[i], xScore, yCoordinate);

        yCoordinate += spaceLine;
    
    }

    ////////////
    globals.ctx.fillStyle = 'white';
    globals.ctx.textAlign = 'center'
    globals.ctx.fillText("------------------", canvasDividedBy2, 240);

    //Press ESC to exit
    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText(WayOut, canvasDividedBy2, 260);
}

function renderControls()
{

    deleteHUDAndClearScreen();


    for (let i = 0; i < globals.spriteControls.length; i ++)
    {
        const sprite = globals.spriteControls[i];

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
            sprite.imageSet.xSize * 1.5 , sprite.imageSet.ySize 
        );
    }

    const canvasDividedBy2 = globals.canvas.width / 2.1;
    globals.ctx.textAlign = 'center';

    //Title
    let title = "CONTROLS";
    globals.ctx.font = '30px emulogic';
    globals.ctx.strokeStyle = "white";
    globals.ctx.strokeText("" + title, canvasDividedBy2, 45);
    globals.ctx.fillStyle = "black"; 
    globals.ctx.fillText("" + title, canvasDividedBy2, 45);

    globals.ctx.strokeStyle = 'gray';
    globals.ctx.strokeText("-----------", canvasDividedBy2, 70);
    globals.ctx.strokeStyle = 'gray';
    globals.ctx.strokeText("-----------", canvasDividedBy2, 250);


    let movement = "MOVEMENT";
    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("" + movement, canvasDividedBy2 * 0.4, 90);


    const keyboardDefinitionControls = 
    [
        "UP",
        "LEFT",
        "DOWN",
        "RIGHT"
    ]


    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'gray';

    let yCoordinate = 120;
    let spaceLine = 30;

    for (let i = 0; i < keyboardDefinitionControls.length; i++)
    {
        globals.ctx.fillText(keyboardDefinitionControls[i], canvasDividedBy2 * 0.5, yCoordinate);
        globals.ctx.textAlign = 'auto';

        yCoordinate += spaceLine;
    }

    let attack = "ATTACK";
    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("" + attack, canvasDividedBy2 * 1.4, 90);

    let merge = "MERGE WITH THE THRONE";
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("" + merge, canvasDividedBy2 * 1.4, 165);

        //Press ESC to exit
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'lightgray';
        globals.ctx.fillText(WayOut, canvasDividedBy2, 265);
}

function renderStory()
{
    deleteHUDAndClearScreen();

    for ( let i = 0; i < globals.spriteStory.length; i++)
        {

            const sprite = globals.spriteStory[i];

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
                sprite.imageSet.xSize * 1.5 , sprite.imageSet.ySize 
            );
        }

    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';
    
    //Title
    let title = "STORY";
    globals.ctx.font = '25px emulogic';
    globals.ctx.strokeStyle = "white";
    globals.ctx.strokeText("" + title, canvasDividedBy2, 40);
    globals.ctx.fillStyle = "black"; 
    globals.ctx.fillText("" + title, canvasDividedBy2, 40);

    //Chapter
    let chapter = "CHAPTER 1";
    globals.ctx.font = '12px emulogic';
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("" + chapter, canvasDividedBy2, 65);

    //The story
    globals.ctx.font = '7px emulogic';
    globals.ctx.fillStyle = 'white';
    
    const story = 
    [
        "Joseph's delusions have only been increasing,",
        "his obsession with the cursed throne",
        "is consuming his soul.",
        "He swears that every evening goblins are after",
        "the throne and he has to stop them",
        "and the strange shadows that appear",
        "to mug him in the course of the night.",
        " His only salvation is the dawn",
        "where it seems to be the only moment of calm."
    ]


    let yCoordinate = 85;

    for (let i = 0; i < story.length; i++)
    {
        globals.ctx.fillText(story[i], canvasDividedBy2, yCoordinate);

        yCoordinate += 20;
    }

    globals.ctx.fillStyle = 'gray';
    globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 49);
    globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 260);

    //Press ESC to exit
    globals.ctx.font = '8px emulogic';
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText(WayOut, canvasDividedBy2, 270);
}

function renderGameOver()
{
    deleteHUDAndClearScreen();


    for ( let i = 0; i < globals.spriteBackground.length; i++)
        {

            const sprite = globals.spriteBackground[i];
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
                sprite.imageSet.xSize , sprite.imageSet.ySize * 1.1
            );
        }

    
    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';

    //Title
    let title = "GAME OVER";
    globals.ctx.font = '32px emulogic';
    globals.ctx.strokeStyle = "white";
    globals.ctx.strokeText("" + title, canvasDividedBy2, 45);
    globals.ctx.fillStyle = "black"; 
    globals.ctx.fillText("" + title, canvasDividedBy2, 45);

    globals.ctx.font = '7px emulogic';
    globals.ctx.fillStyle = 'white';
    const options =
    [
        "CONTINUE",
        "HIGHSCORE",
        "EXIT"
        
    ];

    let yCoordinate = 193;

    for (let i = 0; i < options.length; i++)
    {
        globals.ctx.fillText(options[i], canvasDividedBy2, yCoordinate);

        yCoordinate += 20;
    }
}