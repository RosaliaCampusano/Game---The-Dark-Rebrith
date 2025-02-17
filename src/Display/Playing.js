import { Camera, updateCamera } from "../Camera.js";
import detectCollisions from "../collisions.js";
import { DisplaysID, Sound, SpriteID, State, Tile } from "../constants.js";
import { Display } from "../Display.js";
import { updateMusic } from "../events.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import { Level, level, level2 } from "../Level.js";
import Physics from "../Physics.js";
import { Attack } from "../sprites/Attack.js";
import { Bat } from "../sprites/Bat.js";
import { Demon } from "../sprites/Demon.js";
import { BlueExplotion, RedExplotion } from "../sprites/Explotion.js";
import { Goblin } from "../sprites/Goblin.js";
import { Jumper } from "../sprites/Jumper.js";
import { ParticleLight } from "../sprites/Particles.js";
import { Player } from "../sprites/Player.js";
import { Potion } from "../sprites/Potion.js";
import Sprite from "../sprites/Sprites.js";
import { Throne } from "../sprites/Throne.js";
import { ThroneHUD } from "../sprites/ThroneHUD.js";
import Time from "../Time.js";

export default class Playing extends Display {
    isPlaying = false;
    isDark = false;

    levelPosition = 0;
    fase = 1;
    reductor = 0.5;
    init() {

        this.levels = [JSON.parse(JSON.stringify(level)), JSON.parse(JSON.stringify(level2))];
        this.level = this.levels[0];

        // camera
        globals.camera = new Camera(0, 0, 1);
        // level
        const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);
        globals.level = new Level(this.level, imageSet);

        this.initSpritesHUD();
        this.initSprites();     

        const keydownHandler = (event) => {
            if (event.keyCode) {
                this.isPlaying = true;
                window.removeEventListener("keydown", keydownHandler, false);
            }
        };
        
        window.addEventListener("keydown", keydownHandler, false);
    }

    initSpritesHUD() {
        this.initHealthBarHUD();
        this.initThroneHUD();
        this.initStages();
    }

    initHealthBarHUD()
    {
        const imageSet = new ImageSet(165, 474, 58, 19, 58, 20, 0, 0);
        const imageSetEmpty = new ImageSet(175, 459, 58, 19, 58, 19, 0, 0);

        const framesEmpty = new Frames(1);
        const frames = new Frames(1);

        const healthBarEmpty = new Sprite(SpriteID.HEALTH_BAR_EMPTY, State.BE, 160, 75, imageSetEmpty, framesEmpty);
        const healthBar = new Sprite(SpriteID.HEALTH_BAR, State.BE, 152, 76, imageSet, frames);

        globals.spritesHUD.push(healthBarEmpty);
        globals.spritesHUD.push(healthBar);
    }

    initThroneHUD()
    {
        const throneHUB = new ThroneHUD();
    
        globals.spritesHUD.push(throneHUB);
    }

    initStages()
    {
        const imageSet = new ImageSet(1006, 0, 59, 53, 0, 0);
        // const imageSet = new ImageSet(1008, 54, 100, 100 /* 56, 55 */, 59, 55, 0, 0);
        // const frames = new Frames(1);
        const frames1 = new Frames(1);
    
        // const moon = new Sprite(SpriteID.MOON, State.MOON, 0, 15, imageSet1, frames);
        const sun = new Sprite(SpriteID.SUN, State.SUN, 0, 15, imageSet, frames1);
    
        // globals.spritesHUD.push(moon);
        globals.spritesHUD.push(sun);

    }

    initSprites() {
        if (this.fase === 1){
            this.initPlayer();
            this.initPlayerhWizard();
        }
        this.initGoblin();
        this.initDemon();
        this.initThrone();
        this.initPotion();
        this.initBat();
        this.initAttack();
        this.initJumpGuy();
        this.initBlueExplotion();
        this.initRedExplotion();
        this.initSunLight();
    }

    initPlayer()
    {
        //Create the image properties: . xInit, yInit, xSize, ySize, xGridSize, yGridSize, xOffset, yOffset
        const imageSet = new ImageSet(0, 305, 41, 35, 39, 38, 0, 0);
        const frames = new Frames(7, 5);
    
        const physics = new Physics(40, 40, 0.98);
    
        const hitBox = new HitBox(10, 10, 6, 8);
    
        const player = new Player(SpriteID.PLAYER, State.STILL_DOWN, 100, 10, imageSet, frames, physics, hitBox);
    
        globals.sprites.push(player);
    }

    initPlayerhWizard()
    {
        const imageSet = new ImageSet(1330, 273, 35, 30, 35, 35, 0, 0);
        const frames = new Frames(4, 5);
    
        const physics = new Physics(40, 40, 0.98);
    
        const hitBox = new HitBox(10, 12, 6, 6);
    
        const playerWizard = new Player(SpriteID.PLAYER_WIZARD, State.STILL_DOWN_WIZARD, 100, 10, imageSet, frames, physics, hitBox);
        
        globals.sprites.push(playerWizard);
    } 
    
    initGoblin()
    {
        // [xPos, yPos, moveSpeed (default 1), multiplierMovement (default true)]
        let goblins = [];
        if (this.fase === 1)
        {
            goblins = [
                [55,  50, 1.0 + (this.fase * this.reductor), false],
                [524, 30, 1.5 + (this.fase * this.reductor), false],
                [593, 173, 1.4 + (this.fase * this.reductor), true],
                [593, 129, 1.0 + (this.fase * this.reductor), false],
                [682, 154, 0.9 + (this.fase * this.reductor), true]
            ];
        }
        if (this.fase === 3)
        {
            goblins = [
                [55,  50, 1.0 + (this.fase * this.reductor), false],
                [524, 15, 1.5 + (this.fase * this.reductor), false],
                [593, 30, 1.0 + (this.fase * this.reductor), false],
                [400, 191, 1.4 + (this.fase * this.reductor), false],
                [682, 190, 0.9 + (this.fase * this.reductor), true]
            ];
        }
    
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

    initDemon()
    {
        // [xPos, yPos, moveSpeed (default 1)]
        let demos = [];
        if (this.fase === 1)
        {
            demos = [
                [305, 75, 1.0 + (this.fase * this.reductor)], 
                [410, 48, 1.5 + (this.fase * this.reductor)],
                [505, 68, 1.4 + (this.fase * this.reductor)]
            ];
        }
        
        if (this.fase === 3)
        {
            demos = [
                [45,  50, 1.0 + (this.fase * this.reductor)],
                [184, 75, 1.0 + (this.fase * this.reductor)], 
                [410, 48, 1.5 + (this.fase * this.reductor)],
                [505, 68, 1.4 + (this.fase * this.reductor)],
                [655, 82, 1.4 + (this.fase * this.reductor)],
                [265, 63, 1.4 + (this.fase * this.reductor)],
                [744, 138, 1.0 + (this.fase * this.reductor)],
            ];
        }

    
        for (let i = 0; i < demos.length; i++)
        {
            let demon = new Demon(demos[i][0], demos[i][1], demos[i][2]);
            globals.sprites.push(demon);
        }
    }

    initThrone()
    {
        const imageSet = new ImageSet(415, 302, 59, 60, 59, 60, 0, 0);
        const frames = new Frames(1);
    
        const hitBox = new HitBox(33, 33, 0, 0);
    
        const throne = new Throne(SpriteID.THRONE, State.BE, 60, 85, imageSet, frames, null, hitBox);
    
        globals.sprites.push(throne);
    }

    initPotion()
    {
        const imageSet = new ImageSet(510, 567, 30, 33, 28, 35, 0, 0);
        const frames = new Frames(5, 5);
    
        const hitBox = new HitBox(18, 20, 0, 0);
    
        const potion = new Potion(SpriteID.POTION, State.ACTIVATED_SKILL, 210, 55, imageSet, frames, null, hitBox);
    
        globals.sprites.push(potion);
    }

    initBat()
    {
    
        // [xPos, yPos, moveSpeed (default 1)]
        let bats = []
        if (this.fase === 1)
        {
            bats = [
                [64, 64, 1.0 + (this.fase * this.reductor)], 
                [602, 171, 1.0 + (this.fase * this.reductor)],
            ];
        }

        if (this.fase === 3)
        {
            bats = [
                [64, 64, 1.0 + (this.fase * this.reductor)], 
                [602, 171, 1.0 + (this.fase * this.reductor)],
                [502, 81, 1.0 + (this.fase * this.reductor)],
                [202, 51, 1.0 + (this.fase * this.reductor)],
            ];
        }

    
        for (let i = 0; i < bats.length; i++)
        {
            let bat = new Bat(bats[i][0], bats[i][1], bats[i][2]);
            globals.sprites.push(bat);
        }
    }

    initAttack()
    {
        const attack = new Attack();
    
        globals.sprites.push(attack);
    } 

    initJumpGuy()
    {
        if (this.fase !== 1) return;
        const imageSet = new ImageSet(287, 240, 16, 19, 16, 19, 0, 0);
        const frames = new Frames(7);
    
        const physics = new Physics(40, 40, 0.9, -100);
    
        const initTimeToChangeDirection = Math.floor(Math.random() * 2) + 1;
    
        const hitBox = new HitBox(8, 9, 0, 0);
    
        const jumpGuy = new Jumper(SpriteID.JUMPGUY, State.JUMP, 20, 0, imageSet, frames, physics, initTimeToChangeDirection, hitBox);
    
        globals.sprites.push(jumpGuy);
    }

    initBlueExplotion()
    {
        const blueExplotion = new BlueExplotion();
    
        globals.sprites.push(blueExplotion)
    }

    initRedExplotion()
    {
        const redExplotion = new RedExplotion();
    
        globals.sprites.push(redExplotion)
    }

    initSunLight()
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

    destroy() {
        globals.level = null;
        globals.camera = null;
        globals.particles = [];
        globals.sprites = [];
        globals.spritesHUD = [];
        globals.activedPlayer = null;
        globals.score = 0;
        globals.spritesPlayers = [];
        this.isPlaying = false;
        this.level = this.levels[0]
        this.fase = 1
        this.potions = []
        this.isBullRun = false
        globals.fase = [1,1]
        globals.sounds.forEach(sound => sound.pause())
        globals.currentSound = Sound.NO_SOUND
    }

    render() {
        this.displayHUD();
        globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
        globals.ctxHUD.clearRect(0, 0, globals.canvasHUD.width, globals.canvasHUD.height);
        
        // zoom the canvas
        globals.ctx.scale(globals.camera.zoom, globals.camera.zoom);
        globals.canvas.style.filter = `saturate(${globals.saturate})`
        this.moveCamera();


        if (this.isDark)
        {
            this.drawFullBlackBackground();
            this.createVisibilityMask();
        }

        this.renderMap();
        
        this.renderHUD();
        
        if (!this.isPlaying) {
            this.renderPlayer();
            return
        };
        
        this.renderSprites();

        globals.ctx.restore(); 
        
    
        this.renderParticles();
    
        globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawFullBlackBackground() 
    {
        const ctx = globals.ctx;
        const canvasWidth = globals.canvas.width;
        const canvasHeight = globals.canvas.height;
    
        ctx.fillStyle = "rgba(0, 0, 0, 1)"; 
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    createVisibilityMask() 
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

    displayHUD()
    {
        const canvasHeight = 240;
        // const canvasHUDHeight = 100;
    
        globals.canvasHUD.style.display = '';
        globals.canvas.style.height = '';
        globals.canvas.height = canvasHeight;
    }

    moveCamera()
    {
        const xTranslation = -globals.camera.x; 
        const yTranslation = -globals.camera.y;
    
        globals.ctx.translate(xTranslation, yTranslation);
    }

    renderMap()
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

    renderMapLevelTwo()
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

    renderHUD()
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
    
        // Draw Time
        globals.ctxHUD.fillStyle = 'red';
        globals.ctxHUD.fillText("TIME", 58, 70);
        globals.ctxHUD.fillStyle = 'white';
        globals.ctxHUD.fillText("" + time, 60, 88);

        // Draw Fase
        globals.ctxHUD.fillStyle = 'red';
        globals.ctxHUD.fillText("Fase", 110, 70);
        globals.ctxHUD.fillStyle = 'white';
        globals.ctxHUD.fillText("" + globals.fase[0]+"-"+globals.fase[1], 115, 88);
    
        this.renderSpritesHUD();
    }

    renderSpritesHUD()
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

    renderSprites()
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
            
            // drawHitBox(sprite);
        }
    }

    renderPlayer()
    {
        const sprite = globals.activedPlayer;
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
    }

    renderParticles()
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

    isBullRun = false;
    countBullRun = 0;

    update(){
        if (!this.isPlaying) return;

        if (globals.life <= (globals.maxLife / 2) && !this.isBullRun && this.countBullRun == 0)
        {
            this.bullRunEvent();
            this.countBullRun = 1
        }

        this.updateFase();
        this.updateHighScore();
        Time.update();
        // HUD
        for (let i = 0; i < globals.spritesHUD.length; i++)
        {
            const sprite = globals.spritesHUD[i]
            this.updateSprite(sprite);
        }

        // Sprites
        for (let i = 0; i < globals.sprites.length; i++)
        {
            const sprite = globals.sprites[i]
            this.updateSprite(sprite);
        }

        // Potions
        for (let i = 0; i < globals.sprites.length; i++)
        {
            const sprite = globals.sprites[i]
            
            this.potions.forEach(position => {
                if (i == position)
                {
                    if (sprite.isCollidingWithPlayer && this.isBullRun)
                    {
                        this.removeByIndexesInPlace(globals.sprites, this.potions);
                        /* for (let i = 0; i < globals.sprites.length; i++)
                        {
                            const sprite = globals.sprites[i]
                        } */
                        // globals.sprites.splice(i, 1)

                        // reset level
                        this.level = this.levelPosition == 0 ? JSON.parse(JSON.stringify(level)) : JSON.parse(JSON.stringify(level2))
                        
                        const imageSet = new ImageSet(0, 0, 16, 16, 16, 16, 0, 0);
                        globals.level = new Level(this.level, imageSet);
                        
                        this.initJumpGuy();
                        this.isBullRun = false;
                    }
                }
            })            
        }

        updateCamera();
        detectCollisions();
        updateMusic();
        this.playMusic()
        this.playSound();
    }

    removeByIndexesInPlace(dataArray, indexesToRemove) {
        indexesToRemove.sort((a, b) => b - a);
        for (let index of indexesToRemove) {
            dataArray.splice(index, 1);
        }
    }

    potions = []

    bullRunEvent()
    {
        const rows = this.level.length;
        const cols = this.level[0].length;
    
        const numObstacles = Math.floor((globals.maxLife - globals.life) / globals.maxLife * 20)
        
        for (let i = 0; i < numObstacles; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * rows);
                y = Math.floor(Math.random() * cols);
            } while (this.level[x][y] !== 8);
    
            this.level[x][y] = 1;
        }

        for (let i = 0; i < globals.sprites.length; i++) {
            const sprite = globals.sprites[i];

            if (sprite.id === SpriteID.JUMPGUY) {
                globals.sprites.splice(i, 1);
            }
        }

        for (let i = 0; i < numObstacles * 2; i++) {    
            const xPos = globals.activedPlayer.xPos
            const yPos = globals.activedPlayer.yPos
            let angle = Math.PI * (i / numObstacles)
            const radius = 80;

            const imageSet = new ImageSet(510, 567, 30, 33, 28, 35, 0, 0);
            const frames = new Frames(5, 5);
        
            const hitBox = new HitBox(18, 20, 0, 0);
        
            const potion = new Potion(SpriteID.POTION, State.ACTIVATED_SKILL, xPos + Math.cos(angle) * radius /* + x + z */, yPos + Math.sin(angle) * radius /* + y + z */, imageSet, frames, null, hitBox);

            potion.frames.frameCounter = State.POTION_YELLOW
        
            const position = globals.sprites.push(potion);

            this.potions.push(position)
        }

        this.isBullRun = true;
    }

    playSound()
    {
        if( globals.currentSound != Sound.NO_SOUND)
        {
            globals.sounds[globals.currentSound].currentTime = 0;
            globals.sounds[globals.currentSound].play();
        }

        globals.currentSound = Sound.NO_SOUND
    }
    
    playMusic()
    {
        if(globals.gameState === DisplaysID.PLAYING)
        {
            globals.sounds[Sound.GAME_MUSIC].play();
            globals.sounds[Sound.GAME_MUSIC].volume = 1;
        }

        // globals.currentSound = Sound.GAME_MUSIC;
    }

    updateMoon(sprite)
    {
        sprite.xPos = 0;
        sprite.yPos = 70;
        
        sprite.imageSet.ySize = 100;
    
        sprite.state = State.BE;
    }
    
    updateSun(sprite)
    {
        sprite.xPos = 0;
        sprite.yPos = 40;
        sprite.imageSet.ySize = 45;
        sprite.imageSet.ySize *= 0.5;
        sprite.state = State.BE;
    }

    updateHighScore()
    {

        let positionXXX = globals.historyScore.findIndex(score => score[0] === "XXX");

        let insertIndex = -1;
        globals.historyScore.some((score, index) => {
            if (globals.score > score[1] && score[0] !== "XXX" && index < positionXXX) {
                insertIndex = index;
                return true; 
            }
            return false;
        });

        if (insertIndex !== -1) {
            globals.historyScore.splice(insertIndex, 0, ["XXX", globals.score]);
            globals.historyScore.splice(positionXXX + 1, 1);
        }

        globals.highScore = globals.historyScore[0][1];
    }

    updateFase(){
        if (globals.score > globals.highScore) {
            globals.gameState = DisplaysID.WIN;
            return;
        }

        let positionXXX = 4;
        let shouldAdvance = globals.historyScore.some((score, index) => {
            if (score[0] === "XXX") {
                positionXXX = index;
            }

            return globals.score > score[1] && score[0] !== "XXX" && index < positionXXX;
        });

        if (shouldAdvance) {
            if (globals.fase[1] === 1) {
                globals.fase[1] = 2;
                this.fase++
                this.isDark = true
            } else if (globals.fase[1] === 2 && globals.fase[0] === 1) {
                globals.fase[0] = 2;
                globals.fase[1] = 1;
                this.fase++;
                this.isDark = false;

                this.level = this.levels[1]
                this.levelPosition = 1;

                let player = null;
                let playerWizard = null;
                globals.sprites.forEach((sprite, index, array) => {
                    if (sprite.id === SpriteID.PLAYER) {
                        player = sprite;
                    }

                    if (sprite.id === SpriteID.PLAYER_WIZARD) {
                        playerWizard = sprite;
                    }
                })

                globals.sprites = []

                globals.sprites.push(player, playerWizard)

                const imageSet = new ImageSet(0, 0, 16, 17, 16, 16, 0, 0);
                globals.level = new Level(this.level, imageSet)

                this.initSprites()
            }
        }
    }

    updateSprite(sprite)
    {
        const type = sprite.id;
        switch(type)
        {
            case SpriteID.HEALTH_BAR:
                this.updateHealthBar(sprite);
                break;
    
            case SpriteID.HEALTH_BAR_EMPTY:
                this.updateEmptybar(sprite);
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
                this.updateStages(sprite);
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

            case SpriteID.SUN:
                this.updateSun(sprite);
                break;
    
            case SpriteID.MOON:
                this.updateMoon(sprite);
                break;
            default:
    
                break;
        }
    }

    updateHealthBar(sprite)
    {
        sprite.xPos = 152;
        sprite.yPos = 76;
        sprite.imageSet.xSize = globals.life;
        
        sprite.imageSet.xSize *= 0.5;
    
        sprite.state = State.BE;
    }

    updateEmptybar(sprite)
    {
        sprite.xPos = 160;
        sprite.yPos = 75;

        sprite.imageSet.xSize = 55;

        sprite.state = State.BE;
    }

    updateStages(sprite)
    {
        sprite.xPos = 0;
        sprite.yPos = 40;

        sprite.frames.frameCounter = 0;

        sprite.state = State.SUN;
    }
}