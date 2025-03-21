import { State } from "../constants.js";
import globals from "../globals.js";
import Sprite from "./Sprites.js";

export class Potion extends Sprite
{

    positions = [
        {xPos: 210, yPos: 55},
        {xPos: 754, yPos: 93},
        {xPos: 28, yPos: 188},
        {xPos: 419, yPos: 204},
        {xPos: 679, yPos: 56},
    ]

    update()
    {
        super.update();
        this.frames.framesChangeCounter += globals.deltaTime;
    
        if (this.isCollidingWithPlayer)
        {
            if (this.frames.frameCounter === State.POTION_YELLOW)
            {
                globals.score += 100;
            }
    
            if (this.frames.frameCounter === State.POTION_GREEN)
            {
                globals.madnessDeleted = true;
                
                if (globals.life + 50 <= 125) {
                    globals.life += 50;
                }else{
                    globals.life = 125
                }
            }
    
            if (this.frames.frameCounter === State.POTION_RED)
            {
                if (globals.life > 20)
                {
                    globals.life = 20;
                }
            }
    
            if (this.frames.frameCounter === State.POTION_PURPLE)
            {
                globals.activedPlayer.poisoned = {
                    lifeReduction: 10,
                    duration: 1,
                    isPoisoned: true
                };
            }
    
        }
    
        if (this.frames.framesChangeCounter >= this.frames.speed) 
        {
            this.frames.framesChangeCounter = 0;
            this.frames.frameCounter++;
    
            if (this.frames.frameCounter >= this.frames.framesPerState) {
                this.frames.frameCounter = 0;
            }
        }

        this.event();
    }

    event(){
        if (this.focusPlayer)
        {
            while (true) {
                const randomPositionNumber = Math.floor(Math.random() * this.positions.length);
                const position = this.positions[randomPositionNumber];
                const xPos = position.xPos;
                const yPos = position.yPos;
    
                if (this.xPos != xPos && this.yPos != yPos)
                {
                    this.xPos = xPos;
                    this.yPos = yPos;
                    break;
                }
            }
        }
    }

    getPotionColor() {
        switch (this.frames.frameCounter) {
            case State.POTION_RED:
                return 'red';  
            case State.POTION_BLUE:
                return 'blue'; 
            case State.POTION_PURPLE:
                return 'purple';
            case State.POTION_YELLOW:
                return 'yellow';
            case State.POTION_GREEN:
                return 'green';  
        }
    }
    
}

