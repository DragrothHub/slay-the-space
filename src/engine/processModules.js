export function processTurnStartModules(activeShip, battleState){
    if(activeShip.modules.includes("module_offensive_kineticboost")){

        const count = activeShip.modules.filter(
            id => id === "module_offensive_kineticboost"
        ).length;

        activeShip.attributes.kineticAtk += 100 * count;
    }
}

export function processTurnEndModules(activeShip, battleState){
    if(activeShip.modules.includes("module_defensive_repairbot")){

        const repairbotCount = activeShip.modules.filter(
            id => id === "module_defensive_repairbot"
        ).length;

        activeShip.stats.currentShield += 5 * repairbotCount;
        battleState.log.push(`${activeShip.name} was repaired by repair bot (+${5 * repairbotCount} Shield).`);
    }

    if(activeShip.modules.includes("module_offensive_kineticboost")){

        const count = activeShip.modules.filter(
            id => id === "module_offensive_kineticboost"
        ).length;

        activeShip.attributes.kineticAtk -= 100 * count;
    }
}