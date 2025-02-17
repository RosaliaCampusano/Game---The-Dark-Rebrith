import { DisplaysID, SpriteID, State, Tile } from "../constants.js";
import { Display } from "../Display.js";
import Frames from "../Frames.js";
import { deleteHUD } from "../gameRender.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";
import { ParticleLight } from "../sprites/Particles.js";
import Sprite from "../sprites/Sprites.js";

export default class Over extends Display
{
    init() {
        this.GameOverScreen();
        this.initParticlesForGameOver();
    }

    GameOverScreen()
    {
        const imageSet  = new ImageSet(870, 257, 426, 539, 402, 285, 0, 0);
        const frames = new Frames(1);

        const rip = new Sprite(SpriteID.RIP, State.BE, 0, 0, imageSet, frames);
        
        globals.spriteBackground.push(rip);

    }

    initParticlesForGameOver()
    {
        const numParticles = 50;
        const radius = 2;
        const alpha = 1;
        const explosionCenterX = globals.canvas.width / 2;  
        const explosionCenterY = globals.canvas.height / 2; 
        
        for (let i = 0; i < numParticles; i++) {
        
            const angle = Math.random() * Math.PI * 2;  
            const distance = Math.random() * 50 + 10; 
            
            const xPos = explosionCenterX + Math.cos(angle) * distance;
            const yPos = explosionCenterY + Math.sin(angle) * distance;
    
            const velocityX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1); 
            const velocityY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1);
        
            const growth = Math.random() * 0.1 + 0.05;
        
            const particle = new ParticleLight(xPos, yPos, radius, alpha, { velocityX, velocityY });
            particle.growth = growth;
            particle.life = 100; 
        
            globals.particles.push(particle); 
        }
        
    }

    state = {
        selectedOption: 0,
        options:
        [
            { text: "CONTINUE", state: DisplaysID.PLAYING },
            { text: "HIGHSCORE", state: DisplaysID.HIGHSCORE },
            { text: "EXIT", state: DisplaysID.MAIN_MENU },
        ],
        eventListenerAdded: false
    }

    render() {

        globals.canvas.style.filter = 'none';
        globals.time = globals.defaultTime;
        globals.life = globals.maxLife;
        deleteHUD();
    
        for (let i = 0; i < globals.spriteBackground.length; i++) {
            const sprite = globals.spriteBackground[i];
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;
    
            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);
    
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize, sprite.imageSet.ySize * 1.1
            );
        }
    
        const canvasDividedBy2 = globals.canvas.width / 2;
        globals.ctx.textAlign = 'center';
    
        const title = "GAME OVER";
        globals.ctx.font = '32px emulogic';
        globals.ctx.strokeStyle = "white";
        globals.ctx.strokeText(title, canvasDividedBy2, 45);
        globals.ctx.fillStyle = "black";
        globals.ctx.fillText(title, canvasDividedBy2, 45);
    
        const yStart = 150;
        const yStep = 30;
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'lightgray';
    
        this.state.options.forEach((option, index) => {
            globals.ctx.fillStyle = index === this.state.selectedOption ? "grey" : "white"; // Resaltar la opción seleccionada
            globals.ctx.fillText(option.text, canvasDividedBy2, yStart + index * yStep);
        });

        const handlerKeyDownGameOver = (event) => {
            if (event.key === "s") 
                {
                this.state.selectedOption = (this.state.selectedOption + 1) % this.state.options.length;
            } else if (event.key === "w") 
                { 
                this.state.selectedOption = (this.state.selectedOption - 1 + this.state.options.length) % this.state.options.length;
            } else if (event.key === "Enter") 
                { 
                globals.gameState = this.state.options[this.state.selectedOption].state;
                this.removeKeyListener();
            }
        }
        
        if (!this.state.eventListenerAdded) {
            document.addEventListener("keydown", handlerKeyDownGameOver);
            this.state.eventListenerAdded = true;

            this.state.keyListener = handlerKeyDownGameOver
        }

        this.renderParticlesForGameOver();
    }

    removeKeyListener() {
        if (this.state.eventListenerAdded) {
            document.removeEventListener("keydown", this.state.keyListener);
            this.state.eventListenerAdded = false;
        }
    }

    renderParticlesForGameOver()
    {
    
        const ctx = globals.ctx;
        globals.particles.forEach((particle) =>
        {
            particle.yPos += particle.physics.velocityY;
            particle.xPos += particle.physics.velocityX;
    
            if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
            {
                particle.physics.velocityY *= -1;  
            }
            if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
            {
                particle.physics.velocityX *= -1;
            }
    
            ctx.fillStyle = "rgba(200, 200, 200, 0.6)";
            ctx.beginPath();
            ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
            ctx.fill();
    
            particle.alpha += (Math.random() - 0.5) * 0.01; 
            particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
        });
    }
}