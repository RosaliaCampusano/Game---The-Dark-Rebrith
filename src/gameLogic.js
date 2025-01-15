import globals from "./globals.js";
import {Game, State, SpriteID, GRAVITY} from "./constants.js";
import detectCollisions from "./collisiona.js";
import { updateCamera } from "./Camera.js";



export default function update()
{
    switch(globals.gameState)
    {
        case Game.LOADING:
            console.log("Loading assets...")
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
        default:
            console.error("Error: Game State invalid");

    }
}

function updateHighScore()
{
    globals.highScore = localStorage.getItem("highScore");

    if(globals.score > globals.highScore)
    {
        localStorage.setItem("highScore", globals.score);
    }
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
    updateHUD();
    updateSprites();
    updateCamera();
    detectCollisions();

}

function updateControls()
{
    updateKeyboardControls();
}


function updateState() 
{
    for(let i = 0; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        if (sprite.isCollidingWithPlayer)
        {
            /* if (sprite.id === SpriteID.THRONE)
            {
                window.location.reload();
                // alert("You have won the game");
            } */

            if (sprite.constructor.name === "Enemies")
            {
                if (globals.life == 0)
                {
                    window.location.reload();
                    // globals.gameState = Game.OVER;
                    // alert("You have lost the game");
                }
            }

            if (sprite.id === SpriteID.POTION){

            }
        }
    }
}

/**
 * Function that updates the life of the player
 * @return {void}
 */


function updateLife()
{
    /**
     * Loop through all the sprites in the game
     */
    for (let i = 0; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        /**
         * Check if the sprite is colliding with the player
         */
        if (sprite.isCollidingWithPlayer)
        {
            /**
             * If the sprite is an enemy, decrease the life of the player
             */
            if (sprite.constructor.name === "Enemies")
            {                
                globals.life--;
            }
        }
    }
}
function updatePlayer(sprite)
{
    readKeyboardAndAssignStatePlayer(sprite);
    
    switch(sprite.state)
        {
            case State.UP:
                sprite.physics.vx = 0;
                sprite.physics.vy = -sprite.physics.vLimit;
                break;
    
            case State.DOWN:
                sprite.physics.vx = 0;
                sprite.physics.vy = sprite.physics.vLimit;
                break;
    
            case State.RIGHT:
                sprite.physics.vx = sprite.physics.vLimit;
                sprite.physics.vy = 0;
                break;
    
            case State.LEFT:
                sprite.physics.vx = -sprite.physics.vLimit;
                sprite.physics.vy = 0;
                break;
            
            case State.STILL_UP:
                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
    
                /* sprite.frames.frameCounter = 0; */
                break;
    
            default:             
                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
                
        }
    
        sprite.xPos += sprite.physics.vx * globals.deltaTime;
        sprite.yPos += sprite.physics.vy * globals.deltaTime;
        updateAnimationFrames(sprite);
    
        calculateCollisionWithBorders(sprite);
        adjustPositionAfterCollision(sprite);
}
    

function updatePlayerWizard(sprite)
{
    
    readKeyboardAndAssignState(sprite);

    let attack;

        for (let index = 0; index < globals.sprites.length; index++) 
        {
            const sprite = globals.sprites[index];
            const type = sprite.id
            if (type == SpriteID.ATTACK) 
            {
                attack = sprite
            }
        }

    switch(sprite.state)
    {
        case State.UP_WIZARD:
            sprite.physics.vx = 0;
            sprite.physics.vy = -sprite.physics.vLimit;
            countFrameAttack = 0;
            attack.xPos = -10;
            attack.yPos = -10;
            break;
        case State.DOWN_WIZARD:
            sprite.physics.vx = 0;
            sprite.physics.vy = sprite.physics.vLimit;
            countFrameAttack = 0;
            attack.xPos = -10;
            attack.yPos = -10;
            break;
        case State.RIGHT_WIZARD:
            sprite.physics.vx = sprite.physics.vLimit;
            sprite.physics.vy = 0;
            countFrameAttack = 0;
            attack.xPos = -10;
            attack.yPos = -10;
            break;
        case State.LEFT_WIZARD:
            sprite.physics.vx = -sprite.physics.vLimit;
            sprite.physics.vy = 0;
            countFrameAttack = 0;
            attack.xPos = -10;
            attack.yPos = -10;
            break;
        
        case State.LEFT_ATTACK_WIZARD:
                countFrameAttack++;
                attack.xPos = sprite.xPos - (countFrameAttack*2);
                attack.yPos = sprite.yPos;
                
                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
                if (countFrameAttack == 30) {
                    sprite.state = State.STILL_LEFT
                    countFrameAttack=0;
                    attack.xPos = -10;
                    attack.yPos = -10;
                }
                break;

        case State.RIGHT_ATTACK_WIZARD:
                countFrameAttack++;
                attack.xPos = sprite.xPos + (countFrameAttack*2);
                attack.yPos = sprite.yPos;

                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
                if (countFrameAttack == 30) 
                {
                    sprite.state = State.STILL_RIGHT
                    countFrameAttack=0;
                    attack.xPos = -10;
                    attack.yPos = -10;
                }
                break;

        case State.UP_ATTACK_WIZARD:
                countFrameAttack++;
                attack.xPos = sprite.xPos;
                attack.yPos = sprite.yPos - (countFrameAttack*2);

                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
                if (countFrameAttack == 15) 
                {
                    sprite.state = State.STILL_UP
                    countFrameAttack=0;
                    attack.xPos = -10;
                    attack.yPos = -10;
                }
                break;

        case State.DOWN_ATTACK_WIZARD:
                countFrameAttack++;
                attack.xPos = sprite.xPos;
                attack.yPos = sprite.yPos + (countFrameAttack*2);

                sprite.physics.vx = 0;
                sprite.physics.vy = 0;
                if (countFrameAttack == 20) 
                {
                    sprite.state = State.STILL_DOWN
                    countFrameAttack = 0;
                    attack.xPos = -10;
                    attack.yPos = -10;
                }
                break;
        default: 
    
            sprite.physics.vx = 0;
            sprite.physics.vy = 0;
            countFrameAttack = 0;
            attack.xPos = -10;
            attack.yPos = -10;
            
    }
    

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    sprite.yPos += sprite.physics.vy * globals.deltaTime;
    updateAnimationFrames(sprite);

}

function readKeyboardAndAssignState(sprite)
{
    sprite.state =  globals.action.moveLeft                             ? State.LEFT_WIZARD           : //Left key
                    globals.action.moveRight                            ? State.RIGHT_WIZARD          : //Right key
                    globals.action.moveUp                               ? State.UP_WIZARD             : //Up key
                    globals.action.moveDown                             ? State.DOWN_WIZARD           : //Down key
                    sprite.state === State.LEFT_WIZARD                  ? State.STILL_LEFT            : //No  key press left
                    sprite.state === State.RIGHT_WIZARD                 ? State.STILL_RIGHT           : //No  key press right
                    sprite.state === State.UP_WIZARD                    ? State.STILL_UP              : //No  key press up
                    sprite.state === State.DOWN_WIZARD                  ? State.STILL_DOWN            : //No  key press down
                    sprite.state;

}

function readKeyboardAndAssignStatePlayer(sprite)
{
  
    sprite.state =  globals.action.moveLeft ? State.LEFT : // Left key
                    globals.action.moveRight ? State.RIGHT : // Right key
                    globals.action.moveUp ? State.UP : // Up key
                    globals.action.moveDown ? State.DOWN : // Down key
                    sprite.state === State.LEFT                  ? State.STILL_LEFT            : //No  key press left
                    sprite.state === State.RIGHT                 ? State.STILL_RIGHT           : //No  key press right
                    sprite.state === State.UP                    ? State.STILL_UP              : //No  key press up
                    sprite.state === State.DOWN                  ? State.STILL_DOWN            : //No  key press down
                    sprite.state; // Maintain current state if no keys are pressed
}


function updateAnimationFrames(sprite)
{
    switch(sprite.state)
    {
        case State.STILL_UP:
        case State.STILL_LEFT:
        case State.STILL_DOWN:
        case State.STILL_RIGHT:
            sprite.frames.frameCounter = 0;
            sprite.frames.framesChangeCounter = 0;
            break;
        default:
            sprite.frames.framesChangeCounter++;
            
        if (sprite.frames.framesChangeCounter === sprite.frames.speed)
        {
            sprite.frames.frameCounter++;
            sprite.frames.framesChangeCounter = 0;
        }

        if (sprite.frames.frameCounter === sprite.frames.framesPerState)
        {
            sprite.frames.frameCounter = 0;
        }
    }
} 

function updateJumpGuy(sprite)
{
    switch (sprite.state) {
        case State.JUMP:
            sprite.physics.vx = 50; 
            break;
        default:
            console.error("Error, Game State invalid");
            return;
    }

    sprite.physics.ay = GRAVITY;

    if (!sprite.physics.isOnGround) {
        sprite.physics.vy += sprite.physics.ay * globals.deltaTime
    }

    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    sprite.yPos += sprite.physics.vy * globals.deltaTime;  
    
    onGroupJumpGuy(sprite)
} 

let countJumps = 1;

function onGroupJumpGuy(sprite) 
{

    switch (countJumps) {
        case 1:
            if (sprite.yPos > globals.canvas.height/3 - sprite.imageSet.ySize)
            {
                sprite.physics.isOnGroup = true;
                adjustPositionAfterCollision(sprite)
                sprite.physics.vy = 0;
        
                updateAnimationFrames(sprite)
                countJumps++;              
            }
            break;
        
        case 3:
            if (sprite.xPos > globals.canvas.width/3 - sprite.imageSet.xSize)
            {
                sprite.physics.isOnGroup = true;
                adjustPositionAfterCollision(sprite)
                sprite.physics.vy = 0;
    
                updateAnimationFrames(sprite)
                countJumps++;
            }
            break;
            
        case 5:
            if (sprite.xPos > globals.canvas.width/2 - sprite.imageSet.xSize)
            {
                sprite.physics.isOnGroup = true;
                adjustPositionAfterCollision(sprite)
                sprite.physics.vy = 0;
                
                updateAnimationFrames(sprite)
            }
            if (sprite.xPos > globals.canvas.width - 40 - sprite.imageSet.xSize)
            {
                
                sprite.physics.isOnGroup = true;
                adjustPositionAfterCollision(sprite)
                sprite.physics.vy = 0;
                
                updateAnimationFrames(sprite)
                countJumps++;
            }
            break;
        case 6:
            if (sprite.xPos > globals.canvas.width - sprite.imageSet.xSize)
            {
                countJumps= 1;
                sprite.xPos = 0;
                sprite.yPos = 0;
                sprite.physics.vy = 0;
            }
            break;
        default:
            sprite.physics.isOnGround = false;
            countJumps++;
            break;
    }
} 

function updateAttack(sprite)
{
    sprite.xPos = 140;
    sprite.yPos = 142;

    sprite.frames.frameCounter = 2;

}

function updateThroneHUB(sprite)
{
    sprite.xPos = 220;
    sprite.yPos = 21;

    sprite.frames.frameCounter = 2;

    sprite.state = State.MADNESS_0;
}

function updateStages(sprite)
{
    sprite.xPos = 0;
    sprite.yPos = 40;

    sprite.frames.frameCounter = 0;

    sprite.state = State.SUN;

}


function updateGoblin(sprite)
{
    if (sprite.isCollidingWithObstacleOnTheLeft) 
        {
            sprite.state = State.RIGHT_2
        }
        else if(sprite.isCollidingWithObstacleOnTheRight)
        {
            sprite.state = State.LEFT_2
        }

    switch (sprite.state)
    {
        case State.RIGHT_2:
            sprite.physics.vx = sprite.physics.vLimit;
            break;

        case State.LEFT_2:
            sprite.physics.vx = -sprite.physics.vLimit;
            break;
    
        default:
            console.error("Error, Game State invalid");
    }

    sprite.xPos += sprite.physics.vx * globals.deltaTime;

    updateAnimationFrames(sprite);

    updateDirectionRandom(sprite);

    const isCollision = calculateCollisionWithBorders(sprite);
    if (isCollision)
    {
        adjustPositionAfterCollision(sprite);
        swapDirectionGoblin(sprite);
    } 
}

function swapDirectionGoblin(sprite)
{
    sprite.state = sprite.state === State.RIGHT_2 ?  State.LEFT_2  : State.RIGHT_2;
}


function updateDemon(sprite)
{
    if (sprite.isCollidingWithObstacleOnTheTop) 
        {
            sprite.state = State.DOWN_3
        }
        else if(sprite.isCollidingWithObstacleOnTheBottom)
        {
            sprite.state = State.UP_3
        }

    switch (sprite.state)
    {
        case State.DOWN_3:
            sprite.physics.vy = sprite.physics.vLimit;
            break;
        
        case State.UP_3:
            sprite.physics.vy = -sprite.physics.vLimit;
            break;
    
        default:
            console.error("Error, Game State invalid");
    }

    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    updateAnimationFrames(sprite);

    updateDirectionRandom(sprite);

    const isCollision = calculateCollisionWithBorders(sprite);
    if (isCollision)
    {
    adjustPositionAfterCollision(sprite);
    swapDirection(sprite);
    }
}

function updateDirectionRandom(sprite)
{
    sprite.directionChangeCounter += globals.deltaTime;

    if (sprite.directionChangeCounter > sprite.maxTimeToChangeDirection)
    {
        sprite.directionChangeCounter = 0;

        sprite.maxTimeToChangeDirection = Math.floor(Math.random() * 8) + 1;
        
    }
}

function swapDirection(sprite)
{
    sprite.state = sprite.state === State.UP_3 ? State.DOWN_3 : State.UP_3;
}

function calculateCollisionWithBorders(sprite)
{
    let isCollision = false;

    if (sprite.yPos + sprite.imageSet.ySize > globals.canvas.height)
    {
        isCollision = true;
    }
    else if (sprite.yPos < 0)
    {
        isCollision = true;
    } 
    else if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width) 
    {
        isCollision = true;

    } else if (sprite.xPos < 0) 
    {
        isCollision = true;

    }

    return isCollision;
}

let elapsedTime = 0; 

function updateThrone(sprite)
{
    const thronePositions = [
        { xPos: 75, yPos: 180 },
        { xPos: 20, yPos: 20  },
        { xPos: 150, yPos: 170},
        { xPos: 100, yPos: 50 },
        { xPos: 205, yPos: 20 },
        { xPos: 230, yPos: 110},
        { xPos: 310, yPos: 100},
        { xPos: 230, yPos: 20 },
        { xPos: 250, yPos: 120},
        { xPos: 69, yPos: 69  }
    ];

    const changeInterval = 7; 
    
    elapsedTime += globals.deltaTime;

    if (elapsedTime >= changeInterval) 
    {
        const randomIndex = Math.floor(Math.random() * thronePositions.length);
        const newPosition = thronePositions[randomIndex];
        sprite.xPos = newPosition.xPos;
        sprite.yPos = newPosition.yPos;
        
        elapsedTime = 0;
    }

}

function adjustPositionAfterCollision(sprite) 
{

    if (sprite.yPos < 0) 
    {
        sprite.yPos = 0;
    } else if (sprite.yPos + sprite.imageSet.ySize > globals.canvas.height) 
    {
        sprite.yPos = globals.canvas.height - sprite.imageSet.ySize;
    }

    
    if (sprite.xPos < 0) 
    {
        sprite.xPos = 0;
    } else if (sprite.xPos + sprite.imageSet.xSize > globals.canvas.width) 
    {
        sprite.xPos = globals.canvas.width - sprite.imageSet.xSize;
    }
}

function updateBat(sprite)
{
    switch (sprite.state) {
        case State.UP_4:
            sprite.physics.vx = 20; 
            sprite.physics.vy = -sprite.physics.vLimit; 
            break;
        case State.DOWN_4:
            sprite.physics.vx = 20; 
            sprite.physics.vy = sprite.physics.vLimit; 
            break;
        case State.RIGHT_4:
            sprite.physics.vx = sprite.physics.vLimit; 
            sprite.physics.vy = 20; 
            break;
        case State.LEFT_4:
            sprite.physics.vx = -sprite.physics.vLimit; 
            sprite.physics.vy = 20; 
            break;
        default:
            console.error("Error, Game State invalid");
            return;
    }

   
    sprite.xPos += sprite.physics.vx * globals.deltaTime;
    sprite.yPos += sprite.physics.vy * globals.deltaTime;

    
    updateAnimationFrames(sprite);
    updateDirectionRandom(sprite);

    
    const isCollision = calculateCollisionWithBorders(sprite);
    if (isCollision) 
    {
        adjustPositionAfterCollision(sprite);
        swapDirectionBat(sprite);
    }
}

function swapDirectionBat(sprite)
{
    const directions = [State.UP_4, State.DOWN_4, State.LEFT_4, State.RIGHT_4];
   const random = Math.floor(Math.random() * directions.length);
    sprite.state = directions[random];

}



function updatePotion(sprite)
{
    const changeInterval = 30; // Change the position every 30 seconds
    // Increment the frames change counter by the elapsed delta time
    sprite.frames.framesChangeCounter += globals.deltaTime;

    // Check if the potion is colliding with the player
    if (sprite.isCollidingWithPlayer) 
    {
        // Increment the score
        if (sprite.frames.frameCounter === 0)
        {
            globals.score += 100;
        }

        // Set the player's life to 5
        if (sprite.frames.frameCounter === 1)
        {
            if (globals.life + 50 <= 125) {
                globals.life += 50;
            }else{
                globals.life = 125
            }
        }

        // Set the player's life to 5
        if (sprite.frames.frameCounter === 2)
        {
            if (globals.life > 5)
            {
                globals.life = 5;
            }
        }

        // Move the potion off the screen
        sprite.xPos = -20;
    }

      // Check if the potion has been off the screen for longer than the change interval
      if (sprite.xPos === -20) {
        elapsedTimePotion += globals.deltaTime;
    }

    // If the potion has been off the screen for longer than the change interval, move it to the bottom of the screen
    if (elapsedTimePotion >= changeInterval) {
        sprite.xPos = 210;
        elapsedTimePotion = 0;
    }

    // Check if it's time to advance the animation frame
    if (sprite.frames.framesChangeCounter >= sprite.frames.speed) 
    {
        // Reset the frames change counter
        sprite.frames.framesChangeCounter = 0;
        
        // Move to the next frame
        sprite.frames.frameCounter++;

        // Reset frame counter if it exceeds the number of frames per state
        if (sprite.frames.frameCounter >= sprite.frames.framesPerState) {
            sprite.frames.frameCounter = 0;
        }
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
            updateThroneHUB(sprite);
            break;

        case SpriteID.PLAYER:
            updatePlayer(sprite);
            break;

        case SpriteID.GOBLIN:
            updateGoblin(sprite);
            break;

        case SpriteID.DEMON:
            updateDemon(sprite);
            break;

        case SpriteID.THRONE:
            updateThrone(sprite);
            break;
        
        case SpriteID.POTION:
            updatePotion(sprite);
            break;
        case SpriteID.SUN:
            updateStages(sprite);
            break;

        case SpriteID.BAT:
            updateBat(sprite);
            break;
        
        case SpriteID.PLAYER_WIZARD:
            updatePlayerWizard(sprite);
            break;

        case SpriteID.ATTACK:
            updateAttack(sprite); 
            break;
        case SpriteID.JUMPGUY:
            updateJumpGuy(sprite);
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
        case SpriteID.ACTIVE:
            updateActive(sprite);
            break;
        default:

        break;
    }
} 

function updateJoseph1(sprite)
{
    sprite.xPos = 55;
    sprite.yPos = 206;

    sprite.frames.frameCounter = 0;

    sprite.state = State.RIGHT_JOSEPH;
}

function updateJoseph2(sprite)
{
    sprite.xPos = 300;
    sprite.yPos = 208;

    sprite.frames.frameCounter = 2;

    sprite.state = State.LEFT_JOSEPH;
}

function updateActive(sprite)
{
    sprite.xPos = 135;
    sprite.yPos = 119;

    sprite.frames.frameCounter = 0;

}

function updateJosephs()
{
    for ( let i = 0; i < globals.spriteMenu.length; i++)
    {
        const sprite = globals.spriteMenu[i];
        updateSpriteMenu(sprite);
    }
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

function updatekeyboard(sprite)
{
    const type = sprite.id;
    switch(type)
    {
        case SpriteID.KEYBOARD_A:
            updateA(sprite);
            break;
        case SpriteID.KEYBOARD_D:
            updateD(sprite);
            break;
        case SpriteID.KEYBOARD_L:
            updateL(sprite);
            break;
        case SpriteID.KEYBOARD_M:
            updateM(sprite);
            break;
        case SpriteID.KEYBOARD_S:
            updateS(sprite);
            break;
        case SpriteID.KEYBOARD_W:
            updateW(sprite);
        default:

        break;
    }
}

function updateA(sprite)
{
    sprite.xPos = 33;
    sprite.yPos = 135;

}

function updateS(sprite)
{
    sprite.xPos = 33;
    sprite.yPos = 167;
    
}

function updateD(sprite)
{
    sprite.xPos = 33;
    sprite.yPos = 197;
    
}

function updateW(sprite)
{
    sprite.xPos = 33;
    sprite.yPos = 107;
    
}

function updateL(sprite)
{
    sprite.xPos = 255;
    sprite.yPos = 105;
    
}

function updateM(sprite)
{
    sprite.xPos = 255;
    sprite.yPos = 190;
    
}

function updateKeyboardControls()
{
    for ( let i = 0; i < globals.spriteControls.length; i++)
        {
            const sprite = globals.spriteControls[i];
            updatekeyboard(sprite);
        }
} 