import { DisplaysID, SpriteID, State, Tile, WayOut } from "../constants.js";
import { Display } from "../Display.js";
import Frames from "../Frames.js";
import { deleteHUD } from "../gameRender.js";
import globals from "../globals.js";
import ImageSet from "../ImageSet.js";
import { ParticleLight } from "../sprites/Particles.js";
import Sprite from "../sprites/Sprites.js";

export default class Controls extends Display
{
    init() {
        this.initA();
        this.initD();
        this.initS();
        this.initW();
        this.initL();
        this.initM();

        this.initParticlesControls();
    }

    initA()
    {
        //LEFT
        const imageSet = new ImageSet(1151, 21, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const a = new Sprite(SpriteID.KEYBOARD_A, State.BE, 33, 135, imageSet, frames);
    
        globals.spriteControls.push(a);
    }

    initD()
    {
        //RIGHT
        const imageSet = new ImageSet(1151, 63, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const d = new Sprite(SpriteID.KEYBOARD_D, State.BE, 32, 197, imageSet, frames);
    
    
        globals.spriteControls.push(d);
    }

    initS()
    {
        //DOWN
        const imageSet = new ImageSet(1151, 42, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const s = new Sprite(SpriteID.KEYBOARD_S, State.BE, 32, 167, imageSet, frames);
    
        globals.spriteControls.push(s);
    }

    initW()
    {
        //UP
        const imageSet = new ImageSet(1151, 0, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const w = new Sprite(SpriteID.KEYBOARD_W, State.BE, 33, 107, imageSet, frames);
    
        globals.spriteControls.push(w);
    }

    initL()
    {
        //ATTACK
        const imageSet = new ImageSet(1151, 84, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const l = new Sprite(SpriteID.KEYBOARD_L, State.BE, 255, 105, imageSet, frames);
    
        globals.spriteControls.push(l);
    }

    initM()
    {
        //MERGE WITH THE THRONE
        const imageSet = new ImageSet(1152, 105, 23, 21, 23, 21, 0, 0);
        const frames = new Frames(3, 7);
    
        const m = new Sprite(SpriteID.KEYBOARD_M, State.BE, 255, 190, imageSet, frames);
    
        globals.spriteControls.push(m);
    }

    initParticlesControls()
    {
        const numParticles = 50;
        const radius = 2;
        const alpha = 1;
    
        for (let i = 0; i < numParticles; i++) 
        {
            const xPos = Math.random() * globals.canvas.width;  
            const yPos = Math.random() * globals.canvas.height; 
    
            const velocityX = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1); 
            const velocityY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1);
    
            const growth = Math.random() * 0.1 + 0.05;
    
            const particle = new ParticleLight(xPos, yPos, radius, alpha, { velocityX, velocityY });
            particle.growth = growth;
    
            globals.particles.push(particle); 
        }
    }

    destroy() {
        globals.spriteControls = [];
        globals.particles = [];
    }

    state = {
        eventListenerAdded: false,
    };

    render() {
        globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

        deleteHUD();
        
        for (let i = 0; i < globals.spriteControls.length; i ++)
        {
            const sprite = globals.spriteControls[i];
    
            const xTile = sprite.imageSet.xInit + sprite.frames.frameCounter * sprite.imageSet.xGridSize + sprite.imageSet.xOffset;
            const yTile = sprite.imageSet.yInit + sprite.state * sprite.imageSet.yGridSize + sprite.imageSet.yOffset;
    
            const xPos = Math.floor(sprite.xPos);
            const yPos = Math.floor(sprite.yPos);
    
            globals.ctx.drawImage(
                globals.tileSets[Tile.SIZE_SPRITE],
                xTile, yTile,
                sprite.imageSet.xSize, sprite.imageSet.ySize,
                xPos, yPos,
                sprite.imageSet.xSize * 1.5 , sprite.imageSet.ySize 
            );
        }
    
        const canvasDividedBy2 = globals.canvas.width / 2.1;
        globals.ctx.textAlign = 'center';
    
        //Title
        let title = "CONTROLS";
        globals.ctx.font = '30px emulogic';
        globals.ctx.strokeStyle = "white";
        globals.ctx.strokeText("" + title, canvasDividedBy2, 45);
        globals.ctx.fillStyle = "black"; 
        globals.ctx.fillText("" + title, canvasDividedBy2, 45);
    
        globals.ctx.strokeStyle = 'gray';
        globals.ctx.strokeText("-----------", canvasDividedBy2, 70);
        globals.ctx.strokeStyle = 'gray';
        globals.ctx.strokeText("-----------", canvasDividedBy2, 250);
    
        let movement = "MOVEMENT";
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText("" + movement, canvasDividedBy2 * 0.4, 90);
    
        const keyboardDefinitionControls = 
        [
            "UP",
            "LEFT",
            "DOWN",
            "RIGHT"
        ]
    
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'gray';
    
        let yCoordinate = 120;
        let spaceLine = 30;
    
        for (let i = 0; i < keyboardDefinitionControls.length; i++)
        {
            globals.ctx.fillText(keyboardDefinitionControls[i], canvasDividedBy2 * 0.5, yCoordinate);
            globals.ctx.textAlign = 'auto';
    
            yCoordinate += spaceLine;
        }
    
        let attack = "ATTACK";
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText("" + attack, canvasDividedBy2 * 1.4, 90);
    
        let merge = "MERGE WITH THE THRONE";
        globals.ctx.fillStyle = 'white';
        globals.ctx.fillText("" + merge, canvasDividedBy2 * 1.4, 165);

        //Press ESC to exit
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'lightgray';
        globals.ctx.fillText(WayOut, canvasDividedBy2, 265);
        
        const handlerKeyDownControls = (event) => {
            if (event.key === 'Escape') 
            {  
                globals.gameState = DisplaysID.MAIN_MENU;   
                this.removeKeyListener();
            }
        }
        
        if (!this.state.eventListenerAdded) 
        {
            document.addEventListener('keydown', handlerKeyDownControls);
            this.state.eventListenerAdded = true;

            this.state.keyListener = handlerKeyDownControls;
        }

        this.renderParticleControl();
    }

    removeKeyListener() {
        if (this.state.eventListenerAdded) {
            document.removeEventListener("keydown", this.state.keyListener);
            this.state.eventListenerAdded = false;
        }
    }

    renderParticleControl() 
    {
        const ctx = globals.ctx;
        globals.particles.forEach((particle) =>
        {
            particle.xPos += particle.physics.velocityX;
    
            if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
            {
                particle.physics.velocityX *= -1;  
            }
    
            if (particle.radius > 5 || particle.radius < 1) 
            {
                particle.growth *= -1; 
            }
            
            particle.radius += particle.growth * 0.1;
    
            ctx.fillStyle = `rgba(225, 215, 250, ${particle.alpha})`;
            ctx.beginPath();
            ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
            ctx.fill();
    
            particle.alpha += (Math.random() - 0.5) * 0.01; 
            particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
        });
    }

    update() {
        for ( let i = 0; i < globals.spriteControls.length; i++)
        {
            const sprite = globals.spriteControls[i];
            sprite.updateAnimationFrames();
        }
    }

}