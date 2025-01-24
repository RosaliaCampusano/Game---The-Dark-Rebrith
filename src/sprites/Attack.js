import { SpriteID, State } from "../constants.js";
import Frames from "../Frames.js";
import globals from "../globals.js";
import HitBox from "../HitBox.js";
import ImageSet from "../ImageSet.js";
import Physics from "../Physics.js";
import Sprite from "./Sprites.js";

export class Attack extends Sprite
{
    countFrameAttack = 0;
    moveSpeed = 1.8;
    blueExplotion = {};
    left = false;
    right = false;
    top = false;
    bottom = false;

    constructor()
    {
        super(
            SpriteID.ATTACK, 
            State.ACTIVE, 
            -10, -10, 
            new ImageSet(287, 258, 19, 22, 17, 19, 0, 0), 
            new Frames(1), 
            new Physics(40, 40, 0.98), 
            new HitBox(6, 6, 3, 3)
        )
    }

    update()
    {
        super.update()
        
        for (let index = 0; index < globals.sprites.length; index++) 
        {
            const sprite = globals.sprites[index];
            if (sprite.id == SpriteID.BLUE_EXPLOTION) 
            {
                this.blueExplotion = sprite
                this.blueExplotion.update();
            }
        }

        if (this.left)
        {
            this.leftAttack(globals.activedPlayer)
        }

        if (this.right)
        {
            this.rightAttack(globals.activedPlayer)
        }

        if (this.top)
        {
            this.upAttack(globals.activedPlayer)
        }

        if (this.bottom)
        {
            this.downAttack(globals.activedPlayer)
        }
    }

    defaultPositionAndFrame(){
        this.countFrameAttack = 0;
        this.xPos = -10;
        this.yPos = -10;
        this.physics.vx = 0;
        this.physics.vy = 0;
    }

    getPositionPlayer(player)
    {
        if (this.countFrameAttack == 0) {
            this.xPos = player.xPos;
            this.yPos = player.yPos;
        }
    }

    isCollidingOrMaxCountFrameAttack()
    {
        return this.isCollidingWithObstacleOnTheLeft || 
        this.isCollidingWithObstacleOnTheRight || 
        this.isCollidingWithObstacleOnTheTop ||
        this.isCollidingWithObstacleOnTheBottom ||
        this.isCollidingWithSprite ||
        this.countFrameAttack == 30;
    }

    updateXPos()
    {
        this.xPos += this.physics.vx * globals.deltaTime;
    }

    updateYPos()
    {
        this.yPos += this.physics.vy * globals.deltaTime;
    }

    leftAttack(player)
    {
        this.physics.vx = -this.physics.vLimit * this.moveSpeed;

        this.getPositionPlayer(player)

        this.countFrameAttack++;

        this.updateXPos()
        
        
        if (this.isCollidingOrMaxCountFrameAttack()) 
        {
            player.state = State.STILL_LEFT_WIZARD
            this.blueExplotion.getPosition(this.xPos, this.yPos)
            this.defaultPositionAndFrame()
            this.left = false;
        }
    }

    rightAttack(player)
    {
        this.physics.vx = this.physics.vLimit * this.moveSpeed;

        this.getPositionPlayer(player)

        this.countFrameAttack++;

        this.updateXPos()

        if (this.isCollidingOrMaxCountFrameAttack()) 
        {
            player.state = State.STILL_RIGHT_WIZARD
            this.blueExplotion.getPosition(this.xPos, this.yPos)
            this.defaultPositionAndFrame()
        }
    }

    upAttack(player)
    {
        this.physics.vy = -this.physics.vLimit * this.moveSpeed;

        this.getPositionPlayer(player);

        this.countFrameAttack++;

        this.updateYPos();

        if (this.isCollidingOrMaxCountFrameAttack())
        {
            player.state = State.STILL_UP_WIZARD
            this.blueExplotion.getPosition(this.xPos, this.yPos)
            this.defaultPositionAndFrame()
        }
    }

    downAttack(player)
    {
        this.physics.vy = this.physics.vLimit * this.moveSpeed;

        this.getPositionPlayer(player);

        this.countFrameAttack++;

        this.updateYPos();

        if (this.isCollidingOrMaxCountFrameAttack())
        {
            player.state = State.STILL_DOWN_WIZARD
            this.blueExplotion.getPosition(this.xPos, this.yPos)
            this.defaultPositionAndFrame()
        }
    }

    detectCollisionsBetweenSpriteAndSprite(sprite)
    {
        const isColliding = super.detectCollisionsBetweenSpriteAndSprite(sprite);
        
        sprite.isCollidingWithAttack = isColliding;

        if (sprite.__proto__.__proto__.constructor.name === "Enemies" && sprite.isCollidingWithAttack)
        {
            this.isCollidingWithSprite = sprite.isCollidingWithAttack || isColliding;
            setTimeout(() => {this.isCollidingWithSprite = false}, 100);
        }

        return isColliding;
    }
}