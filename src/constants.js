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
    HIGHSCORE:               6,
    WIN:                     7                  
};

//Game Speed
export const FPS = 30;

export const Sound = {

    NO_SOUND:          -1,
    GAME_MUSIC:         0,
    EXPLOTION:          1,
    GAME_MUSIC_NIGHT:   2,
}

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
    CAST_A_SPELL:           23,
    JUMPGUY:                24,
    ATTACK:                 25,
    LOAD_JOSEPH:            26,
    BLUE_EXPLOTION:         27,
    RED_EXPLOTION:          28,
    WIN_SCREEN:             29,
    KEY1:                   30,
    KEY2:                   31, 
    KEY3:                   32,
    KEY4:                   33
}

export const ParticleID = 
{
    SUN:                    0,
    RED:                    1,
    SHINE:                  2
}

export const State = {

    //Player state
    UP:                     0,
    LEFT:                   1,
    DOWN:                   2,
    RIGHT:                  3,
    STILL_UP:               4,
    STILL_LEFT:             5,
    STILL_DOWN:             6,
    STILL_RIGHT:            7,

    //ThroneHUB state
    MADNESS_0:              0,
    MADNESS_1:              1,
    MADNESS_2:              2,
    MADNESS_3:              3,
    MADNESS_4:              4,
    MADNESS_5:              5,

    //Goblin state
    DOWN_2:                 0,
    RIGHT_2:                1,
    UP_2:                   2,
    LEFT_2:                 3,
    DIE:                    4,

    //Demon state
    DOWN_3:                 0,
    UP_3:                   1,

    //Throne state
    BE:                     0,

    //Bat state

    UP_4:                   0,
    RIGHT_4:                1,
    DOWN_4:                 2,
    LEFT_4:                 3,

    //Potion state
    ACTIVATED_SKILL:        0,
    POTION_YELLOW:             0,
    POTION_GREEN:              1,
    POTION_RED:                2,
    POTION_PURPLE:             3,
    POTION_BLUE:               4,


    //Level state
    //Level 1 = SUN
    //Level 2 = MOON
    MOON:                   0,
    SUN:                    1,

    //Old Joseph  1 State 
    RIGHT_JOSEPH:           0,
    FALL_RIGHT_JOSEPH:      1,
    
    //Old Joseph 2 State 
    LEFT_JOSEPH:            0,
    FALL_LEFT_JOSEPH:       1,

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
    STILL_DOWN_WIZARD:      9,
    STILL_UP_WIZARD:        10,
    STILL_RIGHT_WIZARD:     11,
    STILL_LEFT_WIZARD:      12,
    

    //Attack
    ACTIVE:                 0,
    //Jump Guy State
    JUMP:                   0,

    OFF:                    0       

}

export const ParticleState = 
{
    ON:                     0,
    FADE:                   1,
    OFF:                    2
}

export const GRAVITY = 80;

//Keyboard key codes
export const Key = {
    UP:                 87,         //W
    DOWN:               83,         //S
    RIGHT:              68,         //D
    LEFT:               65,         //A
    ATTACK:             76,         //L
    MERGE_THRONE:       77,         //M   
    ESC:                32,
    ENTER:              13,     
}

export const Tile = {
    SIZE_SPRITE:            0,     //For Sprites
    SIZE_16:                1      //For tileSets
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