import { Block, SpriteID } from "./constants.js";
import globals from "./globals.js";

export default function detectCollisions()
{
    const obstaclesIds = [
        Block.BRICK, 
        Block.COLUMN_UP, Block.COLUMN_DOWN, 
        Block.DOWN_DOOR_LEFT, Block.DOWN_DOOR_MIDDLE, Block.DOWN_DOOR_RIGHT, 
        Block.UP_DOOR_LEFT, Block.UP_DOOR_MIDDLE, Block.UP_DOOR_RIGHT
    ]; 

    const player = globals.activedPlayer;

    for (let i = 1; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        
        for (let j = 0; j < globals.sprites.length; j++) {
            const otherSprite = globals.sprites[j];
            
            sprite.detectCollisionsBetweenSpriteAndSprite(otherSprite)
        }

        sprite.detectCollisionsBetweenPlayerAndSprite(player);

        if (sprite.__proto__.__proto__.constructor.name === "Enemies" && sprite.id !== SpriteID.BAT) {
            sprite.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds);
        }

        if (sprite.id === SpriteID.ATTACK)
        {
            sprite.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds)
        }
    }

    player.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds);
}



