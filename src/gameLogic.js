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

        default:
            console.error("Error: Game State invalid");

    }
}

function playGame()
{
    updateHUD();
    updateSprites();
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
    sprite.xPos = 2;
    sprite.yPos = 40;

    sprite.frames.frameCounter = 0;

    sprite.state = State.SUN;

}


function updateGoblin(sprite)
{

    sprite.xPos = 100;
    sprite.yPos = 120;
    sprite.frames.frameCounter = 3;
    sprite.state = State.UP_2;
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
