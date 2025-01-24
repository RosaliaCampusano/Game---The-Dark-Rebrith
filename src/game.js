import globals from "./globals.js";
import { initHTMLelements, loadAssets, initEvents, initSprites, initSpritesHUD, initSpritesMenu, initSpriteBackground,initLoadSprite, initStory, initControls, initVars, initLevel, initCamera, initParticles} from "./initialize.js";
import update from "./gameLogic.js";
import render from "./gameRender.js";

////////////////////////
/////GAME INIT/////////
//////////////////////

window.onload = init;

function init() {
  
  initCamera();

  initHTMLelements();

  loadAssets();

  initEvents();

  initLoadSprite();

  initSpritesMenu();
  
  initSpriteBackground();

  initStory();

  initControls();

  initParticles();

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
