import globals from "./globals.js";
import { initHTMLelements, loadAssets, initSprites, initSpritesHUD, initSpritesMenu, initSpriteBackground, initStory, initControls, initVars, initLevel} from "./initialize.js";
import update from "./gameLogic.js";
import render from "./gameRender.js";

////////////////////////
/////GAME INIT/////////
//////////////////////

window.onload = init;

function init() {

  initHTMLelements();

  loadAssets();

  initSpritesMenu();
  
  initSpriteBackground();

  initStory();

  initControls();

  initSpritesHUD();

  initSprites();

  initVars();

  initLevel();

  //Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

//////////////////////////
//////GAME EXECUTE///////
////////////////////////

function gameLoop(timeStamp) 
{
  // Keep requesting new frames
    window.requestAnimationFrame(gameLoop, globals.canvas);


    const elapsedCycleSeconds = (timeStamp - globals.previousCycleMilleseconds) / 1000; // seconds


    globals.previousCycleMilleseconds = timeStamp;


    globals.deltaTime += elapsedCycleSeconds;


    globals.cycleRealTime += elapsedCycleSeconds;


    if (globals.cycleRealTime >= globals.frameTimeObj) 
    {

        update();
        render();

        globals.cycleRealTime -= globals.frameTimeObj;
        globals.deltaTime = 0;
    }
}
