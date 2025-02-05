import globals from "./globals.js";
import {Game, SpriteID,State, FPS, Sound, ParticleState} from "./constants.js";
import Sprite, { Enemies} from "./sprites/Sprites.js";
import ImageSet from "./ImageSet.js";
import Frames from "./Frames.js";
import { Level, level, level2 } from "./Level.js";
import { keydownHandler, keyupHandler, updateMusic } from "./events.js";
import Physics from "./Physics.js";
import HitBox from "./HitBox.js";
import { Bat } from "./sprites/Bat.js";
import { Demon } from "./sprites/Demon.js";
import { Player } from "./sprites/Player.js";
import { Goblin } from "./sprites/Goblin.js";
import { Throne } from "./sprites/Throne.js";
import { Potion } from "./sprites/Potion.js";
import { Jumper } from "./sprites/Jumper.js";
import { Attack } from "./sprites/Attack.js";
import { Camera } from "./Camera.js";
import { BlueExplotion, RedExplotion } from "./sprites/Explotion.js";
import Time from "./Time.js";
import { ParticleLight } from "./sprites/Particles.js";
import { ThroneHUD } from "./sprites/ThroneHUD.js";
import JosephMenu from "./sprites/JosephMenu.js";

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
        merge:          false,
        esc:            false,
        enter:          false
    }

    globals.life = 125;
    globals.time = Time.time;
    globals.score = 0;
    globals.historyScore = [
        ["AAA", 12000], 
        ["BBB", 9000], 
        ["CCC", 2000],
        ["DDD", 1000],
        ["EEE", 900],
        ["FFF", 800],
        ["UWU", 650],
        ["XXA", 520],
        ["OUO", 100],
        ["PAM", 20]
    ];
    globals.highScore = globals.historyScore[0][1];

    globals.currentSound = Sound.NO_SOUND;
}

function initEvents()
{
    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);
}

function initSprites()
{
    initPlayer();
    initPlayerhWizard();
    initGoblin();
    initDemon();
    initThrone();
    initPotion();
    initBat();
    initAttack();
    initJumpGuy();
    initBlueExplotion();
    initRedExplotion();
    initSunLight();
    initKeys();
    initDoors();
}

function initSpritesMenu()
{
    initOldJosephs();
}

function initLoadSprite()
{
    initLoadJoseph();
}

function initSpriteBackground()
{
    GameOverScreen();
    initWinScreen();
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

function initParticles()
{
        initParticlesControls();
        initParticlesForHighscore();
        initParticlesForMainMenu();
        initParticlesForGameOver();
}
function initSpritesHUD()
{
    initHealthBarHUD();
    initThroneHUD();
    initStages();
}

function initGoblin()
{
    // [xPos, yPos, moveSpeed (default 1), multiplierMovement (default true)]
    let goblins = [
        [55,  50, 1.0, false],
        [524, 30, 1.5, false],
        [593, 173, 1.4, true],
        [593, 129, 1.0, false],
        [682, 154, 0.9, true]
    ];

    for (let i = 0; i < goblins.length; i++) 
    {
        const goblin = new Goblin(
            goblins[i][0], 
            goblins[i][1], 
            goblins[i][2], 
            goblins[i][3]
        );
        globals.sprites.push(goblin);
    }
} 

function initPlayer()
{
    //Create the image properties: . xInit, yInit, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset
    const imageSet = new ImageSet(0, 305, 41, 35, 39, 38, 0, 0);
    const frames = new Frames(7, 5);

    const physics = new Physics(40, 40, 0.98);

    const hitBox = new HitBox(10, 10, 6, 8);

    const player = new Player(SpriteID.PLAYER, State.STILL_DOWN, 92, 0, imageSet, frames, physics, hitBox);

    globals.sprites.push(player);
}

function initDemon()
{
    // [xPos, yPos, moveSpeed (default 1)]
    let demos = [
        [305, 75, 1.0], 
        [410, 48, 1.5],
        [505, 68, 1.4]
    ];

    for (let i = 0; i < demos.length; i++)
    {
        let demon = new Demon(demos[i][0], demos[i][1], demos[i][2]);
        globals.sprites.push(demon);
    }
}

function initPotion()
{
    const imageSet = new ImageSet(510, 567, 30, 33, 28, 35, 0, 0);
    const frames = new Frames(5, 5);

    const hitBox = new HitBox(18, 20, 0, 0);

    const potion = new Potion(SpriteID.POTION, State.ACTIVATED_SKILL, 210, 55, imageSet, frames, null, hitBox);

    globals.sprites.push(potion);
}

function initThrone()
{
    const imageSet = new ImageSet(415, 302, 59, 60, 59, 60, 0, 0);
    const frames = new Frames(1);

    const hitBox = new HitBox(33, 33, 0, 0);

    const throne = new Throne(SpriteID.THRONE, State.BE, 60, 85, imageSet, frames, null, hitBox);

    globals.sprites.push(throne);
}

function initBat()
{

    // [xPos, yPos, moveSpeed (default 1)]
    let bats = [
        [64, 64, 1.0], 
        [602, 171, 1.0],
    ];

    for (let i = 0; i < bats.length; i++)
    {
        let bat = new Bat(bats[i][0], bats[i][1], bats[i][2]);
        globals.sprites.push(bat);
    }
}

function initPlayerhWizard()
{
    const imageSet = new ImageSet(1330, 273, 35, 30, 35, 35, 0, 0);
    const frames = new Frames(4, 5);

    const physics = new Physics(40, 40, 0.98);

    const hitBox = new HitBox(10, 12, 6, 6);

    const playerWizard = new Player(SpriteID.PLAYER_WIZARD, State.STILL_RIGHT_WIZARD, 100, 10, imageSet, frames, physics, hitBox);
    
    globals.sprites.push(playerWizard);
} 

function initJumpGuy()
{
    const imageSet = new ImageSet(287, 240, 16, 19, 16, 19, 0, 0);
    const frames = new Frames(7);

    const physics = new Physics(40, 40, 0.9, -100);

    const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;

    const hitBox = new HitBox(8, 9, 0, 0);

    const jumpGuy = new Jumper(SpriteID.JUMPGUY, State.JUMP, 20, 0, imageSet, frames, physics, initTimeToChangeDirection, hitBox);

    globals.sprites.push(jumpGuy);
}

function initAttack()
{
    const attack = new Attack();
    globals.sprites.push(attack);
} 

function initOldJosephs()
{
    const imageSet1 = new ImageSet(700, 48, 50, 49, 50, 49, 0, 0);
    const imageSet2 = new ImageSet(700, 148, 50,49, 50, 49, 0, 0);

    const frames1 = new Frames(6);
    const frames2 = new Frames(6);

    const physics = new Physics(20);

    const hitBox = new HitBox(16, 51, 5, 0);

    const oldJoseph1 = new JosephMenu(SpriteID.OLD_JOSEPH1, State.RIGHT_JOSEPH, 40, 212, imageSet1, frames1, physics, hitBox);
    const oldJoseph2 = new JosephMenu(SpriteID.OLD_JOSEPH2, State.LEFT_JOSEPH, 340, 205, imageSet2, frames2, physics, hitBox );

    globals.spriteMenu.push(oldJoseph1);
    globals.spriteMenu.push(oldJoseph2);
}

function initThroneHUD()
{
    const throneHUB = new ThroneHUD();

    globals.spritesHUD.push(throneHUB);
}

function initHealthBarHUD()
{
    const imageSet = new ImageSet(165, 474, 58, 19, 58, 20, 0, 0);
    const imageSetEmpty = new ImageSet(175, 459, 58, 19, 58, 19, 0, 0);

    const framesEmpty = new Frames(1);
    const frames = new Frames(1);

    const healthBarEmpty = new Sprite(SpriteID.HEALTH_BAR_EMPTY, State.BE, 100, 10, imageSetEmpty, framesEmpty);
    const healthBar = new Sprite(SpriteID.HEALTH_BAR, State.BE, 100, 10, imageSet, frames);

    globals.spritesHUD.push(healthBarEmpty);
    globals.spritesHUD.push(healthBar);
}

function initStages()
{
    const imageSet = new ImageSet(995, 3, 71, 78, 71, 78, 0, 0);
    const imageSet1 = new ImageSet(2, 1543, 59, 55, 59, 55, 0, 0);
    const frames = new Frames(1);

    const moon = new Sprite(SpriteID.MOON, State.MOON, 0, 40, imageSet1, frames);
    const sun = new Sprite(SpriteID.SUN, State.SUN, -8, 30, imageSet, frames);

    globals.spritesHUD.push(moon);
    globals.spritesHUD.push(sun);
}

function initDoors()
{
    const imageSet = new ImageSet(409, 1126, 34, 45, 34, 45, 0, 0);
    const frames = new Frames(1);
    const hitBox = new HitBox(70, 95, 0, 0);

    const door = new Sprite(SpriteID.DOOR, State.BE, 671, 90, imageSet, frames, null, hitBox);

    globals.sprites.push(door);

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
    const imageSet = new ImageSet(1382, 5, 344, 265, 344, 290, 0, 0);
    const frames = new Frames(1);

    const backgroundStory = new Sprite(SpriteID.BACKGROUND_STORY, State.BE, 0, 0, imageSet, frames);

    globals.spriteStory.push(backgroundStory);
}

function initW()
{
    //UP
    const imageSet = new ImageSet(1151, 0, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const w = new Sprite(SpriteID.KEYBOARD_W, State.BE, 33, 107, imageSet, frames);

    globals.spriteControls.push(w);
}

function initS()
{
    //DOWN
    const imageSet = new ImageSet(1151, 42, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const s = new Sprite(SpriteID.KEYBOARD_S, State.BE, 32, 167, imageSet, frames);

    globals.spriteControls.push(s);
}

function initM()
{
    //MERGE WITH THE THRONE
    const imageSet = new ImageSet(1152, 105, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const m = new Sprite(SpriteID.KEYBOARD_M, State.BE, 255, 190, imageSet, frames);

    globals.spriteControls.push(m);
}

function initL()
{
    //ATTACK
    const imageSet = new ImageSet(1151, 84, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const l = new Sprite(SpriteID.KEYBOARD_L, State.BE, 255, 105, imageSet, frames);

    globals.spriteControls.push(l);
}

function initD()
{
    //RIGHT
    const imageSet = new ImageSet(1151, 63, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const d = new Sprite(SpriteID.KEYBOARD_D, State.BE, 32, 197, imageSet, frames);


    globals.spriteControls.push(d);
}

function initA()
{
    //LEFT
    const imageSet = new ImageSet(1151, 21, 23, 21, 23, 21, 0, 0);
    const frames = new Frames(3, 7);

    const a = new Sprite(SpriteID.KEYBOARD_A, State.BE, 33, 135, imageSet, frames);

    globals.spriteControls.push(a);
}

function initLoadJoseph()
{
    const imageSet = new ImageSet(0, 779, 19, 19, 19, 19, 0, 0);
    const frames = new Frames(4);

    const physics = new Physics(40);

    const loadJoseph = new Sprite(SpriteID.LOAD_JOSEPH, State.LEFT_JOSEPH, 250, 130, imageSet, frames, physics, null);
    
    globals.spriteLoading.push(loadJoseph);
}

function initCamera()
{
    globals.camera = new Camera(0, 0, 1);
}


function initBlueExplotion()
{
    const blueExplotion = new BlueExplotion();

    globals.sprites.push(blueExplotion)
}

function initRedExplotion()
{
    const redExplotion = new RedExplotion();

    globals.sprites.push(redExplotion)
}


function initSunLight()
{  
    const numParticles = 100;
    const xInit = -40;
    const yInit = 50;
    const radius = 2.5;
    const alpha = 1;


    for ( let i = 0; i < numParticles; i++)
    {
        const velocity = Math.random() * 1 + 15;
        const aceleration = 20;
        const physics = new Physics(velocity, aceleration)

        const sunParticles = new ParticleLight(xInit, yInit, radius, alpha, physics);

        globals.particles.push(sunParticles);
    }
}

function initParticlesControls()
{
    const numParticles = 50;
    const radius = 2;
    const alpha = 1;

    for (let i = 0; i < numParticles; i++) 
    {
        const xPos = Math.random() * globals.canvas.width;  
        const yPos = Math.random() * globals.canvas.height; 

        const velocityX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1); 
        const velocityY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1);

        const growth = Math.random() * 0.1 + 0.05;

        const particle = new ParticleLight(xPos, yPos, radius, alpha, { velocityX, velocityY });
        particle.growth = growth;

        globals.particles.push(particle); 
    }
}

function initParticlesForHighscore() 
{
    const numParticles = 50;
    const radius = 2; 
    const alpha = 0.8;

    globals.particles = [];

    for (let i = 0; i < numParticles; i++) 
    {
        const xPos = Math.random() * globals.canvas.width; 
        const yPos = Math.random() * globals.canvas.height; 
        const velocity = Math.random() * 2 + 1; 

        const particleHighScore = new ParticleLight(xPos, yPos, radius, alpha, { velocity, acceleration: 0 });
        globals.particles.push(particleHighScore);
    }
}

function initParticlesForMainMenu() 
{
    const numParticles = 80;  
    const minRadius = 2;
    const maxRadius = 5;  
    const alpha = 0.6; 

    globals.particles = []; 

    const centerX = globals.canvas.width / 2;  
    const centerY = globals.canvas.height / 2;

    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2; 
        const speed = Math.random() * 2 + 1; 
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;  

        const colors = [
            `rgba(200, 0, 0, ${alpha})`,  
            `rgba(100, 100, 100, ${alpha})`,  
            `rgba(50, 50, 50, ${alpha})` 
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        globals.particles.push({xPos: centerX, yPos: centerY,radius,alpha,color,physics: {velocityX: Math.cos(angle) * speed,velocityY: Math.sin(angle) * speed,decay: 0.02  }});
    }
}

function initParticlesForGameOver()
{
    const numParticles = 50;
    const radius = 2;
    const alpha = 1;
    const explosionCenterX = globals.canvas.width / 2;  
    const explosionCenterY = globals.canvas.height / 2; 
    
    for (let i = 0; i < numParticles; i++) {
    
        const angle = Math.random() * Math.PI * 2;  
        const distance = Math.random() * 50 + 10; 
        
        const xPos = explosionCenterX + Math.cos(angle) * distance;
        const yPos = explosionCenterY + Math.sin(angle) * distance;

        const velocityX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1); 
        const velocityY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1);
    
        const growth = Math.random() * 0.1 + 0.05;
    
        const particle = new ParticleLight(xPos, yPos, radius, alpha, { velocityX, velocityY });
        particle.growth = growth;
        particle.life = 100; 
    
        globals.particles.push(particle); 
    }
    
}

function initWinScreen()
{
    const imageSet = new ImageSet(0, 1163, 407, 385, 407, 385, 0, 0);
    const frames = new Frames(1);

    const winScreen = new Sprite(SpriteID.WIN_SCREEN, State.BE, 0, 0, imageSet, frames);

    globals.spriteWinScreen.push(winScreen);
}

function initKeys()
{
    const imageSet1 = new ImageSet(882, 561, 40, 40, 40, 40, 0, 0);
    const imageSet2 = new ImageSet(882, 603, 40, 40, 40, 40, 0, 0);
    const imageSet3 = new ImageSet(882, 643, 40, 40, 40, 40, 0, 0);
    const imageSet4 = new ImageSet(882, 682, 40, 40, 40, 40, 0, 0);

    const frames = new Frames(1);

    const hitbox = new HitBox(40, 40, 0, 0);

    const key1 = new Sprite(SpriteID.KEY, State.BE, 350, 50, imageSet1, frames, null, hitbox);
    const key2 = new Sprite(SpriteID.KEY, State.BE, 420, 205, imageSet2, frames, null, hitbox);
    const key3  = new Sprite(SpriteID.KEY, State.BE, 760, 85, imageSet3, frames, null, hitbox);
    const key4 = new Sprite(SpriteID.KEY, State.BE, 730, 60, imageSet4, frames, null, hitbox);

    globals.sprites.push(key1);
    globals.sprites.push(key2);
    globals.sprites.push(key3);
    globals.sprites.push(key4);
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
    tileSet.src = "./images/tileset.png";
    globals.tileSets.push(tileSet);
    globals.assetsToLoad.push(tileSet);

    //Load Sounds
    let gameMusic = document.querySelector("#gameMusic");
    gameMusic.addEventListener("canplaythrough", loadHandler, false);
    gameMusic.addEventListener("timeupdate", updateMusic, false);
    gameMusic.load();
    globals.sounds.push(gameMusic);
    globals.assetsToLoad.push(gameMusic);
    
    let gameMusicNight = document.querySelector("#gameMusicNight");
    gameMusicNight.addEventListener("canplaythrough", loadHandler, false);
    gameMusicNight.load();
    globals.sounds.push(gameMusicNight);
    globals.assetsToLoad.push(gameMusicNight);


    let explotionSound = document.querySelector("#explotionSound");
    explotionSound.addEventListener("canplaythrough", loadHandler, false);
    explotionSound.load();
    globals.sounds.push(explotionSound);
    globals.assetsToLoad.push(explotionSound);
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

        for( let i = 0; i < globals.sounds.length; i++)
        {
            globals.sounds[i].removeEventListener("canplaythrough", loadHandler, false);
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

function initLevel2()
{
    const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);

    globals.level = new Level(level2, imageSet);

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
    initLevel,
    initLoadSprite,
    initCamera,
    initParticles,
    initLevel2
}