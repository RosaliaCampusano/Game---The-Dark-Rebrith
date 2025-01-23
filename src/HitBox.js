export default class HitBox 
{
    constructor (xSize, ySize, xOffset, yOffset, color = "red")
    {
        this.xSize = xSize;
        this.ySize = ySize;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.color = color;
        this.defaultColor = color;
    }
}