import { Block, SpriteID } from "./constants.js";
import globals from "./globals.js";
import Sprite from "./Sprites.js";

/**
 * @function getMapTileId
 * @description Returns the id of a tile in the level given a certain position (xPos, yPos)
 * @param {number} xPos - The x position to check
 * @param {number} yPos - The y position to check
 * @returns {number} The id of the tile at the given position
 */
function getMapTileId(xPos, yPos)
{
    // Calculate the file and column of the tile in the level
    const brickSize = globals.level.imageSet.xGridSize;
    const levelData = globals.level.data;

    const fil = Math.floor(yPos / brickSize);
    const col = Math.floor(xPos / brickSize);

    // Return the id of the tile at the given position
    return levelData[fil][col];
}

/**
 * @function isCollidingWithObstacleAt
 * @description Checks if there is a collision with an obstacle at a given position
 * @param {number} xPos - The x position to check
 * @param {number} yPos - The y position to check
 * @param {number} obstacleId - The id of the obstacle to check against
 * @returns {boolean} True if there is a collision with the obstacle, false otherwise
 */
function isCollidingWithObstacleAt(xPos, yPos, obstacleId) {
    // Get the id of the tile at the given position
    const id = getMapTileId(xPos, yPos);

    // Determine if the tile id matches the obstacle id
    return id === obstacleId;
}

/**
 * Detects and handles collisions between a sprite and map obstacles.
 * Updates the sprite's position, velocity, and collision flags based on 
 * detected collisions with specified obstacle IDs.
 * 
 * @param {Sprite} sprite - The sprite to check for collisions.
 * @param {number[]} obstaclesIds - An array of obstacle IDs to check against.
 */
function detectCollisionBetweenSpriteAndMapObstacles(sprite, obstaclesIds)
{
    /**
     * Variables to store the x and y positions of the player
     * as well as the results of collision detection
     */
    let xPos;
    let yPos;
    // left-top
    let isCollidingOnPos1;
    // right-top
    let isCollidingOnPos2;
    // left-middle
    let isCollidingOnPos3;
    // right-middle
    let isCollidingOnPos4;
    // left-bottom
    let isCollidingOnPos5;
    // right-bottom
    let isCollidingOnPos6;

    /**
     * The size of a brick in the level map
     */
    const brickSize = globals.level.imageSet.xGridSize;

    /**
     * Reset the collision flags
     */
    sprite.isCollidingWithObstacleOnTheRight = false;
    sprite.isCollidingWithObstacleOnTheLeft = false;
    sprite.isCollidingWithObstacleOnTheTop = false;
    sprite.isCollidingWithObstacleOnTheBottom = false;

    /**
     * Variables to store the overlap between the player and an obstacle
     */
    let overlapX;
    let overlapY;

    if (sprite.physics.vx > 0) // Movement to the right
    {
        // Check for collision at the right-top corner
        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize;
        yPos = sprite.yPos + sprite.hitBox.yOffset;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos2)
            {
                // Calculate overlap and adjust position
                overlapX = Math.floor(xPos) % brickSize + 1;
    
                sprite.xPos -= overlapX;
                sprite.isCollidingWithObstacleOnTheRight = true;
                sprite.physics.vx = 0;
            }   
        }

        // Check for collision at the right-middle position
        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize;
        yPos = sprite.yPos + sprite.hitBox.yOffset + (sprite.hitBox.ySize / 2);

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos4 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos4)
            {
                // Calculate overlap and adjust position
                overlapX = Math.floor(xPos) % brickSize + 1;
    
                sprite.xPos -= overlapX;
                sprite.isCollidingWithObstacleOnTheRight = true;
                sprite.physics.vx = 0;
            }   
        }

        // Check for collision at the right-bottom corner
        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize;
        yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos6 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos6)
            {
                // Calculate overlap and adjust position
                overlapX = Math.floor(xPos) % brickSize + 1;
    
                sprite.xPos -= overlapX;
                sprite.isCollidingWithObstacleOnTheRight = true;
                sprite.physics.vx = 0;
            }   
        }
    }

    if (sprite.physics.vx < 0) // Movement to the left
    {
        // Check for collision on the left-top corner
        xPos = sprite.xPos + sprite.hitBox.xOffset - 1;
        yPos = sprite.yPos + sprite.hitBox.yOffset - 1;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos1)
            {
                // Calculate overlap between the sprite and the obstacle
                overlapX = brickSize - Math.floor(xPos) % brickSize;
    
                // Adjust sprite position and set collision flags
                sprite.xPos += overlapX;
                sprite.isCollidingWithObstacleOnTheLeft = true;
                sprite.physics.vx = 0;
            }   
        }

        // Check for collision on the left-middle side
        xPos = sprite.xPos + sprite.hitBox.xOffset - 1;
        yPos = sprite.yPos + sprite.hitBox.yOffset - 1 + (sprite.hitBox.ySize / 2);

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos3 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos3)
            {
                // Calculate overlap between the sprite and the obstacle
                overlapX = brickSize - Math.floor(xPos) % brickSize;
    
                // Adjust sprite position and set collision flags
                sprite.xPos += overlapX;
                sprite.isCollidingWithObstacleOnTheLeft = true;
                sprite.physics.vx = 0;
            }   
        }

        // Check for collision on the left-bottom corner
        xPos = sprite.xPos + sprite.hitBox.xOffset - 1;
        yPos = sprite.yPos + sprite.hitBox.yOffset - 1 + sprite.hitBox.ySize;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos5 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos5)
            {
                // Calculate overlap between the sprite and the obstacle
                overlapX = brickSize - Math.floor(xPos) % brickSize;
    
                // Adjust sprite position and set collision flags
                sprite.xPos += overlapX;
                sprite.isCollidingWithObstacleOnTheLeft = true;
                sprite.physics.vx = 0;
            }   
        }        
    }

    if (sprite.physics.vy < 0) // Movement to the top
    {
        // Check for collision on the top-left corner
        xPos = sprite.xPos + sprite.hitBox.xOffset - 1;
        yPos = sprite.yPos + sprite.hitBox.yOffset - 1;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos1 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos1)
            {
                // Calculate overlap between the sprite and the obstacle
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                // Adjust sprite position and set collision flags
                sprite.yPos += overlapY;
                sprite.isCollidingWithObstacleOnTheTop = true;
                sprite.physics.vy = 0;
            }   
        }

        // Check for collision on the top-right corner
        xPos = sprite.xPos + sprite.hitBox.xOffset - 1 + sprite.hitBox.xSize;
        yPos = sprite.yPos + sprite.hitBox.yOffset - 1;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            isCollidingOnPos2 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos2)
            {
                // Calculate overlap between the sprite and the obstacle
                overlapY = brickSize - Math.floor(yPos) % brickSize;
                // Adjust sprite position and set collision flags
                sprite.yPos += overlapY;
                sprite.isCollidingWithObstacleOnTheTop = true;
                sprite.physics.vy = 0;
            }   
        }
    }

    if (sprite.physics.vy > 0) // Movement to the down
    {
        // Check for collision on the bottom-left corner
        xPos = sprite.xPos + sprite.hitBox.xOffset;
        yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            // Check if the sprite is colliding with the obstacle at the current position
            isCollidingOnPos5 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos5)
            {
                // Calculate the overlap between the sprite and the obstacle
                overlapY = Math.floor(yPos) % brickSize + 1;
    
                // Adjust the sprite's position and set the appropriate flags
                sprite.yPos -= overlapY;
                sprite.isCollidingWithObstacleOnTheBottom = true;
                sprite.physics.vy = 0;
            }   
        }

        // Check for collision on the bottom-right corner
        xPos = sprite.xPos + sprite.hitBox.xOffset + sprite.hitBox.xSize;
        yPos = sprite.yPos + sprite.hitBox.yOffset + sprite.hitBox.ySize;

        for (let i = 0; i < obstaclesIds.length; i++)
        {
            // Check if the sprite is colliding with the obstacle at the current position
            isCollidingOnPos6 = isCollidingWithObstacleAt(xPos, yPos, obstaclesIds[i]);
            if (isCollidingOnPos6)
            {
                // Calculate the overlap between the sprite and the obstacle
                overlapY = Math.floor(yPos) % brickSize + 1;
    
                // Adjust the sprite's position and set the appropriate flags
                sprite.yPos -= overlapY;
                sprite.isCollidingWithObstacleOnTheBottom = true;
                sprite.physics.vy = 0;
            }   
        }
    }
}

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

    // Loop through all the sprites in the game, starting from the second
    // one (index 1), since the first one is the player
    for (let i = 1; i < globals.sprites.length; i++)
    {
        const sprite = globals.sprites[i];

        // Check for collisions between the sprite and the player
        detectCollisionsBetweenPlayerAndSprite(sprite);

        // Check for collisions between the sprite and the map obstacles if
        // the sprite is an enemy and is not a bat
        if (sprite.constructor.name === "Enemies" && sprite.id !== SpriteID.BAT) {
            detectCollisionBetweenSpriteAndMapObstacles(sprite, obstaclesIds);
        }
    }

    const player = globals.sprites[0];

    // Check for collisions between the player and the map obstacles
    detectCollisionBetweenSpriteAndMapObstacles(player, obstaclesIds);
}

/**
 * Function that detects collisions between the player and a sprite
 * @param {Sprite} sprite the sprite to check for collisions
 * @return {void}
 */
function detectCollisionsBetweenPlayerAndSprite(sprite)
{
    // Check if the sprite is the player itself
    if (sprite.id === globals.sprites[0].id)
    {
        return;
    }

    // Check if the sprite is overlapping with the player
    const x1 = globals.sprites[0].xPos + globals.sprites[0].hitBox.xOffset;
    const y1 = globals.sprites[0].yPos + globals.sprites[0].hitBox.yOffset;
    const w1 = globals.sprites[0].hitBox.xSize;
    const h1 = globals.sprites[0].hitBox.ySize;

    const x2 = sprite.xPos + sprite.hitBox.xOffset;
    const y2 = sprite.yPos + sprite.hitBox.yOffset;
    const w2 = sprite.hitBox.xSize;
    const h2 = sprite.hitBox.ySize;

    const isOverLap = rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2);

    if (isOverLap)
    {
        sprite.isCollidingWithPlayer = true;
    }
    else
    {
        sprite.isCollidingWithPlayer = false;
    }
}

/**
 * Function that calculates if two rectangles are overlapping
 * @param {number} x1 x position of the first rectangle
 * @param {number} y1 y position of the first rectangle
 * @param {number} w1 width of the first rectangle
 * @param {number} h1 height of the first rectangle
 * @param {number} x2 x position of the second rectangle
 * @param {number} y2 y position of the second rectangle
 * @param {number} w2 width of the second rectangle
 * @param {number} h2 height of the second rectangle
 * @return {boolean} true if the rectangles are overlapping, false otherwise
 */
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2)
{
    let isOverlap;
    
    // check x and y for overlap
    if(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2)
    {
        // if any of the conditions are true, it means the rectangles don't overlap
        isOverlap = false;
    }
    else 
        // if none of the conditions are true, it means the rectangles do overlap
        isOverlap = true;

    return isOverlap;
}
