import Sprite from "./Sprites.js";

export default class JosephMenu extends Sprite
{
    constructor(id, state, xPos, yPos, imageSet, frames, physics, hitBox)
    {
        super(id, state, xPos, yPos, imageSet, frames, physics, hitBox);
        this.fallTimer =                  0;
    }
}