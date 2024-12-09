import globals from "./globals.js";
import {Game, SpriteID,State, FPS} from "./constants.js";
import Sprite from "./Sprites.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level } from "./Level.js";

function initHTMLelements()
{
    globals.canvas = document.getElementById('gameScreen');
    globals.ctx = globals.canvas.getContext('2d');

    globals.canvasHUD = document.getElementById('gameHUD');
    globals.ctxHUD = globals.canvasHUD.getContext('2d');

    globals.ctx.imageSmoothingEnabled = false;
}

function initVars()
{
    globals.previousCycleMilleseconds = 0;
    globals.deltaTime = 0;
    globals.frameTimeObj = 1 / FPS;

    globals.gameState = Game.LOADING;
}

function initSprites()
{
    initPlayer();
    initGoblin();
    initDemon();
    initThrone();
    initPotion();
    initBat();
}

function initSpritesHUD()
{
    initHealthBarHUD();
    initThroneHUD();
    initStages();
}

function initGoblin()
{
    //Create the properties: xInit, yInit, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset
    const imageSet = new ImageSet(5, 3, 57, 55, 57, 57, 0, 2);
    const frames = new Frames(11);

    const goblin = new Sprite(SpriteID.GOBLIN, State.DOWN_2, 0, 0, imageSet, frames);
    globals.sprites.push(goblin);
}
function initPlayer()
{
    //Create the image properties: . xInit, yInit, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset
    const imageSet = new ImageSet(3, 289, 41, 30, 41, 41, 0, 0);
    const frames = new Frames(10);

    const player = new Sprite(SpriteID.PLAYER, State.UP, 3, 289, imageSet, frames);

    globals.sprites.push(player);
}

function initDemon()
{
    const imageSet = new ImageSet(0, 442, 64, 63, 64, 64, 0, 0);
    const frames = new Frames(4);

    const demon = new Sprite(SpriteID.DEMON, State.DOWN_3, 38, 9, imageSet, frames);

    globals.sprites.push(demon);
}

function initPotion()
{
    const imageSet = new ImageSet(510, 561, 30, 33, 27, 35, 0, 0);
    const frames = new Frames(5);

    const potion = new Sprite(SpriteID.POTION, State.POISON_OFF, 25, 15, imageSet, frames);

    globals.sprites.push(potion);
}

function initThrone()
{
    const imageSet = new ImageSet(325, 272, 81, 90, 81, 90, 0, 0);
    const frames = new Frames(1);

    const throne = new Sprite(SpriteID.THRONE, State.BE, 64, 69, imageSet, frames);

    globals.sprites.push(throne);
}

function initBat()
{
    const imageSet = new ImageSet(513, 292, 51, 58, 47, 58, 0, 0);
    const frames = new Frames(3);

    const bat = new Sprite(SpriteID.BAT, State.DOWN_4, 64, 64, imageSet, frames);

    globals.sprites.push(bat);
}

function initThroneHUD()
{
    const imageSet = new ImageSet(256, 442, 70, 75, 83, 87, 0, 0);
    const frames = new Frames(3);

    const throneHUB = new Sprite(SpriteID.THRONEHUB, State.MADNESS_0, 619, 4, imageSet, frames);

    globals.spritesHUD.push(throneHUB);
}

function initHealthBarHUD()
{
    const imageSet = new ImageSet(391, 433, 60, 15, 58, 16, 0, 0);
    const imageSetEmpty = new ImageSet(258, 610, 64, 27, 58, 16, 0, 0);

    const framesEmpty = new Frames(1);
    const frames = new Frames(1);

    const healthBarEmpty = new Sprite(SpriteID.HEALTH_BAR_EMPTY, State.BE, 100, 10, imageSetEmpty, framesEmpty);
    const healthBar = new Sprite(SpriteID.HEALTH_BAR, State.BE, 100, 10, imageSet, frames);

    globals.spritesHUD.push(healthBarEmpty);
    globals.spritesHUD.push(healthBar);
}

function initStages()
{
    const imageSet = new ImageSet(400, 360, 57, 36, 57, 36, 0, 0);
    const frames = new Frames(1);

    const stages = new Sprite(SpriteID.SUN, State.SUN, 100, 10, imageSet, frames);

    globals.spritesHUD.push(stages);

}



function loadAssets()
{
    let tileSet;
    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/spritesheet.png";
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    tileSet = new Image();
    tileSet.addEventListener("load", loadHandler, false);
    tileSet.src = "./images/tileSet2.png";
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);
}

function loadHandler()
{
    globals.assetsLoaded++;

    if(globals.assetsLoaded === globals.assetsToLoad.length)
    {
        for (let i = 0; i < globals.tileSets.length; i++)
        {
            globals.tileSets[i].removeEventListener("load", loadHandler, false);
        }

        console.log("Assets finished loading");

        globals.gameState = Game.PLAYING;
    }
}

function initLevel()
{
    const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);

    globals.level = new Level(level, imageSet);
}

export 
{
    initHTMLelements,
    initVars,
    loadAssets,
    initSpritesHUD,
    initSprites,
    initLevel
}