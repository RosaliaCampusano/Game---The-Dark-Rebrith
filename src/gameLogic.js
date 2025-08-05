import globals from "./globals.js";
import { Game, State, SpriteID, Sound, Music } from "./constants.js";
import detectCollisions from "./collisions.js";
import {updateCamera} from "./Camera.js";
import Time from "./Time.js";
import { initControls, initEnterName, initGameOver, initHighScore, initMainMenu, initPlaying, initStory, initWin } from "./initialize.js";

export default function update()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            updateLoading();
            break;
        
        case Game.PLAYING:
            playGame();
            break;
        case Game.MAIN_MENU:
            updateMainMenu(); 
            break;
        case Game.STORY:
            updateStory();
            break;
        case Game.OVER:
            updateGameOver();
            break;
        case Game.CONTROLS:
            updateControls();
            break;
        case Game.HIGHSCORE:
            updateHighScore();
            break;
        case Game.ENTER_NAME:
            updateEnterName();
            break;
        case Game.WIN:
            updateWin()
            break;
        case Game.LOAD_MAIN_MENU:
            initMainMenu();
            break;
        case Game.LOAD_PLAYING:
            initPlaying();
            break;
        case Game.LOAD_STORY:
            initStory();
            break;
        case Game.LOAD_CONTROLS:
            initControls();
            break;
        case Game.LOAD_HIGH_SCORES:
            initHighScore();
            break;
        case Game.LOAD_OVER:
            initGameOver();
            break;
        case Game.LOAD_ENTER_NAME:
            initEnterName();
            break;
        case Game.LOAD_WIN:
            initWin();
            break;
        default:
            console.error("Error: Game State invalid");

    }
}

function updateWin()
{
    for (let i = 0; i < globals.spriteWinScreen.length; i++) {

        const sprite = globals.spriteWinScreen[i];

        switch (sprite.id) {
            case SpriteID.WIN_SCREEN:
                if (sprite.internalTimer < sprite.maxInternalTimer) sprite.internalTimer += 1 * globals.deltaTime;
                else globals.gameState = Game.LOAD_MAIN_MENU;
                break;
        
            default:
                break;
        }
        
    }
}

function updateEnterName()
{
    globals.saturate = 0;
}

function updateHighScore()
{
   
    if (globals.action.esc) {
        globals.gameState = Game.LOAD_MAIN_MENU;
    }

    if (globals.playerEnterThroughMainMenu) 
    {
        if (globals.action.moveRight && globals.currentScoresPage === 1) 
        {
            globals.currentScoresPage = 2;
            globals.action.moveRight = false;
        } else if (globals.action.moveLeft && globals.currentScoresPage === 2) 
        {
            globals.currentScoresPage = 1;
            globals.action.moveLeft = false;
        }
    }
}

function updateLoading()
{
    if (globals.action.enter) {
        globals.gameState = Game.LOAD_MAIN_MENU;
        globals.action.enter = false;
    }
}
function updateGameOver()
{
    updateScreenGameOver();
}

function updateStory()
{
    updateTheStory();

    if (globals.action.esc)
    {
        globals.gameState = Game.LOAD_MAIN_MENU;
    }
}

function playGame()
{
    globals.highScore = globals.historyScore[0].score;

    if (globals.score > globals.highScore) 
    {
        globals.highScore = globals.score;
    }
    updateHUD();
    if (!globals.isPlaying) return;
    updateSprites();
    updateCamera();
    detectCollisions();
    playSound();
    updateScore();
}


function updateScore()
{
    if (globals.score === 250000)
    {
        globals.gameState = Game.LOAD_WIN;
    }
}
function playSound()
{
    if( globals.currentSound != Sound.NO_SOUND)
    {
        globals.sounds[globals.currentSound].currentTime = 0;
        globals.sounds[globals.currentSound].play();
    }

    globals.currentSound = Sound.NO_SOUND;
}


function updateControls()
{
    updateKeyboardControls();
    if (globals.action.esc)
    {
        globals.gameState = Game.LOAD_MAIN_MENU;
    }
}



function updateHealthBar(sprite)
{
    sprite.xPos = 152;
    sprite.yPos = 76;
    sprite.imageSet.xSize = globals.life;
    
    sprite.imageSet.xSize *= 0.5;

    sprite.state = State.BE;
}

function updateEmptybar(sprite)
{
    sprite.xPos = 160;
    sprite.yPos = 75;

    sprite.imageSet.xSize = 55;

    sprite.state = State.BE;
}

function resetTimer() {
    globals.timer.value = 380;
    globals.timer.timeChangeCounter = 0; 
}

function updateSunAndMoon(sprite) 
{
    const minSize = 0;
    const maxSize = 70;
    const totalTime = 380; 
    globals.timer.update(globals.deltaTime);
   
    handleTimerReset();

    if (!globals.isDark && sprite.id === SpriteID.SUN) 
    {
        sprite.imageSet.xSize = maxSize;
        sprite.state = State.SUN; 
        globals.saturate = 1;
    
        updateSunSize(sprite, minSize, maxSize, totalTime);
    } else if (globals.isDark) 
    {
        updateMoonVisibility(sprite);
    }
}

function handleTimerReset() 
{
    if (globals.isDark && !globals.hasResetTimer) 
    {
        resetTimer();
        globals.hasResetTimer = true;
    } else if (!globals.isDark) 
    {
        globals.hasResetTimer = false;
    }
}

function updateSunSize(sprite, minSize, maxSize, totalTime) 
{
    let remainingTime = Math.max(0, globals.timer.value); 
    let progress = remainingTime / totalTime; 

    let newSize = minSize + progress * (maxSize - minSize); 
    sprite.imageSet.xSize = newSize;
   

    if (progress <= 0.5) 
    {
        let darkeningProgress = (0.5 - progress) / 0.5; 
        globals.saturate = Math.max(0, 0.5 - (darkeningProgress * 0.5)); 
        globals.throne_saturation = Math.min(100, 1 + (darkeningProgress * 10));    
    }

    if (remainingTime <= 0) 
    {
        globals.gameState = Game.LOAD_ENTER_NAME;
    }
}

function updateMoonVisibility(sprite) 
{
    if (sprite.id === SpriteID.SUN) 
    {
        sprite.state = State.SUN_OFF;
    } else if (sprite.id === SpriteID.MOON) 
    {
        sprite.state = State.MOON;

        if (globals.timer.value <= 0) 
        {
            globals.gameState = Game.LOAD_ENTER_NAME;
        }
    }
}

function updateSprite(sprite)
{
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.HEALTH_BAR:
            updateHealthBar(sprite);
            break;

        case SpriteID.HEALTH_BAR_EMPTY:
            updateEmptybar(sprite);
            break;

        case SpriteID.THRONEHUB:
            sprite.update()
            break;

        case SpriteID.PLAYER:
            sprite.update();
            break;

        case SpriteID.GOBLIN:
            sprite.update();
            break;

        case SpriteID.DEMON:
            sprite.update();
            break;

        case SpriteID.THRONE:
            sprite.update();
            break;
        
        case SpriteID.POTION:
            sprite.update();
            break;

        case SpriteID.SUN:
            updateSunAndMoon(sprite);
            break;

        case SpriteID.MOON:
            updateSunAndMoon(sprite);
            break;

        /*  case SpriteID.MOON:
            updateDayNightCycle(sprite);
            break; */
        
        case SpriteID.BAT:
            sprite.update()
            break;

        case SpriteID.PLAYER_WIZARD:
            sprite.update();
            break;

        case SpriteID.JUMPGUY:
            sprite.update();
            break;
        
        case SpriteID.KEY:
            sprite.update();
            break;

        case SpriteID.DOOR:
            sprite.update();
            break;
        
        default:

            break;
    }
}

function updateSprites()
{
    for(let i = 0; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        updateSprite(sprite);
    }
}

function updateHUD()
{
    for (let i = 0; i < globals.spritesHUD.length; i++)
    {
        const sprite = globals.spritesHUD[i]
        updateSprite(sprite);
    }
}

function updateMainMenu()
{
    updateJosephs();

    globals.currentSound = Sound.SCROLL;
}

function updateSpriteMenu(sprite)
{
    
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.OLD_JOSEPH1:
            updateJoseph1(sprite);
            break;
        case SpriteID.OLD_JOSEPH2:
            updateJoseph2(sprite);
            break;
        default:

        break;
    }
}




let fallTimer = 0;

function detectCollisionsBetweenSpriteAndSprite(sprite) {

    const rightJoseph = globals.spriteMenu[0];
    const x1 = sprite.xPos + sprite.hitBox.xOffset;
    const w2 = rightJoseph.hitBox.xSize;
    const x2 = rightJoseph.xPos + rightJoseph.hitBox.xOffset + w2;

    const isOverLap = rectIntersect(x1, x2);

    if (isOverLap && rightJoseph.state !== State.FALL_RIGHT_JOSEPH) 
    {
        rightJoseph.state = State.FALL_RIGHT_JOSEPH;
        sprite.state = State.FALL_LEFT_JOSEPH;
        fallTimer = 1; 
    }
    return isOverLap;
}

function updateFallTimer() {
    if (fallTimer > 0) {
        fallTimer -= globals.deltaTime; 
    
        if (fallTimer <= 0) 
        {
            const rightJoseph = globals.spriteMenu[0];
            const leftJoseph = globals.spriteMenu[1];
            leftJoseph.state = State.LEFT_JOSEPH;
            rightJoseph.state = State.RIGHT_JOSEPH;
            rightJoseph.frames.frameCounter = 0;
            leftJoseph.frames.frameCounter = 0;
            rightJoseph.xPos = 40;
            leftJoseph.xPos = 340;
        }
    }
}

function rectIntersect(x1, x2) {
    let isOverlap;
    
    if((x2 > x1) || (x1 < x2))
    {
        isOverlap = true;
    }
    else 
    {
        isOverlap = false;
    }
    return isOverlap;
}

function updateJoseph1(sprite) 
{
    switch (sprite.state) 
    {
        case State.RIGHT_JOSEPH:
            sprite.physics.vx = sprite.physics.vLimit;
            break;

        case State.FALL_RIGHT_JOSEPH:
            sprite.physics.vx = 0;
            break;

        default:
            console.error("Error, Game State invalid");
    }

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    
    updateAnimationFrames(sprite);

}

function updateJoseph2(sprite) 
{
    switch (sprite.state) 
    {
        case State.LEFT_JOSEPH:
            sprite.physics.vx = -sprite.physics.vLimit;
            break;

        case State.FALL_LEFT_JOSEPH:
            sprite.physics.vx = 0;
            break;

        default:
            console.error("Error, Game State invalid");
    }

    sprite.xPos += sprite.physics.vx * globals.deltaTime;

    detectCollisionsBetweenSpriteAndSprite(sprite);
    updateAnimationFrames(sprite);
}

function updateJosephs() 
{
    for (let i = 0; i < globals.spriteMenu.length; i++) {
        const sprite = globals.spriteMenu[i];
        updateSpriteMenu(sprite);
    }
    updateFallTimer();
}

function updateRIP(sprite)
{
    sprite.xPos = 0;
    sprite.yPos = 0;

}

function updateBackgroundStory(sprite)
{
    sprite.xPos = 0;
    sprite.yPos = 0;

}

function updateSpriteGameOver(sprite)
{
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.RIP:
            updateRIP(sprite);
            break;
    }
}

function updateSpriteStory(sprite)
{
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.BACKGROUND_STORY:
            updateBackgroundStory(sprite);
            break;
    }
}

function updateScreenGameOver()
{
    for ( let i = 0; i < globals.spriteBackground.length; i++)
    {
        const sprite = globals.spriteBackground[i];
        updateSpriteGameOver(sprite);
    }
}

function updateTheStory()
{
    for ( let i = 0; i < globals.spriteStory.length; i++)
    {
        const sprite = globals.spriteStory[i];
        updateSpriteStory(sprite);
    }
} 

function updateAnimationFrames(sprite)
{
        
    switch (sprite.state)
        {
            case State.FALL_LEFT_JOSEPH:
            case State.FALL_RIGHT_JOSEPH:
                // Reset the animation frames to the first frame
                sprite.frames.frameCounter = 0;
                sprite.frames.framesChangeCounter = 0;
                break;
            default:
                // Increment the animation frame counter
                sprite.frames.framesChangeCounter++;
                
                // If the counter has reached the speed, increment the frame counter and reset the counter
                if (sprite.frames.framesChangeCounter === sprite.frames.speed)
                {
                    sprite.frames.frameCounter++;
                    sprite.frames.framesChangeCounter = 0;
                }

                // If the frame counter has reached the number of frames per state, reset it to 0
                if (sprite.frames.frameCounter === sprite.frames.framesPerState)
                {
                    sprite.frames.frameCounter = 0;
                }
        }
}


function updateKeyboardControls()
{
    for ( let i = 0; i < globals.spriteControls.length; i++)
    {
        const sprite = globals.spriteControls[i];
        updateAnimationFrames(sprite);
    }
}
