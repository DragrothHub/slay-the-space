import { getEnemyUnits } from "./helpers";
import { abilityCollection } from "../data/abilities";
import { isAbilityOnCooldown } from "./cooldowns";

/*
    AI INTENT

    Der Enemy berechnet am Ende seines Zuges,
    was er bei seinem nächsten Zug versuchen möchte.

    Beispiel:

    actor.aiIntent = {
        type: "detonator",
        abilityId: "plasma_detonator",
        targetId: "enemy-id"
    };

    Mögliche Typen:
    - "detonator"
    - "primer"
    - "neutral"
*/


// ========================================
// CALCULATE NEXT INTENT
// ========================================

export function calculateNextAIIntent(state, actor) {

    const targets = getEnemyUnits(state, actor)
        .filter(unit => !unit.destroyed);

    if (targets.length === 0) {
        return null;
    }

    const usableAbilities = actor.abilities.filter(
        abilityId => !isAbilityOnCooldown(actor, abilityId)
    );

    // ------------------------------------
    // 1. DETONATOR
    // ------------------------------------

    const detonatorChoice = findDetonation(
        usableAbilities,
        targets
    );

    if (detonatorChoice) {
        return {
            type: "detonator",
            abilityId: detonatorChoice.abilityId,
            targetId: detonatorChoice.targetId,
        };
    }

    // ------------------------------------
    // 2. PRIMER
    // ------------------------------------

    const primerChoice = findPrimer(
        usableAbilities,
        targets
    );

    if (primerChoice) {
        return {
            type: "primer",
            abilityId: primerChoice.abilityId,
            targetId: primerChoice.targetId,
        };
    }

    // ------------------------------------
    // 3. DEFAULT / NEUTRAL
    // ------------------------------------

    const neutralAbilities = usableAbilities.filter(
        abilityId => {
            const ability = abilityCollection[abilityId];

            return (
                !ability.appliesDebuff?.length &&
                !ability.detonator
            );
        }
    );

    const abilityId =
        neutralAbilities[0] ??
        usableAbilities[0];

    if (!abilityId) {
        return null;
    }

    const target =
        targets[Math.floor(Math.random() * targets.length)];

    return {
        type: "neutral",
        abilityId,
        targetId: target.id,
    };
}


// ========================================
// FIND DETONATION
// ========================================

function findDetonation(abilities, targets) {

    for (const abilityId of abilities) {

        const ability = abilityCollection[abilityId];

        if (
            !ability.detonator ||
            !ability.detonatesDebuff?.length
        ) {
            continue;
        }

        for (const target of targets) {

            const hasDetonatableDebuff =
                target.stats.debuffs?.some(
                    debuff =>
                        ability.detonatesDebuff.includes(debuff.id)
                );

            if (hasDetonatableDebuff && Math.random() > 0.5) {
                return {
                    abilityId,
                    targetId: target.id,
                };
            }
        }
    }

    return null;
}


// ========================================
// FIND PRIMER
// ========================================

function findPrimer(abilities, targets) {

    const primer = abilities.find(
        abilityId => {
            const ability = abilityCollection[abilityId];

            return ability.appliesDebuff?.length > 0;
        }
    );

    if (!primer) {
        return null;
    }

    const target =
        targets[Math.floor(Math.random() * targets.length)];

    return {
        abilityId: primer,
        targetId: target.id,
    };
}