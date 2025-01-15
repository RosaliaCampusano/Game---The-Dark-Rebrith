import { Block, SpriteID } from "./constants.js";
import globals from "./globals.js";

/**
 * @function detectCollisions
 * @description Detects collisions between all the sprites in the game (except the player)
 * and the player, and between all the sprites (including the player) and the map obstacles
 * @returns {void}
 */
export default function detectCollisions()
{
    /**
     * Array of ids of the obstacles that the player and the sprites can collide with
     */
    const obstaclesIds = [
        Block.BRICK, 
        Block.COLUMN_UP, Block.COLUMN_DOWN, 
        Block.DOWN_DOOR_LEFT, Block.DOWN_DOOR_MIDDLE, Block.DOWN_DOOR_RIGHT, 
        Block.UP_DOOR_LEFT, Block.UP_DOOR_MIDDLE, Block.UP_DOOR_RIGHT
    ]; 

    const player = globals.activedPlayer;

    // Loop through all the sprites in the game, starting from the second
    // one (index 1), since the first one is the player
    for (let i = 1; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];
        
        for (let j = 0; j < globals.sprites.length; j++) {
            const otherSprite = globals.sprites[j];
            
            sprite.detectCollisionsBetweenSpriteAndSprite(otherSprite)
        }

        // Check for collisions between the sprite and the player
        sprite.detectCollisionsBetweenPlayerAndSprite(player);

        // Check for collisions between the sprite and the map obstacles if
        // the sprite is an enemy and is not a bat
        if (sprite.__proto__.__proto__.constructor.name === "Enemies" && sprite.id !== SpriteID.BAT) {
            sprite.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds);
        }

        if (sprite.id === SpriteID.ATTACK)
        {
            sprite.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds)
        }
    }

    // Check for collisions between the player and the map obstacles
    player.detectCollisionBetweenSpriteAndMapObstacles(obstaclesIds);
}
