import { neutralBaseDamage, baseValue } from "./constants";

export const moduleCollection = {
    module_defensive_shield : { 
        id: "module_defensive_shield",
        displayName: "ShieldMod", 
        category: "defensive", 
        type: "shield", 
        value: baseValue,
        color: "#3b82f6",
    },
    module_defensive_armor : { 
        id: "module_defensive_armor",
        displayName: "ArmorMod", 
        category: "defensive", 
        type: "armor", 
        value: baseValue,
        color: "#f59e0b",
    },
    module_defensive_repairbot : { 
        id: "module_defensive_repairbot",
        displayName: "RepairBot", 
        category: "defensive", 
        type: "repairbot", 
        value: baseValue,
        color: "#0bcaf5",
    },
};

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomModule() {
    return randomItem(Object.keys(moduleCollection));
}