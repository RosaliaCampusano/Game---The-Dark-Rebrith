import { Game } from "./constants.js";
import globals from "./globals.js";

class Time
{
    internalTimer = 0;
    maxInternalTimer = 1;
    defaultTime = 180;
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
            globals.gameState = Game.OVER;
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