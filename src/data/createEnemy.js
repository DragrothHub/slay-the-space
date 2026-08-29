import { createShip } from "./createShip";

export function createEnemy(modulesNumber, scaling){
    let enemy = createShip(modulesNumber);
    
    enemy.stats.currentShield *= scaling;
    enemy.stats.maxShield *= scaling;
    enemy.stats.currentArmor *= scaling;
    enemy.stats.maxArmor *= scaling;
    enemy.stats.currentHull *= scaling;
    enemy.stats.maxHull *= scaling;
    
    return enemy;
}