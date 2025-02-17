import { DisplaysID, WayOut } from "../constants.js";
import { Display } from "../Display.js";
import { deleteHUD } from "../gameRender.js";
import globals from "../globals.js";
import Physics from "../Physics.js";
import { ParticleLight } from "../sprites/Particles.js";

export default class HighScores extends Display 
{
    state = {
        eventListenerAdded: false
    }

    init() {
        this.initParticlesForHighscore();
    }

    initParticlesForHighscore() 
    {
        const numParticles = 50;
        const radius = 2; 
        const alpha = 0.8;
        
        for (let i = 0; i < numParticles; i++) 
        {
            const xPos = Math.random() * globals.canvas.width; 
            const yPos = Math.random() * globals.canvas.height; 
            const velocity = Math.random() * 2 + 1; 
            const physics = new Physics(velocity);
    
            const particleHighScore = new ParticleLight(xPos, yPos, radius, alpha, physics);
            globals.particles.push(particleHighScore);
        }
    }

    destroy() {
        globals.particles = [];
    }

    render() {
        // globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

        deleteHUD();
        
        const canvasDividedBy2 = globals.canvas.width / 2;
        globals.ctx.textAlign = 'center';
        //Title
        let highScore = "HIGHSCORE";
    
        globals.ctx.font = '20px emulogic';
        globals.ctx.fillStyle ='red';
        globals.ctx.fillText("" + highScore, canvasDividedBy2, 35);
    
        globals.ctx.fillStyle = 'lightgray';
        globals.ctx.fillText("------------------", canvasDividedBy2, 58);
    
        //Category
        let rankCategory = "RANK";
    
        globals.ctx.font = '20px emulogic';
        globals.ctx.fillStyle ='darkred';
        globals.ctx.textAlign = 'auto';
        globals.ctx.fillText("" + rankCategory, canvasDividedBy2 * 0.3, 100);
    
        ////////////////////////////
        let nameCategory = "NAME";
    
        globals.ctx.font = '20px emulogic';
        globals.ctx.fillStyle ='darkred';
        globals.ctx.textAlign = 'right';
        globals.ctx.fillText("" + nameCategory, canvasDividedBy2, 100);
    
        ///////////////////////////////
        let scoreCategory = "SCORE";
    
        globals.ctx.font = '20px emulogic';
        globals.ctx.fillStyle ='darkred';
        globals.ctx.textAlign = 'left';
        globals.ctx.fillText("" + scoreCategory, canvasDividedBy2 * 1.3, 100);
        
        const xPosition = globals.canvas.width * 0.2; // Left
        const xName = globals.canvas.width * 0.4;    // Center
        const xScore = globals.canvas.width * 0.8;   // Right
    
        //Initial Y coordinate and height between rows
        let yCoordinate = 150;
        const spaceLine = 30;
    
        const position = 
        [ 
            "1ST", 
            "2ND", 
            "3RD"
        ];
    
        let scoreTemplate = "000000";
    
        for (let i = 0; i < position.length; i++) {
    
            // var score = globals.historyScore[i][1].toString(); 
            let score = scoreTemplate.substr(0, scoreTemplate.length - globals.historyScore[i][1].toString().length) + globals.historyScore[i][1];
    
            globals.ctx.textAlign = 'right';
            globals.ctx.fillStyle = 'white';
            globals.ctx.fillText(position[i], xPosition, yCoordinate);
    
            globals.ctx.textAlign = 'center';
            globals.ctx.fillStyle = 'white';
            globals.ctx.fillText(globals.historyScore[i][0], xName, yCoordinate);
    
            globals.ctx.textAlign = 'auto';
            globals.ctx.fillStyle = 'white';
            globals.ctx.fillText(score, xScore, yCoordinate);
    
            yCoordinate += spaceLine;
        
        }
        ////////////
        globals.ctx.fillStyle = 'white';
        globals.ctx.textAlign = 'center'
        globals.ctx.fillText("------------------", canvasDividedBy2, 240);
    
        //Press ESC to exit
        globals.ctx.font = '10px emulogic';
        globals.ctx.fillStyle = 'lightgray';
        globals.ctx.fillText(WayOut, canvasDividedBy2, 260);
    
        const handlerKeyDownhighscore = (event) =>
        {
            if (event.key === 'Escape') {
                globals.gameState = DisplaysID.MAIN_MENU;
                this.removeKeyListener();
            }
        }
    
        if (!this.state.eventListenerAdded)
        {
            document.addEventListener('keydown', handlerKeyDownhighscore);
            this.state.eventListenerAdded = true;
        
            this.state.keyListener = handlerKeyDownhighscore;
        }

        this.renderParticlesForHighScore();
    }

    removeKeyListener() {
        if (this.state.eventListenerAdded) {
            document.removeEventListener("keydown", this.state.keyListener);
            this.state.eventListenerAdded = false;
        }
    }

    renderParticlesForHighScore() {
    
        const ctx = globals.ctx;
        globals.particles.forEach((particle) =>
        {
            particle.physics.velocity += 0.1; 
    
            particle.yPos += particle.physics.vLimit;
            
            if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
            {
                particle.xPos = Math.random() * globals.canvas.width
                particle.physics.vLimit *= -1;
            }
    
            ctx.fillStyle = `rgba(215, 0, 0, ${particle.alpha})`;
            ctx.beginPath();
            ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
            ctx.fill();
    
            particle.alpha += (Math.random() - 0.5) * 0.01; 
            particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
        });
    }
}