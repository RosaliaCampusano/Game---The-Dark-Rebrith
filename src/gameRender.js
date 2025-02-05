import globals from "./globals.js";
import {Game, SpriteID, MainMenuTexts, WayOut, State, ParticleState} from "./constants.js";
import { Tile } from "./constants.js";
import detectCollisions from "./collisions.js";
import { Player } from "./sprites/Player.js";
import { getletter, getCurrentIndex } from "./events.js";

export default function render()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            //Draw loading spinner
            renderLoading();
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
            renderHighscore();
            break;
        
        case Game.STORY:
            renderStory();
            break;
        
        case Game.OVER:
            renderGameOver();
            break;

        case Game.WIN:
            renderWinScreen();
            break;

        case Game.ENTER_NAME:
            renderEnterName();
            break;

        default: 
            console.error("Error: Game State invalid");
    }
}

function drawGame() 
{
    displayHUD();
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);

    // Aplicar zoom y mover la cámara
    globals.ctx.scale(globals.camera.zoom, globals.camera.zoom);
    globals.canvas.style.filter = `saturate(${globals.saturate})`;
    moveCamera();
/* 
    drawFullBlackBackground();
    createVisibilityMask(); */

    renderMap();
    renderSprites();

/*     globals.ctx.restore();  */

    renderHUD();
    /* renderParticles(); */

    restoreCamera();
}
    
function createVisibilityMask() 
{
    const ctx = globals.ctx;
    const player = globals.activedPlayer;

    if (!player || (player.id !== SpriteID.PLAYER && player.id !== SpriteID.PLAYER_WIZARD)) return;

    const radius = 50; 
    const circleX = player.xPos + player.imageSet.xSize * 0.3; 
    const circleY = player.yPos + player.imageSet.ySize * 0.3;

    ctx.save();

    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx.clip();

}

function drawFullBlackBackground() 
{
    const ctx = globals.ctx;
    const canvasWidth = globals.canvas.width;
    const canvasHeight = globals.canvas.height;

    ctx.fillStyle = "rgba(0, 0, 0, 1)"; 
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
        //drawHitBox(sprite);
    }

}

function drawHitBox(sprite)
{
    if (!sprite.hitBox) {
        console.log(`Sprite no tiene una hitBox:`, sprite);
        return; // Salir de la función si no tiene hitBox
    }

    const x1 = Math.floor(sprite.xPos) + Math.floor(sprite.hitBox.xOffset);
    const y1 = Math.floor(sprite.yPos) + Math.floor(sprite.hitBox.yOffset);
    const w1 = sprite.hitBox.xSize;
    const h1 = sprite.hitBox.ySize;

    globals.ctx.strokeStyle = sprite.hitBox.color;
    globals.ctx.strokeRect(x1, y1, w1, h1);
}

function moveCamera()
{
    const xTranslation = -globals.camera.x; 
    const yTranslation = -globals.camera.y;

    globals.ctx.translate(xTranslation, yTranslation);
}

function restoreCamera()
{
    globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderMap()
{
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for(let i = 0; i < num_fil; i++)
    {
        for(let j = 0; j < num_col; j++)
        {
            const xTile = (levelData[i][j] - 1) * brickSize;
            const yTile = 0;
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

function renderMapLevelTwo()
{
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level[1].data;

    const num_fil = levelData.length;
    const num_col = levelData[0].length;

    for(i = 0; i < num_fil; i++)
    {
        for( let j = 0; j < num_col; j++)
        {
            const xTile = (levelData[i][j] - 1) * brickSize;
            const yTile = 0;
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
    const score = globals.score;
    const highScore = globals.highScore;
    const time = globals.time;

    //Draw score
    globals.ctxHUD.font = '8px emulogic';
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("SCORE", 58, 15);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + score, 55, 33);

    //Draw High Score
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("HIGH SCORE", 130, 15);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText(" " + highScore, 145, 33);

    //Draw Life
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("LIFE", 169, 70);

    //Draw Madness
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("MADNESS", 233, 15);

    //Draw Level
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("Level", 5, 15);

 /*    // Draw Time
    globals.ctxHUD.fillStyle = 'red';
    globals.ctxHUD.fillText("TIME", 58, 70);
    globals.ctxHUD.fillStyle = 'white';
    globals.ctxHUD.fillText("" + time, 60, 88);
 */
    renderSpritesHUD();

}

function deleteHUD()
{
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    const canvasHeight = 220;
    const canvasHUDHeight = 80;

    globals.canvasHUD.style.display = 'none';
    globals.canvas.style.height = 'auto';
    globals.canvas.height = canvasHeight + canvasHUDHeight;
}

function displayHUD()
{
    const canvasHeight = 240;
    const canvasHUDHeight = 100;

    globals.canvasHUD.style.display = '';
    globals.canvas.style.height = '';
    globals.canvas.height = canvasHeight;
}

function renderLoading()
{
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

function renderParticlesForMainMenu() 
{
    const ctx = globals.ctx;
    globals.particles.forEach((particle) =>
    {
        particle.xPos += particle.physics.velocityX;
        particle.yPos += particle.physics.velocityY;

        if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
        {
            particle.physics.velocityX *= -1;  
        }
        if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
        {
            particle.physics.velocityY *= -1;  
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();

        particle.alpha += (Math.random() - 0.5) * 0.01; 
        particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
    });
    
}


function renderMainMenu() 
{
    if (!renderMainMenu.state) {
        renderMainMenu.state = {
            selectedOption: 0,
        };
    }

    const state = renderMainMenu.state;
    const options = MainMenuTexts; 
    deleteHUD();

    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';

    // Title
    let title = "THE DARK REBIRTH";
    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle = 'darkred';
    globals.ctx.fillText(title, canvasDividedBy2, 85);

    // Design
    globals.ctx.font = '12px emulogic';
    globals.ctx.fillStyle = 'white';
    globals.ctx.fillText("-----------------------------", canvasDividedBy2, 45);
    globals.ctx.fillText("-----------------------------", canvasDividedBy2, 250);

    let yCoordinate = 130;

    // Draw menu options
    for (let i = 0; i < options.length; i++) {
        globals.ctx.fillStyle = i === state.selectedOption ? "white" : "grey"; 
        globals.ctx.fillText(options[i][0], canvasDividedBy2, yCoordinate);
        yCoordinate += 25;
    }

    function handlerKeyDownMainMenu(event) {
        if (event.key === "s") {
            state.selectedOption = (state.selectedOption + 1) % options.length;
        } else if (event.key === "w") {
            state.selectedOption = (state.selectedOption - 1 + options.length) % options.length;
        } else if (event.key === "Enter") {
            handleMenuSelection(state.selectedOption);
            removeKeyListener();
        }
    }

    if (!renderMainMenu.eventListenerAdded) 
    {
        document.addEventListener("keydown", handlerKeyDownMainMenu);
        renderMainMenu.eventListenerAdded = true;
    }

    for (let j = 0; j < globals.spriteMenu.length; j++) 
    {
        const sprite = globals.spriteMenu[j];
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

    renderParticlesForMainMenu();

    function handleMenuSelection(selectedIndex) {
        const selectedOption = MainMenuTexts[selectedIndex][0];

        switch (selectedOption) {
            case "NEW GAME":
                console.log("Starting a new game...");
                globals.gameState = Game.PLAYING;
                drawGame();
                break;
            case "CONTROLS":
                console.log("Showing controls...");
                globals.gameState = Game.CONTROLS;
                renderControls();
                break;
            case "STORY":
                console.log("Showing story...");
                globals.gameState = Game.STORY;
                renderStory();
                break;
            case "HIGHSCORE":
                console.log("Showing highscore...");
                globals.gameState = Game.HIGHSCORE;
                renderHighscore();
                break;
            default:
                console.log("Unknown option selected");
                break;
        }
    }

    function removeKeyListener() {
        document.removeEventListener("keydown", handlerKeyDownMainMenu);
        renderMainMenu.eventListenerAdded = true;
    }

    function addKeyListener() {
        if (!renderMainMenu.eventListenerAdded) {
            document.addEventListener("keydown", handlerKeyDownMainMenu);
            renderMainMenu.eventListenerAdded = true;
        }
    }

    if (globals.gameState === Game.MAIN_MENU) {
        addKeyListener(); 
    }
}

function renderParticles()
{
    const ctx = globals.ctxHUD;
    globals.particles.forEach((particle) => {
        if (particle.xPos >= 50) particle.xPos = 5;
        if (particle.yPos <= 50) particle.yPos = 35 + Math.random() * 10;

        particle.xPos += particle.physics.velocityX;
        particle.yPos += particle.physics.velocityY;

        if (particle.xPos < 0 || particle.xPos > 45) 
        {
            particle.physics.velocityX *= -1;  
        }
        if (particle.yPos < 0 || particle.yPos > 10) 
        {
            particle.physics.velocityY *= -1;  
        }

        let colors = ["rgba(200, 0, 0, 0.6)", "rgba(200, 153, 0, 0.6)", "rgba(200, 63, 0, 0.6)"];

        let color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();

        particle.alpha += (Math.random() - 0.5) * 0.01; 
        particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
    });
}

function renderParticlesForHighScore() {

    const ctx = globals.ctx;
    globals.particles.forEach((particle) =>
    {
        particle.physics.velocity += 0.1; 

        particle.yPos += particle.physics.velocityY;
        
        if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
        {
            particle.xPos = Math.random() * globals.canvas.width
            particle.physics.velocityY *= -1;
            particle.physics.velocity = Math.random() * 2 + 1; 
        }

        ctx.fillStyle = `rgba(215, 0, 0, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();

        particle.alpha += (Math.random() - 0.5) * 0.01; 
        particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
    });
}

function renderHighscore()
{
    deleteHUD();

    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';

    let titleHighscore = "HIGHSCORE";
    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle = 'red';
    globals.ctx.fillText(titleHighscore, canvasDividedBy2, 40);

    const separatorLine = "------------------";
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText(separatorLine, canvasDividedBy2, 60);
    globals.ctx.fillText(separatorLine, canvasDividedBy2, 270);

    const startY = 90;
    let categoryRank = "RANK";
    let categoryName = "NAME";
    let categoryScore = "SCORE";

    globals.ctx.font = '15px emulogic';
    globals.ctx.fillStyle = 'darkred';
    globals.ctx.textAlign = 'center';
    globals.ctx.fillText(categoryRank, canvasDividedBy2 - 150, startY);
    globals.ctx.fillText(categoryName, canvasDividedBy2 - 20, startY);
    globals.ctx.fillText(categoryScore, canvasDividedBy2 + 110, startY);

    globals.ctx.font = '8px emulogic';
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText("Press ESC to exit", 200, 285);

    const posRank = canvasDividedBy2 - 150; 
    const posName = canvasDividedBy2 - 20;        
    const posScore = canvasDividedBy2 + 90;

    const lineSpacing = 15;
    const rankPositions = ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10."];
    let scoreFormat = "000000";

    if (!renderHighscore.state) {
        renderHighscore.state = {
            activeLine: 0,
            activeChar: 0,
            frameTimer: 0,
            charDelay: 3,
            lineDelay: 30
        };
    }

    const state = renderHighscore.state;
    let currentY = 110; 

    for (let i = 0; i <= state.activeLine; i++) {

        let formattedScore = scoreFormat.substr(0, scoreFormat.length - globals.historyScore[i][1].toString().length) + globals.historyScore[i][1];

        globals.ctx.font = '8px emulogic';
        globals.ctx.textAlign = 'right';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText(rankPositions[i], posRank, currentY);

        globals.ctx.textAlign = 'center';
        globals.ctx.fillStyle = 'white';
        const nameDisplay = globals.historyScore[i][0]?.substring(0, i < state.activeLine ? scoreFormat.length : state.activeChar) || "";
        globals.ctx.fillText(nameDisplay, posName, currentY);

        globals.ctx.textAlign = 'left';
        globals.ctx.fillStyle = 'white';
        const scoreDisplay = formattedScore.substring(0, i < state.activeLine ? scoreFormat.length : state.activeChar);
        globals.ctx.fillText(scoreDisplay, posScore, currentY);

        currentY += lineSpacing;
    }

    state.frameTimer++;
    if (state.frameTimer >= state.charDelay && state.activeChar < scoreFormat.length) {
        state.activeChar++;
        state.frameTimer = 0;
    }

    if (state.activeChar >= scoreFormat.length && state.activeLine < rankPositions.length - 1) {
        if (state.frameTimer >= state.lineDelay) {
            state.frameTimer = 0;
            state.activeLine++;
            state.activeChar = 0;
        }
    }

    renderParticlesForHighScore();

    function handlerKeyDownhighscore(event)
    {
        if (event.key === 'Escape') {
            globals.gameState = Game.MAIN_MENU;
            document.removeEventListener('keydown', handlerKeyDownhighscore);
        }
    }

    document.addEventListener('keydown', handlerKeyDownhighscore);
}

function renderParticleControl() 
{
    const ctx = globals.ctx;
    globals.particles.forEach((particle) =>
    {
        particle.xPos += particle.physics.velocityX;

        if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
        {
            particle.physics.velocityX *= -1;  
        }

        if (particle.radius > 5 || particle.radius < 1) 
        {
            particle.growth *= -1; 
        }
        
        particle.radius += particle.growth * 0.1;

        ctx.fillStyle = `rgba(225, 215, 250, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();

        particle.alpha += (Math.random() - 0.5) * 0.01; 
        particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
    });
}

function renderControls()
{

    deleteHUD();

    for (let i = 0; i < globals.spriteControls.length; i ++)
    {
        const sprite = globals.spriteControls[i];

        const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
        const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

        const xPos = Math.floor(sprite.xPos);
        const yPos = Math.floor(sprite.yPos);

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

        renderParticleControl();
        
        function handlerKeyDownControls(event) {
            if (event.key === 'Escape') 
            {  
                document.removeEventListener('keydown', handlerKeyDownControls); 
                globals.gameState = Game.MAIN_MENU;  
                renderMainMenu();  
                renderControls.eventListenerAdded = false;
            }
        }
        
        if (!renderControls.eventListenerAdded) 
        {
            document.addEventListener('keydown', handlerKeyDownControls);
            renderControls.eventListenerAdded = true;
        }
}

function renderStory() 
{

    if (!renderStory.state) {
        renderStory.state = {
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
        };
    }

    const state = renderStory.state;

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

    const visibleStart = Math.max(0, state.currentLine - state.maxLinesVisible + 1);

    for (let i = visibleStart; i <= state.currentLine; i++) {
        if (state.story[i]) { 
            const yPosition = state.baseY + (i - visibleStart) * state.lineSpacing;
            const lineText = state.story[i];

            const visibleText = (i < state.currentLine) ? lineText : lineText.substring(0, state.currentChar);
            globals.ctx.fillText(visibleText, canvasDividedBy2, yPosition);
        }
    }

    state.timer++; 

    if (state.timer >= state.delayBetweenChars && state.currentChar < state.story[state.currentLine]?.length) {
        state.currentChar++;  
        state.timer = 0; 
    }

    if (state.currentChar >= state.story[state.currentLine]?.length && state.currentLine < state.story.length - 1) {
        if (state.timer >= state.delayBetweenLines) {
            state.timer = 0; 
            state.currentLine++; 
            state.currentChar = 0; 
        }
    }

    globals.ctx.fillStyle = 'gray';
    globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 49);
    globals.ctx.fillText("-----------------------------------------------", canvasDividedBy2, 260);

    globals.ctx.font = '8px emulogic';
    globals.ctx.fillStyle = 'lightgray';
    globals.ctx.fillText("Press ESC to exit", canvasDividedBy2, 280);

    function handlerKeyDownStory(event) {
        if (event.key === 'Escape') {
            document.removeEventListener('keydown', handlerKeyDownStory);
            globals.gameState = Game.MAIN_MENU;
            renderMainMenu();
            renderStory.eventListenerAdded = false;
        }
    }

if (!renderStory.eventListenerAdded) {
    document.addEventListener('keydown', handlerKeyDownStory);
    renderStory.eventListenerAdded = true;
}

}

function renderParticlesForGameOver()
{

    const ctx = globals.ctx;
    globals.particles.forEach((particle) =>
    {
        if (particle.color != "rgba(100, 100, 100, 0.6)") return
        particle.yPos += particle.physics.velocityY;
        particle.xPos += particle.physics.velocityX;

        if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
        {
            particle.physics.velocityY *= -1;  
        }
        if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
        {
            particle.physics.velocityX *= -1;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
        ctx.fill();

        particle.alpha += (Math.random() - 0.5) * 0.01; 
        particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
    });
}

function renderGameOver() {

    globals.canvas.style.filter = 'none';
    globals.time = globals.defaultTime;
    globals.life = globals.maxLife;
    deleteHUD();

    if (!renderGameOver.state) 
    {
        renderGameOver.state = 
        {
            selectedOption: 0,
            options:
            [
                { text: "HIGHSCORE", state: Game.HIGHSCORE },
                { text: "EXIT", state: Game.MAIN_MENU },
            ],
        };
    }

    const state = renderGameOver.state;
    const options = state.options;


    for (let i = 0; i < globals.spriteBackground.length; i++) {
        const sprite = globals.spriteBackground[i];
        const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
        const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;

        const xPos = Math.floor(sprite.xPos);
        const yPos = Math.floor(sprite.yPos);

        globals.ctx.drawImage(
            globals.tileSets[Tile.SIZE_SPRITE],
            xTile, yTile,
            sprite.imageSet.xSize, sprite.imageSet.ySize,
            xPos, yPos,
            sprite.imageSet.xSize, sprite.imageSet.ySize * 1.1
        );
    }

    const canvasDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = 'center';

    const title = "GAME OVER";
    globals.ctx.font = '32px emulogic';
    globals.ctx.strokeStyle = "white";
    globals.ctx.strokeText(title, canvasDividedBy2, 45);
    globals.ctx.fillStyle = "black";
    globals.ctx.fillText(title, canvasDividedBy2, 45);

    const yStart = 185;
    const yStep = 30;
    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'lightgray';

    options.forEach((option, index) => {
        globals.ctx.fillStyle = index === state.selectedOption ? "grey" : "white"; // Resaltar la opción seleccionada
        globals.ctx.fillText(option.text, canvasDividedBy2, yStart + index  * yStep);
    });

    renderParticlesForGameOver();

    function handlerKeyDownGameOver(event) {
        if (event.key === "s") 
            {
            state.selectedOption = (state.selectedOption + 1) % options.length;
        } else if (event.key === "w") 
            { 
            state.selectedOption = (state.selectedOption - 1 + options.length) % options.length;
        } else if (event.key === "Enter") 
            { 
            globals.gameState = options[state.selectedOption].state;
            document.removeEventListener("keydown", handlerKeyDownGameOver);

            renderGameOver.state = undefined;
            renderGameOver.eventListenerAdded = false;
        }
    }
    
    if (!renderGameOver.eventListenerAdded) {
        document.addEventListener("keydown", handlerKeyDownGameOver);
        renderGameOver.eventListenerAdded = true;
    }
    
    if (globals.gameState === Game.GAME_OVER) {
        renderGameOver();
        requestAnimationFrame(renderGameOver); 
    }
}

function renderWinScreen()
{
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

function renderEnterName()
{
    deleteHUD();

    const x = 45;
    const y = 85;

    globals.ctx.font = '20px emulogic';
    globals.ctx.fillStyle = 'red';
    globals.ctx.fillText("ENTER YOUR NAME", x, y);

    const letter = getletter();
    const currentIndex = getCurrentIndex();

    const letterSpacing = 30; 
    const nameY = y + 90; 
    for (let i = 0; i < letter.length; i++) {
        if (i === currentIndex) {
            globals.ctx.fillStyle = 'red'; 
        } else {
            globals.ctx.fillStyle = 'white';
        }

        globals.ctx.font = '20px emulogic';
        globals.ctx.fillText(letter[i], 150 + i * letterSpacing, nameY);
    }

    globals.ctx.font = '10px emulogic';
    globals.ctx.fillStyle = 'red';
    globals.ctx.fillText("PRESS ENTER TO CONFIRM", 85, 250);

    globals.ctx.font = '30px emulogic';
    globals.ctx.fillStyle = 'gray';
    globals.ctx.fillText("---", 145, 195);

}