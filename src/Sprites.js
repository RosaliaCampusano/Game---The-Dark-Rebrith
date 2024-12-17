export default class Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics)
    {
        this.id =                 id;
        this.state =           state;
        this.xPos =             xPos;
        this.yPos =             yPos;
        this.imageSet =     imageSet;
        this.frames =         frames;
        this.physics =       physics;
    }
}

export class Enemies extends Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, maxTimeToChangeDirection)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics);
        this.directionChangeCounter = 0;       
        this.maxTimeToChangeDirection = maxTimeToChangeDirection;
    }
}