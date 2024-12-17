export default class Frames{
    constructor(framesPerState, speed = 1)
    {
        this.framesPerState =   framesPerState;   
        this.frameCounter =                  0; 
        this.speed =                     speed;
        this.framesChangeCounter =           0;                 
        
    }
}