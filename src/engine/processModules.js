import { getFriendlyUnits, isPlayerShip, repairShip } from "./helpers";
import { moduleCollection } from "../data/modules";
import { debuffs } from "./debuffs";

function getModuleCount(ship, effect) {
    if(ship == null) return 0;
    return ship.modules.filter(
        moduleId => moduleCollection[moduleId]?.effect === effect
    ).length;
}

export function processTurnStartModules(activeShip, battleState) {

    // kineticboost
    const kineticboostCount = getModuleCount(activeShip, "kineticboost");
    if (kineticboostCount > 0) {
        activeShip.attributes.kineticAtk += 100 * kineticboostCount;
    }

    // laserboost
    const laserboostCount = getModuleCount(activeShip, "laserboost");
    if (laserboostCount > 0) {
        activeShip.attributes.laserAtk += 100 * laserboostCount;
    }
}

export function processTurnEndModules(activeShip, battleState) {

    // kineticboost
    const kineticboostCount = getModuleCount(activeShip, "kineticboost");
    if (kineticboostCount > 0) {
        activeShip.attributes.kineticAtk -= 100 * kineticboostCount;
    }

    // laserboost
    const laserboostCount = getModuleCount(activeShip, "laserboost");
    if (laserboostCount > 0) {
        activeShip.attributes.laserAtk -= 100 * laserboostCount;
    }

    //repairbot_shield
    const repairbotShieldCount = getModuleCount(activeShip, "repairbot_shield");
    if (repairbotShieldCount > 0) {

        const { shieldRestored } = repairShip({
            ship: activeShip,
            shield: 5 * repairbotShieldCount,
        });
        
        battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}> was repaired by repair bot (<shield>+${shieldRestored}</shield> Shield).`);
    }

    //repairbot_armor
    const repairbotArmorCount = getModuleCount(activeShip, "repairbot_armor");
    if (repairbotArmorCount > 0) {

        const { armorRestored } = repairShip({
            ship: activeShip,
            armor: 5 * repairbotArmorCount,
        });

        battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}> was repaired by repair bot (<armor>+${armorRestored}</armor> Armor).`);
    }

    //repairbot_mixed
    const repairbotMixedCount = getModuleCount(activeShip, "repairbot_mixed");
    if (repairbotMixedCount > 0) {

        const { shieldRestored, armorRestored } = repairShip({
            ship: activeShip,
            shield: 3 * repairbotMixedCount,
            armor: 2 * repairbotMixedCount,
        });

        battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}> was repaired by repair bot (<shield>+${shieldRestored}</shield> Shield / <armor>+${armorRestored}</armor> Armor).`);
    }

}

export function processOutgoingDamageModules(
    activeShip,
    target,
    ability,
    damage,
    battleState
) {

    if (getModuleCount(activeShip, "formation") > 0) {
        const formationCount = getFriendlyUnits(battleState, activeShip).filter(
            ship => !ship.destroyed && getModuleCount(ship, "formation") > 0
        ).length - 1;

        damage *= 1 + (0.10 * formationCount);

        if (formationCount > 0) {
            battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>: Formation is boosting damage (+${10 * formationCount}%).`);
        }
    }

    const rainbowCount = getModuleCount(activeShip, "rainbow");
    if (rainbowCount > 0) {
        const distinctDebuffs = [
            ...new Set(
                target.stats.debuffs
                    .filter(debuff => debuffs[debuff.id].category !== "mechanic")
                    .map(debuff => debuff.id)
            )
        ];

        if (distinctDebuffs.length > 1) {
            damage *= 1 + (0.1 * (distinctDebuffs.length - 1) * rainbowCount);

            battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>: Rainbow is boosting damage (+${10 * (distinctDebuffs.length - 1) * rainbowCount}%).`);
        }
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

    if (getModuleCount(target, "formation") > 0) {
        const formationCount = getFriendlyUnits(battleState, target).filter(
            ship => !ship.destroyed && getModuleCount(ship, "formation") > 0
        ).length - 1;

        damage *= 1 - (0.05 * formationCount);

        if (formationCount > 0) {
            battleState.log.push(`<${isPlayerShip(battleState, target) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, target) ? "player" : "enemy"}>: Formation is reducing incoming damage (-${5 * formationCount}%).`);
        }
    }

    return damage;
}

export function processDamageDealtModules(
    activeShip,
    target,
    ability,
    damage,
    battleState
) {
    // vampyr
    const vampyrCount = getModuleCount(activeShip, "vampyr");
    if (vampyrCount > 0) {
        const shieldRegen = Math.round(damage * 0.2 * vampyrCount);

        const { shieldRestored } = repairShip({
            ship: activeShip,
            shield: shieldRegen,
        });

        battleState.log.push(`<${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>${activeShip.name}</${isPlayerShip(battleState, activeShip) ? "player" : "enemy"}>: Gained <shield>${shieldRestored}</shield> shield by Vampyr.`);
    }
}