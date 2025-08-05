import { Block, Game, SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import { Potion } from "./Potion.js";
import Sprite from "./Sprites.js";

export class Player extends Sprite
{
    mergeTime = 0;
    isMergedWithThrone = false;

    poisoned = {
        lifeReduction: 0,
        duration: 0,
        isPoisoned: false
    };

    defaultPos ={
        xPos: 0,
        yPos: 0
    }

    default = {
        imageSet: {x: 0, y: 0},
    }

    isCollidingWithEnemies = false;
    isCollidingWithKey = false;

    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox)

        this.defaultPos = {
            xPos: this.xPos,
            yPos: this.yPos
        }

        this.default.imageSet.x = imageSet.xInit;
        this.default.imageSet.y = imageSet.yInit;

        if (globals.activedPlayer == null) {
            globals.activedPlayer = this
        }

        globals.spritesPlayers.push(this)
    }

    flicker = false;
    update()
    {
        super.update();

        if (this.isCollidingWithEnemies) {
            this.imageSet.xInit = this.default.imageSet.x + 1000;
            this.imageSet.yInit = this.default.imageSet.y + 1000;
        
            if (this.flicker) {
                this.imageSet.xInit = this.default.imageSet.x;
                this.imageSet.yInit = this.default.imageSet.y;
                this.isCollidingWithEnemies = false;
            }
        
            if (!this.flickerTimer) {
                this.flickerTimer = 0;
            }
        
            this.flickerTimer += globals.deltaTime * 1000;
            if (this.flickerTimer >= 100) {
                this.flicker = !this.flicker;
                this.flickerTimer = 0;
            }
        } else {
            this.imageSet.xInit = this.default.imageSet.x;
            this.imageSet.yInit = this.default.imageSet.y;
            this.flickerTimer = null;
        }

        if (globals.life - 15 + (globals.maxLife * 0.75) <= globals.maxLife)
        {
            globals.sounds[globals.currentMusic].playbackRate = 1.5;
            globals.health_bar_saturation = 3;
        }else
        {
            globals.sounds[globals.currentMusic].playbackRate = 1;
            globals.health_bar_saturation = 1;
        }

        if (globals.life <= 15)
        {
            globals.gameState = Game.LOAD_ENTER_NAME;
            globals.life = globals.maxLife;
            this.xPos = this.defaultPos.xPos;
            this.yPos = this.defaultPos.yPos;
            globals.activedPlayer = globals.spritesPlayers[0]
        }

        this.handlerPoisoned()
        this.bigEvent()

        if (globals.activedPlayer.id != this.id) {
            this.xPos = -20;
            this.yPos = -30;
            return;
        }

        if (this.id == SpriteID.PLAYER_WIZARD && globals.activedPlayer.id === this.id) 
        {
            globals.isPlayerActive = true;
            this.moveSpeed = 1.7;
            this.readKeyboardAndAssignState();
            this.handlerStateWizard();
        } else if (this.id === SpriteID.PLAYER && globals.activedPlayer.id === this.id)
        {
            globals.isPlayerActive = false;
            this.moveSpeed = 1.5;
            this.readKeyboardAndAssignStatePlayer();
            this.handlerStatePlayer();
            this.healthRegeneration();
            if (!globals.isPlayerActive)
            {
                this.handlerStateWizard();
            }
        }
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
        
        this.updateAnimationFrames();
    }

    handlerPoisoned()
    {
        if (this.poisoned.isPoisoned)
        {
            if (globals.activedPlayer.id != this.id) {
                this.poisoned.isPoisoned = false
            }
            if (this.internalTimer >= this.maxInternalTimer)
            {
                globals.life -= this.poisoned.lifeReduction;
                this.poisoned.duration -= globals.deltaTime;
                if (this.poisoned.duration <= 0)
                {
                    this.poisoned.isPoisoned = false;
                }
            }
        }
    }

    addLife = 0;
    previousLife = 0;
    healthRegenerationCounter = 0;
    maxInternalCounter = 10;
    healthRegeneration()
    {
        if (globals.life > this.previousLife)
        {
            this.healthRegenerationCounter = 0;
            this.previousLife = globals.life;
        }
        this.healthRegenerationCounter += globals.deltaTime;
        if (this.healthRegenerationCounter >= this.maxInternalCounter)
        {
            this.healthRegenerationCounter = 0;
            this.addLife = 0;
            this.previousLife = globals.life;
        }
        if (globals.life >= this.previousLife && this.addLife < 10)
        {
            globals.life += 1;
            this.addLife += 1;
        }
        if (globals.life > globals.maxLife)
        {
            globals.life = globals.maxLife;
        }
    }

    readKeyboardAndAssignState()
    {
    
        this.state =  globals.action.moveLeft                             ? State.LEFT_WIZARD           : //Left key
                        globals.action.moveRight                          ? State.RIGHT_WIZARD          : //Right key
                        globals.action.moveUp                             ? State.UP_WIZARD             : //Up key
                        globals.action.moveDown                           ? State.DOWN_WIZARD           : //Down key
                        this.state === State.LEFT_WIZARD                  ? State.STILL_LEFT_WIZARD            : //No  key press left
                        this.state === State.RIGHT_WIZARD                 ? State.STILL_RIGHT_WIZARD           : //No  key press right
                        this.state === State.UP_WIZARD                    ? State.STILL_UP_WIZARD              : //No  key press up
                        this.state === State.DOWN_WIZARD                  ? State.STILL_DOWN_WIZARD            : //No  key press down
                        globals.action.moveAttack && this.state === State.STILL_LEFT_WIZARD  ? State.LEFT_ATTACK_WIZARD   : //Left key attack
                        globals.action.moveAttack && this.state === State.STILL_RIGHT_WIZARD ? State.RIGHT_ATTACK_WIZARD : //Right key attack
                        globals.action.moveAttack && this.state === State.STILL_UP_WIZARD    ? State.UP_ATTACK_WIZARD       : //Up key attack
                        globals.action.moveAttack && this.state === State.STILL_DOWN_WIZARD  ? State.DOWN_ATTACK_WIZARD   : //Down key attack
                        this.state;
    
    }

    handlerStateWizard() 
    {
        let attack;

    
        for (let i = 0; i < globals.sprites.length; i++) 
        {
            const sprite = globals.sprites[i];
            if (sprite.id == SpriteID.ATTACK) {
                attack = sprite;
                attack.update();
            }
        }
        
        if(!globals.isPlayerActive) return;

        switch (this.state) {
            case State.LEFT_WIZARD:
                this.physics.vx = -this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;

            case State.RIGHT_WIZARD:
                this.physics.vx = this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;

            case State.UP_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = -this.physics.vLimit * this.moveSpeed;
                break;

            case State.DOWN_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = this.physics.vLimit * this.moveSpeed;
                break;

            case State.LEFT_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.startAttack(this, 'left');
                break;

            case State.RIGHT_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.startAttack(this, 'right');
                break;

            case State.UP_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.startAttack(this, 'up');
                break;

            case State.DOWN_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.startAttack(this, 'down');
                break;

            default:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.defaultPositionAndFrame();
                break;
        }
    }

    handlerStatePlayer()
    {    
        switch(this.state)
        {
            case State.UP:
                this.physics.vx = 0;
                this.physics.vy = -this.physics.vLimit * this.moveSpeed;
                break;

            case State.DOWN:
                this.physics.vx = 0;
                this.physics.vy = this.physics.vLimit * this.moveSpeed;
                break;

            case State.RIGHT:
                this.physics.vx = this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;

            case State.LEFT:
                this.physics.vx = -this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                break;

            case State.STILL_UP:
                this.physics.vx = 0;
                this.physics.vy = 0;
                break;

            default:             
                this.physics.vx = 0;
                this.physics.vy = 0;
                
        }
    }

    readKeyboardAndAssignStatePlayer()
    {
        this.state =  globals.action.moveLeft ? State.LEFT : // Left key
                        globals.action.moveRight ? State.RIGHT : // Right key
                        globals.action.moveUp ? State.UP : // Up key
                        globals.action.moveDown ? State.DOWN : // Down key
                        this.state === State.LEFT                  ? State.STILL_LEFT            : //No  key press left
                        this.state === State.RIGHT                 ? State.STILL_RIGHT           : //No  key press right
                        this.state === State.UP                    ? State.STILL_UP              : //No  key press up
                        this.state === State.DOWN                  ? State.STILL_DOWN            : //No  key press down
                        this.state; // Maintain current state if no keys are pressed
    }

    numBick = 10;
    bigEventCouter = 0;
    bricksBigEvent = [];
    bigEvent()
    {
        if (globals.life <= globals.maxLife/2)
        {
            if (this.bigEventCouter === 0){

                const centerX = this.xPos;
                const centerY = this.yPos;
                const radius = 50;
                let isTurnBrick = true;

                for (let i = 0; i < this.numBick; i++) {
                    const angle = (Math.PI * 2) / this.numBick;
                    const x = centerX + Math.cos(angle * i) * radius;
                    const y = centerY + Math.sin(angle * i) * radius;
                    
                    if (this.getMapTileId(x, y) !== Block.BRICK){
                        if (isTurnBrick){
                            const block = this.getMapTileId(x, y);
                            this.bricksBigEvent.push({x, y, block});
                            this.setMapTileId(x, y, Block.BRICK);
                            isTurnBrick = false;
                        }else{
                            this.initPotion(x, y);
                            isTurnBrick = true;
                        }
                    }

                    this.bigEventCouter = 1;
                }
            }
        }

        if ((this.bigEventCouter === 1 && this.internalTimer >= this.maxInternalTimer) || globals.gameState !== Game.PLAYING)
        {
            for (let i = 0; i < globals.sprites.length; i++) {
                if (globals.sprites[i].id === SpriteID.POTION){
                    globals.sprites.splice(i, 1);
                }
            }

            for (let i = 0; i < this.bricksBigEvent.length; i++) {
                this.setMapTileId(this.bricksBigEvent[i].x, this.bricksBigEvent[i].y, this.bricksBigEvent[i].block);
            }

            this.bricksBigEvent = [];
            this.bigEventCouter = 0;
        }
    }

    initPotion(x, y)
    {
        const imageSet = new ImageSet(510, 567, 30, 33, 28, 35, 0, 0);
        const frames = new Frames(5, 5);
    
        const hitBox = new HitBox(18, 20, 0, 0);
    
        const potion = new Potion(SpriteID.POTION, State.ACTIVATED_SKILL, x, y, imageSet, frames, null, hitBox);
    
        return globals.sprites.push(potion);
    }
}