import { Display } from "../Display.js";
import { DisplaysID, MainMenuTexts, SpriteID, State, Tile } from "../constants.js";
import { deleteHUD } from "../gameRender.js";
import globals from "../globals.js";
import JosephMenu from "../sprites/JosephMenu.js";

export class MainMenu extends Display {
    spriteMenu = [];
    init() {
        this.state = undefined

        this.initOldJosephs();
        this.initParticlesForMainMenu();
    }

    initOldJosephs()
    {    
        let oldJosephs = [
            {
                id: SpriteID.OLD_JOSEPH1, 
                state: State.RIGHT_JOSEPH, 
                xPos: 40, yPos: 205
            },
            {
                id: SpriteID.OLD_JOSEPH2, 
                state: State.LEFT_JOSEPH, 
                xPos: 340, yPos: 205
            }
        ]

        oldJosephs.forEach(joseph => {
            let oldJoseph = new JosephMenu(joseph.id, joseph.state, joseph.xPos, joseph.yPos);
            this.spriteMenu.push(oldJoseph);
        });
    }

    initParticlesForMainMenu() 
    {
        const numParticles = 80;  
        const minRadius = 2;
        const maxRadius = 5;  
        const alpha = 0.6; 
    
        const centerX = globals.canvas.width / 2;  
        const centerY = globals.canvas.height / 2;
    
        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2; 
            const speed = Math.random() * 2 + 1; 
            const radius = Math.random() * (maxRadius - minRadius) + minRadius;  
    
            const colors = [
                `rgba(200, 0, 0, ${alpha})`,  
                `rgba(100, 100, 100, ${alpha})`,  
                `rgba(50, 50, 50, ${alpha})` 
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
    
            globals.particles.push({xPos: centerX, yPos: centerY,radius,alpha,color,physics: {velocityX: Math.cos(angle) * speed,velocityY: Math.sin(angle) * speed,decay: 0.02  }});
        }
    }

    destroy() {
        this.spriteMenu = [];
        globals.particles = [];
        this.state = undefined
    }

    render() {
        globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);
        
        if (!this.state) {
            this.state = {
                selectedOption: 0,
                eventListenerAdded: false,
            };
        }
        
        const options = MainMenuTexts;
        deleteHUD();
        
        const canvasDividedBy2 = globals.canvas.width / 2;
        globals.ctx.textAlign = "center";
    
        // Title
        let title = "THE DARK REBIRTH";
        globals.ctx.font = "20px emulogic";
        globals.ctx.fillStyle = "darkred";
        globals.ctx.fillText(title, canvasDividedBy2, 85);
    
        // Design
        globals.ctx.font = "12px emulogic";
        globals.ctx.fillStyle = "white";
        globals.ctx.fillText("-----------------------------", canvasDividedBy2, 45);
        globals.ctx.fillText("-----------------------------", canvasDividedBy2, 250);
    
        let yCoordinate = 130;
    
        // Draw menu options
        for (let i = 0; i < options.length; i++) {
            globals.ctx.fillStyle = i === this.state.selectedOption ? "white" : "grey";
            globals.ctx.fillText(options[i][0], canvasDividedBy2, yCoordinate);
            yCoordinate += 25;
        }
    
        const handlerKeyDownMainMenu = (event) => {
            if (event.key === "s") {
                this.state.selectedOption = (this.state.selectedOption + 1) % options.length;
            } else if (event.key === "w") {
                this.state.selectedOption =
                    (this.state.selectedOption - 1 + options.length) % options.length;
            } else if (event.key === "Enter") {
                this.handleMenuSelection(this.state.selectedOption);
                this.removeKeyListener();
            }
        };
    
        if (!this.state.eventListenerAdded) {
            document.addEventListener("keydown", handlerKeyDownMainMenu);
            this.state.eventListenerAdded = true;
    
            this.state.keyListener = handlerKeyDownMainMenu;
        }
    
        for (let j = 0; j < this.spriteMenu.length; j++) {
            const sprite = this.spriteMenu[j];
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
    
        this.renderParticlesForMainMenu();
    }
    
    handleMenuSelection(selectedIndex) {
        const selectedOption = MainMenuTexts[selectedIndex][0];
    
        switch (selectedOption) {
            case "NEW GAME":
                globals.gameState = DisplaysID.PLAYING;
                break;
            case "CONTROLS":
                globals.gameState = DisplaysID.CONTROLS;
                break;
            case "STORY":
                globals.gameState = DisplaysID.STORY;
                break;
            case "HIGHSCORE":
                globals.gameState = DisplaysID.HIGHSCORE;
                break;
            default:
                console.log("Unknown option selected");
                break;
        }
    }
    
    removeKeyListener() {
        if (this.state.eventListenerAdded) {
            document.removeEventListener("keydown", this.state.keyListener);
            this.state.eventListenerAdded = false;
        }
    }
    
    renderParticlesForMainMenu() 
    {
        const ctx = globals.ctx;
        globals.particles.forEach((particle) =>
        {
            particle.xPos += particle.physics.velocityX;
            particle.yPos += particle.physics.velocityY;
    
            if (particle.xPos < 0 || particle.xPos > globals.canvas.width) 
            {
                particle.physics.velocityX *= -1;  
            }
            if (particle.yPos < 0 || particle.yPos > globals.canvas.height) 
            {
                particle.physics.velocityY *= -1;  
            }
    
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.xPos, particle.yPos, particle.radius, 0, Math.PI * 2, false);
            ctx.fill();
    
            particle.alpha += (Math.random() - 0.5) * 0.01; 
            particle.alpha = Math.max(0.3, Math.min(0.8, particle.alpha)); 
        });
        
    }

    update() {
        for (let i = 0; i < this.spriteMenu.length; i++) {
            const sprite = this.spriteMenu[i];
            const type = sprite.id;
            switch(type)
            {
                case SpriteID.OLD_JOSEPH1:
                    sprite.update();
                    break;
                case SpriteID.OLD_JOSEPH2:
                    sprite.update();
                    break;
                default:
                    console.log("Sprite type not found");
                break;
            }
        }
        this.detectCollisionsBetweenJosephs();
        this.updateFallTimer();
    }

    fallTimer = 0;
    detectCollisionsBetweenJosephs() {
    
        const leftJoseph = this.spriteMenu[0];
        const rightJoseph = this.spriteMenu[1];

        const x1 = rightJoseph.xPos + rightJoseph.hitBox.xOffset;
        const y1 = rightJoseph.yPos + rightJoseph.hitBox.yOffset;
        const w1 = rightJoseph.hitBox.xSize;
        const h1 = rightJoseph.hitBox.ySize;

        const x2 = leftJoseph.xPos + leftJoseph.hitBox.xOffset;
        const y2 = leftJoseph.yPos + leftJoseph.hitBox.yOffset;
        const w2 = leftJoseph.hitBox.xSize;
        const h2 = leftJoseph.hitBox.ySize;
    
        const isOverLap = rightJoseph.rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

        if (isOverLap && rightJoseph.state !== State.FALL_RIGHT_JOSEPH) 
        {
            rightJoseph.state = State.FALL_RIGHT_JOSEPH;
            leftJoseph.state = State.FALL_LEFT_JOSEPH;
            this.fallTimer = 1; 
        }
        return isOverLap;
    }

    updateFallTimer() {
        if (this.fallTimer > 0) {
            this.fallTimer -= globals.deltaTime; 
        
            if (this.fallTimer <= 0) 
            {
                const rightJoseph = this.spriteMenu[0];
                const leftJoseph = this.spriteMenu[1];

                leftJoseph.state = State.LEFT_JOSEPH;
                rightJoseph.state = State.RIGHT_JOSEPH;

                rightJoseph.frames.frameCounter = 0;
                leftJoseph.frames.frameCounter = 0;

                rightJoseph.xPos = 40;
                leftJoseph.xPos = 340;

                rightJoseph.physics.vx = 0;
                leftJoseph.physics.vx = 0;
            }
        }
    }
}