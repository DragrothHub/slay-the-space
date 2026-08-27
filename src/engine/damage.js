import { hasDebuff } from "./debuffs";
import { processIncomingDamageModules, processOutgoingDamageModules } from "./processModules";

// ========================================
// DAMAGE SYSTEM
// ========================================

const damageTable = {
    laser: {
        shield: 1.5,
        armor: 1,
        hull: 1,
    },
    kinetic: {
        shield: 1,
        armor: 1.5,
        hull: 1,
    },
};

function getDamageMultiplier(type, layer) {
    return damageTable[type]?.[layer] ?? 1;
}

function damageLayer(currentValue, incomingDamage, multiplier) {
    const effectiveDamage = incomingDamage * multiplier;
    const absorbedDamage = Math.min(currentValue, effectiveDamage);
    const remainingLayer = currentValue - absorbedDamage;
    const rawDamageUsed = absorbedDamage / multiplier;
    const remainingDamage = incomingDamage - rawDamageUsed;

    return {
        remainingLayer,
        remainingDamage,
        absorbedDamage,
    };
}

export function applyDamage(target, actor, ability, state) {
    let damage = ability.value;

    if (ability.type === "laser"){
        damage += Math.round(damage * (0.2 * actor.attributes.laserAtk / 100));
    }
    else if (ability.type === "kinetic"){
        damage += Math.round(damage * (0.2 * actor.attributes.kineticAtk / 100));
    }

    const before = {
        shield: target.stats.currentShield,
        armor: target.stats.currentArmor,
        hull: target.stats.currentHull,
    };

    damage = processOutgoingDamageModules(
        actor,
        target,
        ability,
        damage,
        state
    );

    if (hasDebuff(target, "weakened")) {
        damage *= 1.10;
    }

    if (hasDebuff(actor, "exhausted")) {
        damage *= 0.90;
    }

    damage = processIncomingDamageModules(
        target,
        actor,
        ability,
        damage,
        state
    );

    const layers = [
        { key: "currentShield", type: "shield" },
        { key: "currentArmor", type: "armor" },
        { key: "currentHull", type: "hull" },
    ];

    for (const layer of layers) {
        if (damage <= 0) break;

        const currentValue = target.stats[layer.key];
        if (currentValue <= 0) continue;

        const multiplier = getDamageMultiplier(
            ability.type,
            layer.type
        );

        const result = damageLayer(
            currentValue,
            damage,
            multiplier
        );

        target.stats[layer.key] = Math.max(
            0,
            Math.floor(result.remainingLayer)
        );

        damage = result.remainingDamage;
    }

    const after = {
        shield: target.stats.currentShield,
        armor: target.stats.currentArmor,
        hull: target.stats.currentHull,
    };

    const totalDamage =
        (before.hull - after.hull) +
        (before.armor - after.armor) +
        (before.shield - after.shield);

    if (totalDamage > 0) {
        state.damageEvents.push({
            targetId: target.id,
            shieldDmg: (before.shield - after.shield),
            armorDmg: (before.armor - after.armor),
            hullDmg: (before.hull - after.hull),
            amount: totalDamage,
            timestamp: Date.now(),
        });
    }

    return totalDamage;
}