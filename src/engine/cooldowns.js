import { abilityCollection } from "../data/abilities";

// ========================================
// COOLDOWNS
// ========================================

export function startCooldown(actor, abilityId) {
    const cooldownDuration = abilityCollection[abilityId].cooldown;

    if (cooldownDuration === 0) return;

    const cooldown = actor.stats.cooldowns.find(
        cd => cd.id === abilityId
    );

    if (cooldown) {
        cooldown.remainingCooldown = cooldownDuration;
    } else {
        actor.stats.cooldowns.push({
            id: abilityId,
            remainingCooldown: cooldownDuration
        });
    }
}

export function reduceCooldowns(actor) {
    actor.stats.cooldowns.forEach(cd => {
        if (cd.remainingCooldown > 0) {
            cd.remainingCooldown--;
        }
    });
}

export function isAbilityOnCooldown(actor, abilityId) {
    return actor.stats.cooldowns.some(
        cd => cd.id === abilityId && cd.remainingCooldown > 0
    );
}

export function getRemainingCooldown(actor, abilityId) {
    const cooldown = actor.stats.cooldowns.find(
        cd => cd.id === abilityId
    );

    return cooldown ? cooldown.remainingCooldown : 0;
}