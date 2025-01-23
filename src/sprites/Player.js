import { Game, SpriteID, State } from "../constants.js";
import globals from "../globals.js";
import Sprite from "./Sprites.js";

export class Player extends Sprite
{
    poisoned = {
        lifeReduction: 0,
        duration: 0,
        isPoisoned: false
    };

    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox)

        if (globals.activedPlayer == null) {
            globals.activedPlayer = this
        }

        globals.spritesPlayers.push(this)
        
    }
    
    update()
    {
        super.update();

        if (globals.life <= 0)
        {
            globals.gameState = Game.OVER
        }

        this.handlerPoisoned()

        if (globals.activedPlayer.id != this.id) {
            this.xPos = -20;
            this.yPos = -30;
            return;
        }

        if (this.id == SpriteID.PLAYER_WIZARD && globals.activedPlayer.id === this.id) 
        {
            this.moveSpeed = 1.2;
            this.readKeyboardAndAssignState();
            this.handlerStateWizard();
        } else if (this.id === SpriteID.PLAYER && globals.activedPlayer.id === this.id)
        {
            this.moveSpeed = 1;
            this.readKeyboardAndAssignStatePlayer();
            this.handlerStatePlayer()

            this.healthRegeneration();
        }
        this.xPos += this.physics.vx * globals.deltaTime;
        this.yPos += this.physics.vy * globals.deltaTime;
        
        this.updateAnimationFrames()

        this.adjustPositionAfterCollision();
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

    healthRegeneration()
    {
        if (globals.life < globals.maxLife && this.internalTimer >= this.maxInternalTimer)
        {
            if (globals.life+15 <= globals.maxLife) {
                globals.life += 15;
            }else{
                globals.life = globals.maxLife
            }
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

        for (let index = 0; index < globals.sprites.length; index++) 
        {
            const sprite = globals.sprites[index];
            if (sprite.id == SpriteID.ATTACK) 
            {
                attack = sprite

                attack.update()
            }
        }

        switch(this.state)
        {
            case State.UP_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = -this.physics.vLimit * this.moveSpeed;
                attack.defaultPositionAndFrame();
                break;

            case State.DOWN_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = this.physics.vLimit * this.moveSpeed;
                attack.defaultPositionAndFrame();
                break;

            case State.RIGHT_WIZARD:
                this.physics.vx = this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                attack.defaultPositionAndFrame();
                break;

            case State.LEFT_WIZARD:
                this.physics.vx = -this.physics.vLimit * this.moveSpeed;
                this.physics.vy = 0;
                attack.defaultPositionAndFrame();
                break;

            case State.LEFT_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;

                attack.leftAttack(this)
                break;

            case State.RIGHT_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;

                attack.rightAttack(this)
                break;

            case State.UP_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                
                attack.upAttack(this)
                break;

            case State.DOWN_ATTACK_WIZARD:
                this.physics.vx = 0;
                this.physics.vy = 0;
                attack.downAttack(this)
                break;

            default:             
                this.physics.vx = 0;
                this.physics.vy = 0;
                this.frames.frameCounter = 0;
                this.frames.framesChangeCounter = 0;

                attack.defaultPositionAndFrame()
                
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
}



