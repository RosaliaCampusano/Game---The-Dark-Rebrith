import globals from "./globals.js";
import {level} from "./Level.js";

export class Camera{
    constructor(x, y, zoom)
    {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
    }
}

export function updateCamera()
{
    const player = globals.activedPlayer;

    const minCameraX = 0;
    const levelWidth = level[0].length * 16;
    const maxCameraX = Math.max(levelWidth - globals.canvas.width / globals.camera.zoom, 0);
    
    const minCameraY = 0;
    const levelHeight = level.length * 16;
    const maxCameraY  = Math.max(levelHeight - globals.canvas.height / globals.camera.zoom, 0);

    let targetX = Math.floor(player.xPos) - Math.floor(globals.canvas.width / (2 * globals.camera.zoom)) + Math.floor(player.imageSet.xSize / (2 * globals.camera.zoom));
    let targetY = Math.floor(player.yPos) - Math.floor(globals.canvas.height / (2 * globals.camera.zoom)) + Math.floor(player.imageSet.ySize / (2 * globals.camera.zoom));

    globals.camera.x = Math.min(Math.max(targetX, minCameraX), maxCameraX);
    globals.camera.y = Math.min(Math.max(targetY, minCameraY), maxCameraY);
}