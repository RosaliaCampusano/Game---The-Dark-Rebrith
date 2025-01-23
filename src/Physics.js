export default class Physics {
    constructor(vLimit, aLimit = 0, friction = 1, jumpForce = 0)
    {
        this.vx =                   0;   
        this.vy =                   0;    
        this.vLimit =          vLimit; 
        this.ax =                   0;
        this.ay =                   0;
        this.aLimit =          aLimit;
        this.friction =      friction;
        this.jumpForce =    jumpForce;
        this.isOnGroup =        false;
    }
}