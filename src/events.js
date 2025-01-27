import { Key, Sound } from "./constants.js";
import globals from "./globals.js";

export function keydownHandler(event)
{
    switch(event.keyCode)
    {
        case Key.UP:
            globals.action.moveUp = true;
            break;
        
        case Key.DOWN:
            globals.action.moveDown = true;
            break;

        case Key.LEFT:
            globals.action.moveLeft = true;
            break;

        case Key.RIGHT:
            globals.action.moveRight = true;
            break;
        
        case Key.ATTACK:
            globals.action.moveAttack = true;
            break;
        
        case Key.MERGE_THRONE:
            globals.action.merge = true;
            break;
        
        case Key.ESC:
            globals.action.esc = true;
            break;
        
        case Key.ENTER:
            globals.action.enter = true;
            
            break;
    }
}

export function keyupHandler(event)
{
    switch(event.keyCode)
    {
        case Key.UP:
            globals.action.moveUp = false;
            break;
        
        case Key.DOWN:
            globals.action.moveDown = false;
            break;

        case Key.LEFT:
            globals.action.moveLeft = false;
            break;

        case Key.RIGHT:
            globals.action.moveRight = false;
            break;
        
        case Key.ATTACK:
            globals.action.moveAttack = false;
            break;
        
        case Key.MERGE_THRONE:
            globals.action.merge = false;
            break;

            case Key.ESC:
                globals.action.esc = false;
                break;
            
            case Key.ENTER:
                globals.action.enter = false;
                break;
    }
}

export function updateMusic()
{
    const buffer = 0.28;
    const music = globals.sounds[Sound.GAME_MUSIC];
    
    if( music.currentTime > music.duration - buffer)
    {
        music.currentTime = 0;
        music.play();
    }
}