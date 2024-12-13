import globals from "./globals.js";
import {Game, State, SpriteID } from "./constants.js";
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
    updateHUD();
    updateSprites();
}

function updateControls()
{
    updateKeyboardControls();
}
function updatePlayer(sprite)
{
    sprite.xPos = 101;
    sprite.yPos = 5;

    sprite.frames.frameCounter = 1;

    sprite.state = State.DOWN;
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
    sprite.xPos = 100;
    sprite.yPos = 5;

    sprite.frames.frameCounter = 0;

    sprite.state = State.SUN;

}


function updateGoblin(sprite)
{

    sprite.xPos = 100;
    sprite.yPos = 120;
    sprite.frames.frameCounter = 3;
    sprite.state = State.DOWN_2;
}

function updateDemon(sprite)
{
    sprite.xPos = 310;
    sprite.yPos = 60;

    sprite.frames.frameCounter = 0;

    sprite.state = State.DOWN_3;
}
function updateThrone(sprite)
{
    sprite.xPos = 75;
    sprite.yPos = 170;

    sprite.frames.frameCounter = 1;

    sprite.state = State.BE;
}

function updateBat(sprite)
{
    sprite.xPos = 295;
    sprite.yPos = 185;

    sprite.frames.frameCounter = 0;

    sprite.state = State.UP_4;
}

function updatePotion(sprite)
{
    sprite.xPos = 210;
    sprite.yPos = 58;

    sprite.frames.frameCounter = 1;

    sprite.state = State.ACTIVATED_SKILL;
}

function updateHealthBar(sprite)
{
    sprite.xPos = 115;
    sprite.yPos = 85;
    sprite.imageSet.xSize = 60;
    
    sprite.imageSet.xSize *= 0.5;

    sprite.state = State.BE;
}

function updateEmptybar(sprite)
{
    sprite.xPos = 123;
    sprite.yPos = 83;

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