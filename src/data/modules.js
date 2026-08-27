const colorShield = "#3b82f6";
const colorMixed = "#22c55e";
const colorArmor = "#f59e0b";

export const moduleCollection = {
    module_shield_booster : { 
        id: "module_shield_booster",
        displayName: "ShieldBooster", 
        description: "Gives boost to shield maximum",
        shield: 200,
        armor: 0,
        color: colorShield,
    },
    module_armor_booster : { 
        id: "module_armor_booster",
        displayName: "ArmorBooster",
        description: "Gives boost to armor maximum",
        shield: 0,
        armor: 200,
        color: colorArmor,
    },

    module_repairbot_shield : {
        id: "module_repairbot_shield",
        displayName: "RepairBot", 
        description: "Adds some shield after every turn",
        shield: 100,
        armor: 0,
        color: colorShield,
    },
    module_repairbot_armor : {
        id: "module_repairbot_armor",
        displayName: "RepairBot", 
        description: "Adds some armor after every turn",
        shield: 0,
        armor: 100,
        color: colorArmor,
    },
    module_repairbot_mixed : {
        id: "module_repairbot_mixed",
        displayName: "RepairBot", 
        description: "Adds some shield and armor after every turn",
        shield: 50,
        armor: 50,
        color: colorMixed,
    },

    module_kineticboost_shield : { 
        id: "module_kineticboost_shield",
        displayName: "KineticBoost", 
        description: "Boosts kinetic damage",
        shield: 100,
        armor: 0,
        color: colorShield,
    },
    module_kineticboost_armor : { 
        id: "module_kineticboost_armor",
        displayName: "KineticBoost", 
        description: "Boosts kinetic damage",
        shield: 0,
        armor: 100,
        color: colorArmor,
    },
    module_kineticboost_mixed : { 
        id: "module_kineticboost_mixed",
        displayName: "KineticBoost", 
        description: "Boosts kinetic damage",
        shield: 50,
        armor: 50,
        color: colorMixed,
    },

    module_laserboost_shield : { 
        id: "module_laserboost_shield",
        displayName: "LaserBoost", 
        description: "Boosts laser damage",
        shield: 100,
        armor: 0,
        color: colorShield,
    },
    module_laserboost_armor : { 
        id: "module_laserboost_armor",
        displayName: "LaserBoost", 
        description: "Boosts laser damage",
        shield: 0,
        armor: 100,
        color: colorArmor,
    },
    module_laserboost_mixed : { 
        id: "module_laserboost_mixed",
        displayName: "LaserBoost", 
        description: "Boosts laser damage",
        shield: 50,
        armor: 50,
        color: colorMixed,
    },

    module_formation_shield : { 
        id: "module_formation_shield",
        displayName: "Formation", 
        description: "Boosts ships for every formation module on different ships",
        shield: 100,
        armor: 0,
        color: colorShield,
    },
    module_formation_armor : { 
        id: "module_formation_armor",
        displayName: "Formation", 
        description: "Boosts ships for every formation module on different ships",
        shield: 0,
        armor: 100,
        color: colorArmor,
    },
    module_formation_mixed : { 
        id: "module_formation_mixed",
        displayName: "Formation", 
        description: "Boosts ships for every formation module on different ships",
        shield: 50,
        armor: 50,
        color: colorMixed,
    },
};

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomModule() {
    return randomItem(Object.keys(moduleCollection));
}