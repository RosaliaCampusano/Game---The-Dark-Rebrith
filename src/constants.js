//Game state

export const Game = 
{
    INVALID:                -1,
    LOADING:                 0,
    PLAYING:                 1,
    OVER:                    2,
    MAIN_MENU:               3,
    STORY:                   4,
    CONTROLS:                5,
    HIGHSCORE:               6                  
};

//Game Speed
export const FPS = 30;

export const MainMenuTexts = 
[
    ["NEW GAME"],
    ["CONTROLS"],
    ["STORY"],
    ["HIGHSCORE"]
];

export const WayOut = 
"Press ESC to exit";

export const SpriteID = {
    PLAYER:                 0,
    THRONEHUB:              1,
    GOBLIN:                 2,
    HEALTH_BAR_EMPTY:       3,
    HEALTH_BAR:             4,
    DEMON:                  5,
    THRONE:                 6,
    POTION:                 7,
    SUN:                    8,
    MOON:                   9,
    BAT:                    10,
    OLD_JOSEPH1:            11,
    OLD_JOSEPH2:            12,
    ACTIVE:                 13,
    BACKGROUND_STORY:       14,
    RIP:                    15,
    KEYBOARD_W:             16,
    KEYBOARD_A:             17,
    KEYBOARD_S:             18,
    KEYBOARD_D:             19,
    KEYBOARD_L:             20,
    KEYBOARD_M:             21,
    PLAYER_WIZARD:          22,
    ATTACK:                 23,
    JUMPGUY:                24,
    ATTACK:                 25
}

export const State = {

    //Player state
    UP:                     0,
    LEFT:                   1,
    DOWN:                   2,
    RIGHT:                  3,

    //ThroneHUB state
    MADNESS_0:              0,
    MADNESS_1:              1,

    //Goblin state
    DOWN_2:                 0,
    RIGHT_2:                1,
    UP_2:                   2,
    LEFT_2:                 3,
    DIE:                    4,

    //Demon state
    DOWN_3:                 0,
    UP_3:                   1,
    RIGTH_3:                2,

    //Throne state
    BE:                     0,

    //Bat state

    UP_4:                   0,
    RIGHT_4:                1,
    DOWN_4:                 2,
    LEFT_4:                 3,

    //Potion state
    ACTIVATED_SKILL:        0,

    //Level state
    //Level 1 = SUN
    //Level 2 = MOON
    MOON:                   0,
    SUN:                    1,

    //Old Joseph  1 State 
    RIGHT_JOSEPH:           0,
    
    //Old Joseph 2 State 
    LEFT_JOSEPH:            0,
    
       //Player Wizard 
    DOWN_WIZARD:            0,
    UP_WIZARD:              1,
    RIGHT_WIZARD:           2,
    LEFT_WIZARD:            3,
    UP_ATTACK_WIZARD:       4,
    RIGHT_ATTACK_WIZARD:    5,
    DOWN_ATTACK_WIZARD:     6,
    LEFT_ATTACK_WIZARD:     7,
    PUNCH_WIZARD:           8,
    STILL_DOWN:             9,
    STILL_UP:               10,
    STILL_RIGHT:            11,
    STILL_LEFT:             12,
    

    //Attack
    ACTIVE:                 0,

    //Jump Guy State
    JUMP:                   0,

    OFF:                    0

}

export const GRAVITY = 80;

//Keyboard key codes
export const Key = {
    UP:                 87,         //W
    DOWN:               83,         //S
    RIGHT:              68,         //D
    LEFT:               65,         //A
    ATTACK:             76,         //L
    MERGE_THRONE:       77          //M   
}

export const Tile = {
    SIZE_SPRITE:            0,     //For Sprites 
    SIZE_16:                1          //For tileSets
}

export const Block = 
{
    EMPTY:              0,
    BRICK:              1,
    COLUMN_UP:          2,
    COLUMN_DOWN:        3,
    RUG_LEFT:           4,
    RUG_MIDDLE:         5,
    RUG_RIGHT:          6,
    RUG_SHADOW:         7,
    RUG:                8,
    RUG_UP_SHADOW:      9,
    UP_DOOR_LEFT:       10,
    UP_DOOR_MIDDLE:     11,
    UP_DOOR_RIGHT:      12,
    DOWN_DOOR_LEFT:     13,
    DOWN_DOOR_MIDDLE:   14,
    DOWN_DOOR_RIGHT:    15

}