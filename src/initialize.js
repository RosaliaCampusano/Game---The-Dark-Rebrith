import globals from "./globals.js";
import {Game, SpriteID,State, FPS} from "./constants.js";
import Sprite, { Enemies} from "./Sprites.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level } from "./Level.js";
import { keydownHandler, keyupHandler } from "./events.js";
import Physics from "./Physics.js";

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

    globals.action = 
    {
        moveLeft:       false,
        moveRight:      false,
        moveUp:         false,
        moveDown:       false,
        moveAttack:     false,
        merge:          false
    }
}


function initEvents()
{
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}

function initSprites()
{
    /* initPlayer(); */
    initPlayerhWizard();
    initJumpGuy();
  /*   initAttack(); */
    initGoblin();
    initDemon();
    initThrone();
    initPotion();
    initBat();
}

function initSpritesMenu()
{
    initOldJosephs();
    initActive();
}

function initSpriteBackground()
{
    GameOverScreen();
    
}

function initStory()
{
    initBackgroundStory();
}

function initControls()
{
    initA();
    initD();
    initS();
    initW();
    initL();
    initM();
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
    const imageSet = new ImageSet(0, 6, 57, 56, 57, 59, 0, 0);
    const frames = new Frames(11, 5);

    const physics = new Physics(40);

    const initTimeToChangeDirection = Math.floor(Math.random() * 3) + 1;

    const goblin = new Enemies(SpriteID.GOBLIN, State.LEFT_2, 55, 50, imageSet, frames, physics, initTimeToChangeDirection);
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

function initPlayerhWizard()
{
    const imageSet = new ImageSet(1330, 283, 35, 35, 35, 35, 0, 0);
    const frames = new Frames(4, 5);

    const physics = new Physics(40, 40, 0.98);

    const playerWizard = new Sprite(SpriteID.PLAYER_WIZARD, State.STILL_RIGHT, 100, 10, imageSet, frames, physics);
    
    globals.sprites.push(playerWizard);
}

function initJumpGuy()
{
    const imageSet = new ImageSet(287, 240, 16, 19, 16, 19, 0, 0);

    const frames = new Frames(7);

    const physics = new Physics(40, 40, 0.9, -100);

    const jumpGuy = new Sprite(SpriteID.JUMPGUY, State.JUMP, 0, 0, imageSet, frames, physics);

    globals.sprites.push(jumpGuy);
}

/* function initAttack()
{
    const imageSet = new ImageSet(289, 250, 19, 22, 17, 19, 0, 0);
    const frames =  new Frames(3);

    const attack = new Sprite(SpriteID.ATTACK, State.ACTIVE, 100, 10, imageSet, frames);

    globals.sprites.push(attack);
} */

function initDemon()
{
    const imageSet = new ImageSet(0, 456, 64, 63, 64, 65, 0, 0);
    const frames = new Frames(4, 5);

    const physics = new Physics(40);

    const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

    const demon = new Enemies(SpriteID.DEMON, State.DOWN_3, 305, 75, imageSet, frames, physics,initTimeToChangeDirection);

    globals.sprites.push(demon);
}

function initPotion()
{
    const imageSet = new ImageSet(510, 567, 30, 33, 28, 35, 0, 0);

    const frames = new Frames(5, 5);

    const potion = new Sprite(SpriteID.POTION, State.ACTIVATED_SKILL, 210, 58, imageSet, frames);

    globals.sprites.push(potion);
}

function initThrone()
{
    const imageSet = new ImageSet(415, 302, 59, 60, 59, 60, 0, 0);
    
    const frames = new Frames(1);

    const throne = new Sprite(SpriteID.THRONE, State.BE, 64, 69, imageSet, frames);

    globals.sprites.push(throne);
}

function initBat()
{
    const imageSet = new ImageSet(512, 292, 51, 58, 47, 58, 0, 0);
    const frames = new Frames(3, 5);

    const physics = new Physics(40);

    const bat = new Sprite(SpriteID.BAT, State.DOWN_4, 64, 64, imageSet, frames, physics);

    globals.sprites.push(bat);
}

function initOldJosephs()
{
    const imageSet1 = new ImageSet(700, 48, 50, 49, 50, 49, 0, 0);
    const imageSet2 = new ImageSet(700, 99, 50,49, 50, 49, 0, 0);

    const frames1 = new Frames(6);
    const frames2 = new Frames(6);

    const oldJoseph1 = new Sprite(SpriteID.OLD_JOSEPH1, State.RIGHT_JOSEPH, 100, 10, imageSet1, frames1);
    const oldJoseph2 = new Sprite(SpriteID.OLD_JOSEPH2, State.LEFT_JOSEPH, 100, 10, imageSet2, frames2);

    globals.spriteMenu.push(oldJoseph1);
    globals.spriteMenu.push(oldJoseph2);
}

function initActive()
{
    const imageSet = new ImageSet(1326, 3, 13, 16, 13, 16, 0, 0);
    const frames = new Frames(1);

    const active = new Sprite(SpriteID.ACTIVE, State.BE, 100, 10, imageSet, frames);

    globals.spriteMenu.push(active);
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

function GameOverScreen()
{
    const imageSet  = new ImageSet(870, 257, 426, 539, 402, 285, 0, 0);
    const frames = new Frames(1);


    const rip = new Sprite(SpriteID.RIP, State.BE, 100, 10, imageSet, frames);

    
    globals.spriteBackground.push(rip);

}
function initBackgroundStory()
{
    const imageSet = new ImageSet(1382, 5, 344, 290, 344, 290, 0, 0);
    const frames = new Frames(1);

    const backgroundStory = new Sprite(SpriteID.BACKGROUND_STORY, State.BE, 0, 0, imageSet, frames);

    globals.spriteStory.push(backgroundStory);
}

function initW()
{
    //UP
    const imageSet = new ImageSet(1153, 35, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const w = new Sprite(SpriteID.KEYBOARD_W, State.BE, 0, 0, imageSet, frames);

    globals.spriteControls.push(w);
}

function initS()
{
    //DOWN
    const imageSet = new ImageSet(1152, 52, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const s = new Sprite(SpriteID.KEYBOARD_S, State.BE, 0, 0, imageSet, frames);

    globals.spriteControls.push(s);
}

function initM()
{
    //MERGE WITH THE THRONE
    const imageSet = new ImageSet(1152, 68, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const m = new Sprite(SpriteID.KEYBOARD_M, State.BE, 0, 0, imageSet, frames);

    globals.spriteControls.push(m);
}

function initL()
{
    //ATTACK
    const imageSet = new ImageSet(1153, 85, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const l = new Sprite(SpriteID.KEYBOARD_L, State.BE, 0, 0, imageSet, frames);

    globals.spriteControls.push(l);
}

function initD()
{
    //RIGHT
    const imageSet = new ImageSet(1153, 103, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const d = new Sprite(SpriteID.KEYBOARD_D, State.BE, 0, 0, imageSet, frames);


    globals.spriteControls.push(d);
}

function initA()
{
    //LEFT
    const imageSet = new ImageSet(1153, 120, 18, 17, 18, 17, 0, 0);
    const frames = new Frames(1);

    const a = new Sprite(SpriteID.KEYBOARD_A, State.BE, 0, 0, imageSet, frames);

    globals.spriteControls.push(a);
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
    tileSet.src = "./images/tileSet.png";
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
    initEvents,
    initSpritesHUD,
    initSprites,
    initSpritesMenu,
    initSpriteBackground,
    initStory,
    initControls,
    initLevel
}