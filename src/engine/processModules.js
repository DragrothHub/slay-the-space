export function processTurnStartModules(activeShip, battleState){

}

export function processTurnEndModules(activeShip, battleState){
    if(activeShip.modules.includes("module_defensive_repairbot")){

        const repairbotCount = activeShip.modules.filter(
            id => id === "module_defensive_repairbot"
        ).length;

        activeShip.stats.currentShield += 5 * repairbotCount;
        battleState.log.push(`${activeShip.name} was repaired by repair bot (+${5 * repairbotCount} Shield).`);
    }
}