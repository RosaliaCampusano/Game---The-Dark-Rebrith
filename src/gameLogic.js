import globals from "./globals.js";
import { Game, State, SpriteID, ParticleState, Sound, Music } from "./constants.js";
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
    playWinMusic();
    for (let index = 0; index < globals.spriteWinScreen.length; index++) {

        const sprite = globals.spriteWinScreen[index];

        switch (sprite.id) {
            case SpriteID.WIN_SCREEN:
                if (sprite.internalTimer < sprite.maxInternalTimer) sprite.internalTimer += 1 * globals.deltaTime;
                else globals.gameState = Game.LOAD_MAIN_MENU
                break;
        
            default:
                break;
        }
        
    }
}

function playWinMusic()
{
    globals.currentMusic = Music.WIN_MUSIC;
    globals.sounds[globals.currentMusic].play();
    globals.sounds[globals.currentMusic].volume = 1;
}

function updateEnterName()
{
    if (globals.action.enter) {
        globals.gameState = Game.LOAD_OVER;
    }

    // globals.sounds.forEach(sound => sound.pause());
    // globals.currentSound = Sound.NO_SOUND

    if(globals.gameState === Game.ENTER_NAME)
    {
        globals.sounds[Music.GAME_OVER_MUSIC].play();
        globals.sounds[Music.GAME_OVER_MUSIC].volume = 1;
    }

    globals.saturate = 0;
}

function playHighScoreMusic()
{
    if (globals.gameState === Game.HIGHSCORE)
    {
        globals.sounds[Music.HIGHSCORE_MUSIC].play();
        globals.sounds[Music.HIGHSCORE_MUSIC].volume = 1;
        
    }
}

function updateHighScore()
{
    playHighScoreMusic();

    function handlerKeyDownhighscore(event)
    {
        if (event.key === 'Escape') {
            globals.gameState = Game.LOAD_MAIN_MENU;
            document.removeEventListener('keydown', handlerKeyDownhighscore);
        }

        if (event.key === 'ArrowLeft') {
            if (globals.highScoreInit > 0){
                globals.controlerHighScoreInit = -10;
            }else {
                globals.highScoreInit = 0
                globals.controlerHighScoreInit = 0;
            }
            globals.gameState = Game.LOAD_HIGH_SCORES;
        }

        if (event.key === 'ArrowRight') {
            globals.controlerHighScoreInit = 10;
            if (globals.highScoreInit + 10 >= globals.historyScore.length){
                globals.controlerHighScoreInit = 0;
            }
            globals.gameState = Game.LOAD_HIGH_SCORES;
        }
    }

    document.addEventListener('keydown', handlerKeyDownhighscore);
}

function updateUpdateTime()
{
    Time.update();
}

function updateLoading()
{
    if (globals.action.enter) {
        globals.gameState = Game.LOAD_MAIN_MENU;
    }
}
function updateGameOver()
{
    updateScreenGameOver();
    // checkIsMusicContinue();
    playGameOverMusic();
}

function playGameOverMusic()
{
    globals.currentMusic = Music.GAME_OVER_MUSIC;
    globals.sounds[globals.currentMusic].play();
    globals.sounds[globals.currentMusic].volume = 1;
} 

function checkIsMusicContinue()
{
    if (globals.currentMusic !== Music.NO_MUSIC) {
        globals.sounds[globals.currentMusic].pause();
        globals.sounds[globals.currentMusic].currentTime = 0;
        // console.log("aver " + globals.currentMusic);
    }
}

function updateStory()
{
    playStoryMusic();
    updateTheStory();
}

function playStoryMusic()
{
    if(globals.gameState === Game.STORY)
        {
            globals.sounds[Music.STORY_MUSIC].play();
            globals.sounds[Music.STORY_MUSIC].volume = 1;
        }
}

function playGame()
{

    globals.highScore = globals.historyScore[0].score;
    updateUpdateTime();
    updateHUD();
    if (!globals.isPlaying) return;
    updateSprites();
    updateCamera();
    // updatePaticles();
    detectCollisions();
    playSound();
    playMusic();
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

function playMusic()
{
    if( globals.gameState === Game.PLAYING)
    {
        globals.sounds[Music.GAME_MUSIC].play();
        globals.sounds[Music.GAME_MUSIC].volume = 1;
    }
}

function updatePaticles()
{
    for (let i = 0; i < globals.particles.length; i++)
    {
        const particle = globals.particles[i];
        particle.update()
    }
}

function updateControls()
{
    updateKeyboardControls();
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


function updateDayNightCycle(sprite) {
    let isDay = true;  
    let timeElapsed = 0; 
    const timeLimit = globals.time; 
    const sunShrinkRate = 1;
    sprite.xPos = -5;
    sprite.yPos = 30;
        timeElapsed++;
    
        if (isDay) {
            if (sprite.imageSet && sprite.imageSet.xSize > 0) { 
                sprite.imageSet.xSize -= sunShrinkRate;
            }
    
            if (sprite.imageSet.xSize <= 0) { 
                sprite.imageSet.xSize = 0;
                isDay = false; 
                timeElapsed = 0; 
                updateMoon(sprite); 
            }
        } else {
            if (timeElapsed >= timeLimit) { 
                isDay = true; 
                timeElapsed = 0;
                updateSun(sprite); 
            }
        }
    }
    
    function updateMoon(sprite) {
        sprite.xPos = 0;
        sprite.yPos = 40;
        if (sprite.imageSet) sprite.imageSet.xSize = 50;
        sprite.state = State.MOON;
    }
    
    function updateSun(sprite) {
        sprite.xPos = -5;
        sprite.yPos = 30;
        sprite.imageSet.xSize = 70; 
        sprite.xPos = 0; 
        sprite.state = State.BE;
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

        case SpriteID.MOON:
            updateMoon(sprite);
            break;

        case SpriteID.SUN:
             updateDayNightCycle(sprite);
            /* updateSun(sprite); */
            break;
        
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

    if( globals.gameState === Game.MAIN_MENU)
    {
        globals.sounds[Music.MAIN_MENU_MUSIC].play();
        globals.sounds[Music.MAIN_MENU_MUSIC].volume = 1;
    }

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

function updateSpriteLoad(sprite)
{
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.LOAD_JOSEPH:
            updateLoadJoseph(sprite);
            break;

        default:
            break;
    }
}

function updateLoad()
{
    for (let i = 0; i < globals.spriteLoading.length; i++)
    {
        const sprite = globals.spriteLoading[i]
        updateSpriteLoad(sprite);
    }
}

function updateLoadJoseph(sprite)
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

    if (sprite.xPos < 150) {
        sprite.xPos = 250;
    };

    updateAnimationFrames(sprite);
    
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
