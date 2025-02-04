import globals from "./globals.js";
import { Game, State, SpriteID, ParticleState, Sound } from "./constants.js";
import detectCollisions from "./collisions.js";
import {updateCamera} from "./Camera.js";
import Time from "./Time.js";

export default function update()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            console.log("Loading assets...")
            updateLoad();
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
        default:
            console.error("Error: Game State invalid");

    }
}

function updateHighScore()
{
    
    globals.historyScore.forEach((score, index, arr) => {
        if (globals.score > score[1])
        {
            arr.splice(index, 0, ["XXX", globals.score]);
        }  
    });

    globals.highScore = globals.historyScore[0][1];
}

function updateUpdateTime()
{
    Time.update();
}

function updateGameOver()
{
    updateScreenGameOver();
}

function updateStory()
{
    updateTheStory();
}

function playGame()
{
    updateHighScore();
    updateUpdateTime();
    updateHUD();
    updateSprites();
    updateCamera();
    // updatePaticles();
    detectCollisions();
    playMusic();
    playSound();
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
        globals.sounds[Sound.GAME_MUSIC].play();
        globals.sounds[Sound.GAME_MUSIC].volume = 1;
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

function updateMoon(sprite) {
    sprite.xPos = 0;
    sprite.yPos = 55;
    sprite.imageSet.ySize = 40;
    sprite.state = State.MOON;
    
}

function updateSun(sprite) {
    sprite.xPos = 0;
    sprite.yPos = 40;
    sprite.imageSet.ySize = 45;
    sprite.imageSet.ySize *= 0.5;
    sprite.state = State.BE;
   /*  console.log("Sun updated:", sprite); */
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
            updateSun(sprite);
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