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

    spritesKeys: [],

    activedKey: null,

    spritesAttack: [],

    spritesPlayers: [],

    activedPlayer: null,

    spriteLoading: [],

    spriteMenu: [],

    spriteBackground: [],

    spriteWinScreen: [],

    spriteStory: [],

    spriteHighScore: [],

    spriteHighScorePosition: [],
        
    spriteControls: [],

    tileSet: {},

    assetsToLoad: [],
    assetsLoaded: 0,

    tileSets: [],

    level: {},

    levels: [],

    isPlaying: false,

    fase: [1,1],

    counterFase: 1,

    isDark: false,

    messageToDoor: {
        x: 0,
        y: 0,
        text: "",
        color: "white"
    },

    action: {},  

    life: 0,

    maxLife: 125,

    score: 0,

    highScore: 0,

    historyScore: [],

    highScoreQuantity: 10,

    highScoreInit: 0,

    controlerHighScoreInit: 0,

    playerName: "",

    time: 0,

    levelCrazy: 1,
    
    defaultTime: 0,

    camera: {},

    saturate: 1,

    particles: [],

    sounds: [],

    currentSound: -1,
    
    levelTimer: {},

    currentMusic: -1,

    incorrectKey: false,
    
}