import { getFriendlyUnits } from "./helpers";

export function processTurnStartModules(activeShip, battleState){

    // kinetic boost
    if(activeShip.modules.includes("module_kineticboost_shield")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_shield"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }

    if(activeShip.modules.includes("module_kineticboost_armor")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_armor"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }

    if(activeShip.modules.includes("module_kineticboost_mixed")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_mixed"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }

    // laser boost
    if(activeShip.modules.includes("module_laserboost_shield")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_shield"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }

    if(activeShip.modules.includes("module_laserboost_armor")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_armor"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }

    if(activeShip.modules.includes("module_laserboost_mixed")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_mixed"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }
}

export function processTurnEndModules(activeShip, battleState){

    // repair bot
    if(activeShip.modules.includes("module_repairbot_shield")){

        const repairbotCount = activeShip.modules.filter(
            id => id === "module_repairbot_shield"
        ).length;

        activeShip.stats.currentShield += 5 * repairbotCount;
        battleState.log.push(`${activeShip.name} was repaired by repair bot (+${5 * repairbotCount} Shield).`);
    }

    if(activeShip.modules.includes("module_repairbot_armor")){

        const repairbotCount = activeShip.modules.filter(
            id => id === "module_repairbot_armor"
        ).length;

        activeShip.stats.currentArmor += 5 * repairbotCount;
        battleState.log.push(`${activeShip.name} was repaired by repair bot (+${5 * repairbotCount} Armor).`);
    }

    if(activeShip.modules.includes("module_repairbot_mixed")){

        const repairbotCount = activeShip.modules.filter(
            id => id === "module_repairbot_mixed"
        ).length;

        activeShip.stats.currentShield += 3 * repairbotCount;
        activeShip.stats.currentArmor  += 2 * repairbotCount;
        battleState.log.push(`${activeShip.name} was repaired by repair bot (+${3 * repairbotCount} Shield / +${2 * repairbotCount} Armor).`);
    }

    // kinetic boost
    if(activeShip.modules.includes("module_kineticboost_shield")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_shield"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }

    if(activeShip.modules.includes("module_kineticboost_armor")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_armor"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }

    if(activeShip.modules.includes("module_kineticboost_mixed")){

        const count = activeShip.modules.filter(
            id => id === "module_kineticboost_mixed"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }

    // laser boost
    if(activeShip.modules.includes("module_laserboost_shield")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_shield"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }

    if(activeShip.modules.includes("module_laserboost_armor")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_armor"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }

    if(activeShip.modules.includes("module_laserboost_mixed")){

        const count = activeShip.modules.filter(
            id => id === "module_laserboost_mixed"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }
}

export function processOutgoingDamageModules(
    activeShip,
    target,
    ability,
    damage,
    battleState
) {

    if (activeShip.modules.includes("module_formation_shield") || activeShip.modules.includes("module_formation_armor") || activeShip.modules.includes("module_formation_mixed")) {

        const formationCount = getFriendlyUnits(battleState, activeShip).filter(
            ship => ship.modules.includes("module_formation_shield") || ship.modules.includes("module_formation_armor") || ship.modules.includes("module_formation_mixed")
        ).length;

        damage *= 1 + (0.10 * formationCount);

        battleState.log.push(`${activeShip.name}: Formation is boosting damage (+${10 * formationCount}%).`);
    }

    return damage;
}


export function processIncomingDamageModules(
    target,
    attacker,
    ability,
    damage,
    battleState
) {

    if (target.modules.includes("module_formation_shield") || target.modules.includes("module_formation_armor") || target.modules.includes("module_formation_mixed")) {

        const formationCount = getFriendlyUnits(battleState, target).filter(
            ship => ship.modules.includes("module_formation_shield") || ship.modules.includes("module_formation_armor") || ship.modules.includes("module_formation_mixed")
        ).length;

        damage *= 1 - (0.05 * formationCount);

        battleState.log.push(`${target.name}: Formation is reducing incoming damage (-${5 * formationCount}%).`);
    }

    return damage;
}