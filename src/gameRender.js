import globals from "./globals.js";
import { Game, SpriteID, MainMenuTexts, WayOut } from "./constants.js";
import { Tile } from "./constants.js";
import { getletter, getCurrentIndex } from "./events.js";
import {
  initControls,
  initEnterName,
  initGameOver,
  initHighScore,
  initMainMenu,
  initPlaying,
  initStory,
  initWin,
} from "./initialize.js";

export default function render() {
  switch (globals.gameState) {
    case Game.LOADING:
      //Draw loading spinner
      renderLoading();
      break;

    case Game.MAIN_MENU:
      drawMainMenu();
      break;

    case Game.PLAYING:
      drawGame();
      break;

    case Game.CONTROLS:
      drawControls();
      break;

    case Game.HIGHSCORE:
      renderHighscore();
      break;

    case Game.STORY:
      renderStory();
      break;

    case Game.OVER:
      renderGameOver();
      break;

    case Game.WIN:
      renderWinScreen();
      break;

    case Game.ENTER_NAME:
      renderEnterName();
      break;

    case Game.LOAD_MAIN_MENU:
      initMainMenu();
      break;

    case Game.LOAD_PLAYING:
      initPlaying();
      break;

    case Game.LOAD_STORY:
      initStory();
      break;

    case Game.LOAD_CONTROLS:
      initControls();
      break;

    case Game.LOAD_HIGH_SCORES:
      initHighScore();
      break;
    case Game.LOAD_OVER:
      initGameOver();
      break;
    case Game.LOAD_ENTER_NAME:
      initEnterName();
      break;
    case Game.LOAD_WIN:
      initWin();
      break;

    default:
  }
}

function drawGame() {
  displayHUD();
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
  globals.ctxHUD.clearRect(
    0,
    0,
    globals.canvasHUD.width,
    globals.canvasHUD.height
  );

  globals.ctx.scale(globals.camera.zoom, globals.camera.zoom);
  globals.canvas.style.filter = `saturate(${globals.saturate})`;
  moveCamera();

  if (globals.isDark) {
    drawFullBlackBackground();
    createVisibilityMask();
  }

  renderMap();
  renderHUD();

  if (!globals.isPlaying) {
    renderPlayer();
    return;
  }

  renderSprites();
  renderMesageToDoor();
  restoreCamera();
}

function renderPlayer() {
  const sprite = globals.activedPlayer;
  //Calculate the position in the TileMap to draw
  const xTile =
    sprite.imageSet.xInit +
    sprite.frames.frameCounter * sprite.imageSet.xGridSize +
    sprite.imageSet.xOffset;
  const yTile =
    sprite.imageSet.yInit +
    sprite.state * sprite.imageSet.yGridSize +
    sprite.imageSet.yOffset;

  const xPos = Math.floor(sprite.xPos);
  const yPos = Math.floor(sprite.yPos);

  //Draw the new frame of sprite in the right position
  globals.ctx.drawImage(
    globals.tileSets[Tile.SIZE_SPRITE],
    xTile,
    yTile,
    sprite.imageSet.xSize,
    sprite.imageSet.ySize,
    xPos,
    yPos,
    sprite.imageSet.xSize * 0.6,
    sprite.imageSet.ySize * 0.6
  );
}

function renderMesageToDoor() {
  if (globals.incorrectKey === true) {
    globals.ctx.font = "5px emulogic";
    globals.ctx.fillStyle = globals.messageToDoor.color;
    globals.ctx.textAlign = "center";
    globals.ctx.strokeStyle = "black";
    globals.ctx.fillText(
      globals.messageToDoor.text,
      globals.messageToDoor.x - 10,
      globals.messageToDoor.y
    );
    globals.incorrectKey = false;
  }
}

function createVisibilityMask() {
  const ctx = globals.ctx;
  const player = globals.activedPlayer;

  if (
    !player ||
    (player.id !== SpriteID.PLAYER && player.id !== SpriteID.PLAYER_WIZARD)
  )
    return;

  const radius = 50;
  const circleX = player.xPos + player.imageSet.xSize * 0.3;
  const circleY = player.yPos + player.imageSet.ySize * 0.3;

  ctx.save();

  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
  ctx.clip();
}

function drawFullBlackBackground() {
  const ctx = globals.ctx;
  const canvasWidth = globals.canvas.width;
  const canvasHeight = globals.canvas.height;

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawMainMenu() {
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
  renderMainMenu();
}

function drawControls() {
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
  renderControls();
}

function renderSpritesHUD() {
  for (let i = 0; i < globals.spritesHUD.length; i++) {
    const sprite = globals.spritesHUD[i];
    //Calculate the position in the TileMap to draw
    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Draw the new frame of sprite in the right position
    globals.ctxHUD.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize
    );

    globals.ctxHUD.filter = `saturate(1)`;

    if (sprite.id === SpriteID.HEALTH_BAR_EMPTY) {
      globals.ctxHUD.filter = `saturate(${globals.health_bar_saturation})`;
    }

    if (sprite.id === SpriteID.THRONEHUB) {
      globals.ctxHUD.filter = `saturate(${globals.throne_saturation})`;
    }
  }
}

function renderSprites() {
  for (let i = 0; i < globals.sprites.length; i++) {
    const sprite = globals.sprites[i];
    //Calculate the position in the TileMap to draw
    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    //Draw the new frame of sprite in the right position
    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize * 0.6,
      sprite.imageSet.ySize * 0.6
    );
    //drawHitBox(sprite);

    if (sprite.id === SpriteID.POTION) {
      renderParticleForPotion(sprite);
    }
  }
}

function moveCamera() {
  const xTranslation = -globals.camera.x;
  const yTranslation = -globals.camera.y;

  globals.ctx.translate(xTranslation, yTranslation);
}

function restoreCamera() {
  globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderMap() {
  const brickSize = globals.level.imageSet.xGridSize;
  const levelData = globals.level.data;

  const num_fil = levelData.length;
  const num_col = levelData[0].length;

  for (let i = 0; i < num_fil; i++) {
    for (let j = 0; j < num_col; j++) {
      const xTile = (levelData[i][j] - 1) * brickSize;
      const yTile = 0;
      const xPos = j * brickSize;
      const yPos = i * brickSize;

      globals.ctx.drawImage(
        globals.tileSets[Tile.SIZE_16],
        xTile,
        yTile,
        brickSize,
        brickSize,
        xPos,
        yPos,
        brickSize,
        brickSize
      );
    }
  }
}

function renderHUD() {
  const score = globals.score;
  const highScore = globals.highScore;

  //Draw score
  globals.ctxHUD.font = "8px emulogic";
  globals.ctxHUD.fillStyle = "red";
  globals.ctxHUD.fillText("SCORE", 70, 68);
  globals.ctxHUD.fillStyle = "white";
  globals.ctxHUD.fillText(" " + score, 70, 87);

  //Draw High Score
  globals.ctxHUD.fillStyle = "red";
  globals.ctxHUD.fillText("HIGH SCORE", 100, 24);
  globals.ctxHUD.fillStyle = "white";
  globals.ctxHUD.fillText(" " + highScore, 110, 44);

  //Draw Life
  globals.ctxHUD.fillStyle = "red";
  globals.ctxHUD.fillText("LIFE", 169, 70);

  //Draw Madness
  globals.ctxHUD.fillStyle = "red";
  globals.ctxHUD.fillText("MADNESS", 233, 15);

  //Draw Level
  globals.ctxHUD.fillStyle = "red";
  globals.ctxHUD.fillText("Level", 10, 15);

  renderSpritesHUD();
}

function deleteHUD() {
  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

  const canvasHeight = 220;
  const canvasHUDHeight = 80;

  globals.canvasHUD.style.display = "none";
  globals.canvas.style.height = "auto";
  globals.canvas.height = canvasHeight + canvasHUDHeight;
}

function displayHUD() {
  const canvasHeight = 240;

  globals.canvasHUD.style.display = "";
  globals.canvas.style.height = "";
  globals.canvas.height = canvasHeight;
}

function renderLoading() {
  deleteHUD();

  const canvasDividedBy2 = globals.canvas.width / 2;
  globals.ctx.textAlign = "center";

  //Title
  let title = "LOADING";
  let totalAssets = globals.assetsToLoad.length;
  let loadedAssets = globals.assetsLoaded;
  let progress = loadedAssets / totalAssets;
  let barWidth = 200;
  let barHeight = 15;
  let barX = canvasDividedBy2 - barWidth / 2;
  let barY = 130;

  globals.ctx.strokeStyle = "white";
  globals.ctx.strokeRect(barX, barY, barWidth, barHeight);
  globals.ctx.fillStyle = "white";
  globals.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

  if (loadedAssets === totalAssets) {
    globals.ctx.font = "14px emulogic";
    globals.ctx.fillText("PRESS ENTER TO START", canvasDividedBy2, 120);
  } else {
    globals.ctx.font = "20px emulogic";
    globals.ctx.fillText("" + title, canvasDividedBy2 - 5, 120);
  }
}

function renderParticlesForMainMenu() {
  const ctx = globals.ctx;
  globals.particles.forEach((particle) => {
    particle.xPos += particle.physics.velocityX;
    particle.yPos += particle.physics.velocityY;

    if (particle.xPos < 0 || particle.xPos > globals.canvas.width) {
      particle.physics.velocityX *= -1;
    }
    if (particle.yPos < 0 || particle.yPos > globals.canvas.height) {
      particle.physics.velocityY *= -1;
    }

    ctx.filter = "blur(2px)";
    ctx.fillStyle = particle.color;
    const squareSize = particle.radius * 2;
    ctx.fillRect(
      particle.xPos - particle.radius,
      particle.yPos - particle.radius,
      squareSize,
      squareSize
    );
    ctx.filter = "none";
    particle.alpha += (Math.random() - 0.5) * 0.01;
    particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha));
  });
}

function renderParticlesRainForMainMenu() {
  const ctx = globals.ctx;
  globals.particlesRain.forEach((particle) => {
    particle.yPos += particle.physics.velocityY;

    if (particle.yPos - 10 > globals.canvas.height) {
      particle.yPos = 10;
    }

    ctx.filter = "blur(0.1px)";
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.xPos, particle.yPos, particle.width, particle.height);
    ctx.filter = "none";
    particle.alpha += (Math.random() - 0.5) * 0.01;
    particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha));
  });
}

function renderParticleForPotion(sprite) {
  const ctx = globals.ctx;
  const numParticles = 5;
  const squareSize = 3;
  const alpha = 0.8;
  const potionColors = sprite.getPotionColor();

  for (let i = 0; i < numParticles; i++) {
    let xPos = sprite.xPos + 7 + Math.random() * 10 - 5;
    let yPos = sprite.yPos + 12 + Math.random() * 10 - 5;
    let velocityX = Math.random() * 2 + 1;
    let velocityY = Math.random() * 2 + 1;

    xPos += velocityX;
    yPos += velocityY;

    if (xPos < 0 || xPos > globals.canvas.width) {
      velocityX *= -1;
    }
    if (yPos < 0 || yPos > globals.canvas.height) {
      velocityY *= -1;
    }

    ctx.filter = "blur(2px)";
    ctx.fillStyle = potionColors;
    ctx.globalAlpha = alpha;

    ctx.fillRect(
      xPos - squareSize / 2,
      yPos - squareSize / 2,
      squareSize,
      squareSize
    );
    ctx.filter = "none";
  }
}

function renderMainMenu() {
  if (!renderMainMenu.state) {
    renderMainMenu.state = {
      selectedOption: 0,
      moveUpProcessed: false,
      moveDownProcessed: false,
      enterProcessed: false,
    };
  }

  globals.highScoreInit = 0;
  const state = renderMainMenu.state;
  const options = MainMenuTexts;

  deleteHUD();

  const canvasDividedBy2 = globals.canvas.width / 2;
  globals.ctx.textAlign = "center";
  globals.ctx.font = "20px emulogic";
  globals.ctx.fillStyle = "darkred";
  globals.ctx.fillText("THE DARK REBIRTH", canvasDividedBy2, 85);

  globals.ctx.font = "12px emulogic";
  globals.ctx.fillStyle = "white";
  globals.ctx.fillText("-----------------------------", canvasDividedBy2, 45);
  globals.ctx.fillText("-----------------------------", canvasDividedBy2, 250);

  let yCoordinate = 130;

  for (let i = 0; i < options.length; i++) {
    globals.ctx.fillStyle = i === state.selectedOption ? "white" : "grey";
    globals.ctx.fillText(options[i][0], canvasDividedBy2, yCoordinate);
    yCoordinate += 25;
  }

  if (globals.action.moveDown && !state.moveDownProcessed) {
    state.selectedOption = (state.selectedOption + 1) % options.length;
    state.moveDownProcessed = true;
  } else if (!globals.action.moveDown) {
    state.moveDownProcessed = false;
  }

  if (globals.action.moveUp && !state.moveUpProcessed) {
    state.selectedOption =
      (state.selectedOption - 1 + options.length) % options.length;
    state.moveUpProcessed = true;
  } else if (!globals.action.moveUp) {
    state.moveUpProcessed = false;
  }

  if (globals.action.enter && !state.enterProcessed) {
    handleMenuSelection(state.selectedOption);
    state.enterProcessed = true;
  } else if (!globals.action.enter) {
    state.enterProcessed = false;
  }

  for (let j = 0; j < globals.spriteMenu.length; j++) {
    const sprite = globals.spriteMenu[j];
    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize
    );
  }

  renderParticlesForMainMenu();
  renderParticlesRainForMainMenu();
}

function handleMenuSelection(selectedIndex) {
  const selectedOption = MainMenuTexts[selectedIndex][0];

  switch (selectedOption) {
    case "NEW GAME":
      console.log("Starting a new game...");
      globals.gameState = Game.LOAD_PLAYING;
      break;
    case "CONTROLS":
      console.log("Showing controls...");
      globals.gameState = Game.LOAD_CONTROLS;
      break;
    case "STORY":
      console.log("Showing story...");
      globals.gameState = Game.LOAD_STORY;
      break;
    case "HIGHSCORE":
      console.log("Showing highscore...");
      globals.gameState = Game.LOAD_HIGH_SCORES;
      break;
    default:
      console.log("Unknown option selected");
      break;
  }
}

function renderParticlesForHighScore() {
  const ctx = globals.ctx;
  globals.particles.forEach((particle) => {
    particle.physics.velocity += 0.1;

    particle.yPos += particle.physics.velocityY;

    if (particle.yPos < 0 || particle.yPos > globals.canvas.height) {
      particle.xPos = Math.random() * globals.canvas.width;
      particle.physics.velocityY *= -1;
      particle.physics.velocity = Math.random() * 2 + 1;
    }

    ctx.fillStyle = `rgba(215, 0, 0, ${particle.alpha})`;
    ctx.filter = "blur(2px)";
    const squareSize = particle.radius * 2;
    ctx.fillRect(
      particle.xPos - particle.radius,
      particle.yPos - particle.radius,
      squareSize,
      squareSize
    );
    ctx.filter = "none";

    particle.alpha += (Math.random() - 0.5) * 0.01;
    particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha));
  });
}

function renderHighscore() {
  deleteHUD();

  const canvasDividedBy2 = globals.canvas.width / 2;
  globals.ctx.textAlign = "center";

  let titleHighscore = "HIGHSCORE";
  globals.ctx.font = "20px emulogic";
  globals.ctx.fillStyle = "red";
  globals.ctx.fillText(titleHighscore, canvasDividedBy2, 40);

  const separatorLine = "------------------";
  globals.ctx.fillStyle = "lightgray";
  globals.ctx.fillText(separatorLine, canvasDividedBy2, 60);
  globals.ctx.fillText(separatorLine, canvasDividedBy2, 270);

  const startY = 90;
  let categoryRank = "RANK";
  let categoryName = "NAME";
  let categoryScore = "SCORE";

  globals.ctx.font = "15px emulogic";
  globals.ctx.fillStyle = "darkred";
  globals.ctx.textAlign = "center";
  globals.ctx.fillText(categoryRank, canvasDividedBy2 - 150, startY);
  globals.ctx.fillText(categoryName, canvasDividedBy2 - 20, startY);
  globals.ctx.fillText(categoryScore, canvasDividedBy2 + 110, startY);

  globals.ctx.fillStyle = "lightgray";

  if (globals.playerEnterThroughMainMenu === true) {
    globals.ctx.fillText("<", canvasDividedBy2 - 150, 285);
    globals.ctx.fillText(">", canvasDividedBy2 + 150, 285);
  }

  globals.ctx.font = "8px emulogic";
  globals.ctx.fillText("Press ESC to exit", 200, 285);

  if (globals.playerEnterThroughMainMenu && !globals.playerEnterForGameOver) {
    globals.lastGamePlayerPosition = 0;
    renderHighScoreFromMainMenu();
  } else {
    globals.historyScore.isLastGamePlayer = true;
    renderHighScoreFromGameOver();
  }

  renderParticlesForHighScore();
}

function renderHighScoreFromMainMenu() {
  let scoresLowerLimit = 0;
  let scoressUpperLimit = 10;

  if (globals.currentScoresPage === 2) {
    scoresLowerLimit = 10;
    scoressUpperLimit = 20;
  }

  renderCurrentScoresPageRecords(scoresLowerLimit, scoressUpperLimit);
}

function renderHighScoreFromGameOver() {
  let scoresLowerLimit = 0;
  let scoressUpperLimit = 10;

  if (globals.lastGamePlayerPosition > 10) {
    scoresLowerLimit = globals.lastGamePlayerPosition - 5 - 1;
    scoressUpperLimit = globals.lastGamePlayerPosition;
  }
  globals.ctx.font = "8px emulogic";
  globals.ctx.fillStyle = "rgb(212 212 212)";

  renderCurrentScoresPageRecords(scoresLowerLimit, scoressUpperLimit);
}

function renderCurrentScoresPageRecords(scoresLowerLimit, scoressUpperLimit) {
  const topThreeLimit = 3;

  let counterOfRenderedRecords = 0;
  let rowYCoordinate = 106;
  const lineSpacing = 15;

  const canvasDividedBy2 = globals.canvas.width / 2;
  const posRank = canvasDividedBy2 - 150;
  const posName = canvasDividedBy2 - 20;
  const posScore = canvasDividedBy2 + 90;

  if (!globals.renderHighscoreState) {
    globals.renderHighscoreState = {
      activeLine: scoresLowerLimit,
      frameTimer: 0,
      lineDelay: 5,
    };
  }

  const state = globals.renderHighscoreState;

  state.frameTimer++;
  if (
    state.frameTimer >= state.lineDelay &&
    state.activeLine < scoressUpperLimit - 1
  ) {
    state.frameTimer = 0;
    state.activeLine++;
  }

  if (globals.currentScoresPage === 1 && scoresLowerLimit > 2) {
    for (let i = 0; i < topThreeLimit; i++) {
      let scoreEntry = globals.historyScore[i];

      let color = scoreEntry.isLastPlayer ? "red" : "white";

      let formattedScore = scoreEntry.score.toString();
      while (formattedScore.length < 6) {
        formattedScore = "0" + formattedScore;
      }

      globals.ctx.font = "8px emulogic";
      globals.ctx.fillStyle = color;

      // RANK
      globals.ctx.textAlign = "right";
      globals.ctx.fillText(scoreEntry.position + ".", posRank, rowYCoordinate);

      // NAME
      globals.ctx.textAlign = "center";
      globals.ctx.fillText(scoreEntry.name, posName, rowYCoordinate);

      // SCORE
      globals.ctx.textAlign = "left";
      globals.ctx.fillText(formattedScore, posScore, rowYCoordinate);

      rowYCoordinate += lineSpacing;
      counterOfRenderedRecords++;
    }

    const separatorLine = "---------------------------------------";
    globals.ctx.textAlign = "center";
    globals.ctx.fillStyle = "lightgray";
    globals.ctx.fillText(separatorLine, canvasDividedBy2 - 15, rowYCoordinate);

    rowYCoordinate += lineSpacing;
  }

  for (let i = scoresLowerLimit; i < scoressUpperLimit; i++) {
    if (i > state.activeLine) break;

    let scoreEntry = globals.historyScore[i];

    let color = scoreEntry.isLastPlayer ? "red" : "white";
    let formattedScore = scoreEntry.score.toString();

    while (formattedScore.length < 6) {
      formattedScore = "0" + formattedScore;
    }

    globals.ctx.font = "8px emulogic";
    globals.ctx.fillStyle = color;

    // RANK
    globals.ctx.textAlign = "right";
    globals.ctx.fillText(scoreEntry.position + ".", posRank, rowYCoordinate);

    // NAME
    globals.ctx.textAlign = "center";
    globals.ctx.fillText(scoreEntry.name, posName, rowYCoordinate);

    // SCORE
    globals.ctx.textAlign = "left";
    globals.ctx.fillText(formattedScore, posScore, rowYCoordinate);

    rowYCoordinate += lineSpacing;
    counterOfRenderedRecords++;
  }
}

function renderParticleControl() {
  const ctx = globals.ctx;
  globals.particles.forEach((particle) => {
    particle.xPos += particle.physics.velocityX;

    if (particle.xPos < 0 || particle.xPos > globals.canvas.width) {
      particle.physics.velocityX *= -1;
    }

    if (particle.radius > 5 || particle.radius < 1) {
      particle.growth *= -1;
    }

    particle.radius += particle.growth * 0.1;
    ctx.filter = "blur(2px)";
    ctx.fillStyle = `rgba(225, 215, 250, ${particle.alpha})`;
    const squareSize = particle.radius * 2;
    ctx.fillRect(
      particle.xPos - particle.radius,
      particle.yPos - particle.radius,
      squareSize,
      squareSize
    );
    ctx.filter = "none";

    particle.alpha += (Math.random() - 0.5) * 0.01;
    particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha));
  });
}

function renderControls() {
  deleteHUD();

  for (let i = 0; i < globals.spriteControls.length; i++) {
    const sprite = globals.spriteControls[i];

    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize * 1.5,
      sprite.imageSet.ySize
    );
  }

  const canvasDividedBy2 = globals.canvas.width / 2.1;
  globals.ctx.textAlign = "center";

  //Title
  let title = "CONTROLS";
  globals.ctx.font = "30px emulogic";
  globals.ctx.strokeStyle = "white";
  globals.ctx.strokeText("" + title, canvasDividedBy2, 45);
  globals.ctx.fillStyle = "black";
  globals.ctx.fillText("" + title, canvasDividedBy2, 45);

  globals.ctx.strokeStyle = "gray";
  globals.ctx.strokeText("-----------", canvasDividedBy2, 70);
  globals.ctx.strokeStyle = "gray";
  globals.ctx.strokeText("-----------", canvasDividedBy2, 250);

  let movement = "MOVEMENT";
  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "white";
  globals.ctx.fillText("" + movement, canvasDividedBy2 * 0.4, 90);

  const keyboardDefinitionControls = ["UP", "LEFT", "DOWN", "RIGHT"];

  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "gray";

  let yCoordinate = 120;
  let spaceLine = 30;

  for (let i = 0; i < keyboardDefinitionControls.length; i++) {
    globals.ctx.fillText(
      keyboardDefinitionControls[i],
      canvasDividedBy2 * 0.5,
      yCoordinate
    );
    globals.ctx.textAlign = "auto";

    yCoordinate += spaceLine;
  }

  let attack = "ATTACK";
  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "white";
  globals.ctx.fillText("" + attack, canvasDividedBy2 * 1.4, 90);

  let merge = "MERGE WITH THE THRONE";
  globals.ctx.fillStyle = "white";
  globals.ctx.fillText("" + merge, canvasDividedBy2 * 1.4, 165);

  //Press ESC to exit
  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "lightgray";
  globals.ctx.fillText(WayOut, canvasDividedBy2, 265);

  renderParticleControl();
}

function renderStory() {
  if (!renderStory.state) {
    renderStory.state = {
      currentLine: 0,
      currentChar: 0,
      story: [
        "Joseph's delusions have only been increasing,",
        "his obsession with the cursed throne",
        "is consuming his soul.",
        "He swears that every evening goblins are after",
        "the throne and he has to stop them",
        "and the strange shadows that appear",
        "to mug him in the course of the night.",
        "His only salvation is the dawn",
        "where it seems to be the only moment of calm.",
      ],
      lineSpacing: 15,
      baseY: 85,
      timer: 0,
      delayBetweenLines: 3,
      delayBetweenChars: 3,
      maxLinesVisible: 9,
    };
  }

  const state = renderStory.state;

  globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

  for (let i = 0; i < globals.spriteStory.length; i++) {
    const sprite = globals.spriteStory[i];
    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;
    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize * 1.5,
      sprite.imageSet.ySize
    );
  }

  const canvasDividedBy2 = globals.canvas.width / 2;

  const title = "STORY";
  globals.ctx.font = "25px emulogic";
  globals.ctx.strokeStyle = "white";
  globals.ctx.strokeText(title, canvasDividedBy2, 40);
  globals.ctx.fillStyle = "black";
  globals.ctx.fillText(title, canvasDividedBy2, 40);

  const chapter = "CHAPTER 1";
  globals.ctx.font = "12px emulogic";
  globals.ctx.fillStyle = "white";
  globals.ctx.fillText(chapter, canvasDividedBy2, 65);

  globals.ctx.textAlign = "center";
  globals.ctx.font = "7px emulogic";
  globals.ctx.fillStyle = "white";

  const visibleStart = Math.max(
    0,
    state.currentLine - state.maxLinesVisible + 1
  );

  for (let i = visibleStart; i <= state.currentLine; i++) {
    if (state.story[i]) {
      const yPosition = state.baseY + (i - visibleStart) * state.lineSpacing;
      const lineText = state.story[i];

      const visibleText =
        i < state.currentLine
          ? lineText
          : lineText.substring(0, state.currentChar);
      globals.ctx.fillText(visibleText, canvasDividedBy2, yPosition);
    }
  }

  state.timer++;

  if (
    state.timer >= state.delayBetweenChars &&
    state.currentChar < state.story[state.currentLine]?.length
  ) {
    state.currentChar++;
    state.timer = 0;
  }

  if (
    state.currentChar >= state.story[state.currentLine]?.length &&
    state.currentLine < state.story.length - 1
  ) {
    if (state.timer >= state.delayBetweenLines) {
      state.timer = 0;
      state.currentLine++;
      state.currentChar = 0;
    }
  }

  globals.ctx.fillStyle = "gray";
  globals.ctx.fillText(
    "-----------------------------------------------",
    canvasDividedBy2,
    49
  );
  globals.ctx.fillText(
    "-----------------------------------------------",
    canvasDividedBy2,
    260
  );

  globals.ctx.font = "8px emulogic";
  globals.ctx.fillStyle = "lightgray";
  globals.ctx.fillText("Press ESC to exit", canvasDividedBy2, 280);
}

function renderParticlesForGameOver() {
  const ctx = globals.ctx;
  globals.particles.forEach((particle) => {
    if (particle.color != "rgba(100, 100, 100, 0.6)") return;
    particle.yPos += particle.physics.velocityY;
    particle.xPos += particle.physics.velocityX;

    if (particle.yPos < 0 || particle.yPos > globals.canvas.height) {
      particle.physics.velocityY *= -1;
    }
    if (particle.xPos < 0 || particle.xPos > globals.canvas.width) {
      particle.physics.velocityX *= -1;
    }

    ctx.fillStyle = particle.color;
    ctx.filter = "blur(2px)";
    const squareSize = particle.radius * 2;
    ctx.fillRect(
      particle.xPos - particle.radius,
      particle.yPos - particle.radius,
      squareSize,
      squareSize
    );
    ctx.filter = "none";

    particle.alpha += (Math.random() - 0.5) * 0.01;
    particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha));
  });
}

function renderGameOver() {
  globals.canvas.style.filter = "none";
  globals.time = globals.defaultTime;
  globals.life = globals.maxLife;
  globals.playerEnterThroughMainMenu = false;
  deleteHUD();

  if (!renderGameOver.state) {
    renderGameOver.state = {
      selectedOption: 0,
      options: [
        { text: "HIGHSCORE", state: Game.LOAD_HIGH_SCORES },
        { text: "EXIT", state: Game.LOAD_MAIN_MENU },
      ],
      isTransitioning: false,
    };
  }

  const state = renderGameOver.state;
  const options = state.options;

  for (let i = 0; i < globals.spriteBackground.length; i++) {
    const sprite = globals.spriteBackground[i];
    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize * 1.1
    );
  }

  const canvasDividedBy2 = globals.canvas.width / 2;
  globals.ctx.textAlign = "center";

  const title = "GAME OVER";
  globals.ctx.font = "32px emulogic";
  globals.ctx.strokeStyle = "white";
  globals.ctx.strokeText(title, canvasDividedBy2, 45);
  globals.ctx.fillStyle = "black";
  globals.ctx.fillText(title, canvasDividedBy2, 45);

  const yStart = 185;
  const yStep = 30;
  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "lightgray";

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    globals.ctx.fillStyle = i === state.selectedOption ? "white" : "grey";
    globals.ctx.fillText(option.text, canvasDividedBy2, yStart + i * yStep);
  }

  renderParticlesForGameOver();

  if (globals.action.moveDown) {
    state.selectedOption = (state.selectedOption + 1) % options.length;
    globals.action.moveDown = false;
  } else if (globals.action.moveUp) {
    state.selectedOption =
      (state.selectedOption - 1 + options.length) % options.length;
    globals.action.moveUp = false;
  } else if (globals.action.enter) {
    state.isTransitioning = true;
    globals.gameState = options[state.selectedOption].state;
  }

  if (globals.gameState === Game.LOAD_GAME_OVER) {
    renderGameOver();
    requestAnimationFrame(renderGameOver);
  }
}

function renderWinScreen() {
  deleteHUD();

  for (let i = 0; i < globals.spriteWinScreen.length; i++) {
    const sprite = globals.spriteWinScreen[i];

    const xTile =
      sprite.imageSet.xInit +
      sprite.frames.frameCounter * sprite.imageSet.xGridSize +
      sprite.imageSet.xOffset;
    const yTile =
      sprite.imageSet.yInit +
      sprite.state * sprite.imageSet.yGridSize +
      sprite.imageSet.yOffset;

    const xPos = Math.floor(sprite.xPos);
    const yPos = Math.floor(sprite.yPos);

    globals.ctx.drawImage(
      globals.tileSets[Tile.SIZE_SPRITE],
      xTile,
      yTile,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize,
      xPos,
      yPos,
      sprite.imageSet.xSize,
      sprite.imageSet.ySize
    );
  }

  const canvasDividedBy2 = globals.canvas.width / 2;

  const title = "YOU WIN";
  globals.ctx.font = "30px emulogic";
  globals.ctx.strokeStyle = "red";
  globals.ctx.strokeText(title, 90, 60);
  globals.ctx.fillStyle = "black";
  globals.ctx.fillText(title, 91, 60);

  globals.ctx.textAlign = "center";
  globals.ctx.font = "7px emulogic";
  globals.ctx.fillStyle = "white";

  const message = [
    "Joseph awakens from his nightmare",
    "disoriented but with the feeling",
    "that something has changed.",
    "The curse of the throne has been destroyed",
    "for now.",
    "Dawn begins to break, but a new challenge",
    "lurks in the shadows.",
    " Will he finally escape his own illusions,",
    " or Will the cycle start again?",
  ];

  let yCoordinate = 90;

  for (let i = 0; i < message.length; i++) {
    globals.ctx.fillText(message[i], canvasDividedBy2, yCoordinate);

    yCoordinate += 22;
  }
}

function renderEnterName() {
  deleteHUD();

  globals.canvas.style.filter = `saturate(${1})`;

  const x = 45;
  const y = 85;

  globals.ctx.font = "20px emulogic";
  globals.ctx.fillStyle = "red";
  globals.ctx.fillText("GAME OVER", x + 70, 50);
  globals.ctx.fillText("ENTER YOUR NAME", x, y);

  const letter = getletter();
  const currentIndex = getCurrentIndex();

  const letterSpacing = 30;
  const nameY = y + 90;
  for (let i = 0; i < letter.length; i++) {
    if (i === currentIndex) {
      globals.ctx.fillStyle = "red";
    } else {
      globals.ctx.fillStyle = "white";
    }

    globals.ctx.font = "20px emulogic";
    globals.ctx.fillText(letter[i], 150 + i * letterSpacing, nameY);
  }

  let playerNameStr = "";
  for (let j = 0; j < 3; j++) {
    playerNameStr += letter[j];
  }

  globals.playerName = playerNameStr;

  if (globals.action.enter) {
    let newRecord = {
      position: globals.historyScore.length + 1,
      name: globals.playerName,
      score: globals.score,
      isLastPlayer: true,
      isLastGamePlayer: true,
    };

    globals.historyScore.push(newRecord);
    newRecord = globals.currentRecord;

    sendRecordToServer();

    globals.gameState = Game.LOAD_OVER;
  }

  globals.ctx.font = "10px emulogic";
  globals.ctx.fillStyle = "red";
  globals.ctx.fillText("PRESS ENTER TO CONFIRM", 85, 250);

  globals.ctx.font = "30px emulogic";
  globals.ctx.fillStyle = "gray";
  globals.ctx.fillText("---", 145, 195);
}

async function sendRecordToServer() {
  const url = "./src/server/routes/postRecords.php";

  const record = `name=${globals.playerName}&score=${globals.score}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: record,
  });

    if (!response.ok) {
        alert(`Communication error: ${response.statusText}`);
    }
}
