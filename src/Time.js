import { Game } from "./constants.js";
import globals from "./globals.js";
class Time
{
    internalTimer = 0;
    maxInternalTimer = 1;
    defaultTime = 9800;
    time;

    constructor()
    {
        this.time = this.defaultTime;
        globals.defaultTime = this.defaultTime;
    }

    update()
    {

        if (globals.time <= 0)
        {
            globals.gameState = Game.LOAD_ENTER_NAME;
        }

        if (this.internalTimer >= this.maxInternalTimer)
        {
            this.internalTimer = 0;
            globals.time--;
        }
        else
        {
            this.internalTimer += globals.deltaTime;
        }
    }
}

export default new Time();

//Before the implementation 

//-----------------------------

//New implementation 

export  class Timer {
    constructor(value, timeChangeValue)
    {
        this.value                      = value;                    // CURRENT TIMER VALUE
        this.timeChangeCounter          = 0;                        // VALUE CHANGE TIMER (SECONDS)
        this.timeChangeValue            = timeChangeValue;          // TIME TO CHANGE VALUE (SECONDS) 
    }

    update(deltaTime) 
    {
        this.timeChangeCounter += deltaTime;
        if (this.timeChangeCounter >= this.timeChangeValue) 
        {
            this.value--;
            this.timeChangeCounter = 0;
        }
    }
}