import {Game} from "./constants.js"

export default 
{
    //Access to Canvas and context
    canvas: {},
    ctx: {},
    canvasHUD: {},
    ctxHUD: {},

    //Game State. Initialize a INVALID
    gameState: Game.INVALID,

    //Previous cycle time (milliseconds)
    previousCycleMilleseconds: -1,

    //Real cycle time (seconds)
    deltaTime: 0,

    cycleRealTime: 0,

    //Objective cycle time (seconds, constants)
    frameTimeObj: 0,

    spritesHUD: [],

    sprites: [],

    spritesPlayers: [],

    activedPlayer: null,

    spriteLoading: [],

    spriteMenu: [],

    spriteBackground: [],

    spriteStory: [],
    
    spriteControls: [],

    tileSet: {},

    assetsToLoad: [],
    assetsLoaded: 0,

    tileSets: [],

    level: {},

    action: {},  

    life: 0,

    maxLife: 125,

    score: 0,

    highScore: 0,

    time: 0,

    camera: {},

    saturate: 1,

    particles: []
}