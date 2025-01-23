import { Game } from "./constants.js";
import globals from "./globals.js";

class Time
{
    internalTimer = 0;
    maxInternalTimer = 1;
    defaultTime = 1000;
    time;

    constructor()
    {
        this.time = this.defaultTime;
    }

    update()
    {
        globals.time = this.time;

        if (this.time <= 0)
        {
            this.time = this.defaultTime;
            globals.gameState = Game.OVER;
        }

        if (this.internalTimer >= this.maxInternalTimer)
        {
            this.internalTimer = 0;
            this.time--;
        }
        else
        {
            this.internalTimer += globals.deltaTime;
        }
    }
}

export default new Time();