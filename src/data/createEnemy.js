import { createEnemyTest, createShip } from "./createShip";

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

export function createShieldExplosionEnemy() {
    return createEnemyTest({
        typeId: "shieldExplosionEnemy",
        name: "Shield Eater",

        shield: 100,
        armor: 0,
        hull: 0,

        attributes: {
            initiative: 22,
            kineticAtk: 0,
            laserAtk: 0,
            hull: 0,
            shieldDef: 0,
            armorDef: 0,
        },

        abilities: ["neutral_offensive_laser"],

        debuffs: [
            {
                id: "shieldExplosion",
                duration: 3,
            },
        ],
    });
}