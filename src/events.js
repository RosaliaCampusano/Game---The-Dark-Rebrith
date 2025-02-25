import { Key, Music } from "./constants.js";
import globals from "./globals.js";


let letter = ['U', 'W', 'U']; 
let currentIndex = 1; 

export function keydownHandler(event) 
{
    switch(event.keyCode) 
    {
        case Key.UP:
            letter[currentIndex] = String.fromCharCode(((letter[currentIndex].charCodeAt(0) - 65 + 25) % 26) + 65);
            globals.action.moveUp = true;
            break;
            
            case Key.DOWN:
            letter[currentIndex] = String.fromCharCode(((letter[currentIndex].charCodeAt(0) - 65 + 1) % 26) + 65);
            globals.action.moveDown = true;
            break;

        case Key.LEFT:
            currentIndex = (currentIndex - 1 + 3) % 3;
            globals.action.moveLeft = true;
            break;

        case Key.RIGHT:
            currentIndex = (currentIndex + 1) % 3;
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

export function getletter() {
    return letter;
}

export function getCurrentIndex() {
    return currentIndex;
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
    
    if( globals.currentMusic !== Music.NO_MUSIC)
    {
        const buffer = 0.28;
        const music = globals.sounds[globals.currentMusic];
        
        if ( music.currentTime > music.duration - buffer)
        {
            music.currentTime = 0;
            music.play();
        }
    }
}

