import { applyDamage } from "./damage";
import { applyDebuff, debuffs } from "./debuffs";
import { getFriendlyUnits, repairShip } from "./helpers";
import { moduleCollection } from "../data/modules";

function removeDebuffsExcept(target, debuffIds, amountToPreserve) {

    let removedCount = 0;

    for (const debuffId of debuffIds) {

        let preserved = 0;

        target.stats.debuffs = target.stats.debuffs.filter(debuff => {

            if (debuff.id !== debuffId) {
                return true;
            }

            if (preserved < amountToPreserve) {
                preserved++;
                return true;
            }

            removedCount++;
            return false;
        });
    }

    return removedCount;
}

// ========================================
// DETONATION
// ========================================

export function detonate(target, actor, ability, state) {

    const detonateDebuffIds = ability.detonatesDebuff;
    const enemies = getFriendlyUnits(state, target);

    // ==============================
    // 1. COUNT + REMOVE DEBUFFS
    // ==============================

    const matchingDebuffs = target.stats.debuffs.filter(
        debuff => detonateDebuffIds.includes(debuff.id)
    );

    const countPreservers = actor.modules.filter(
        moduleId => moduleCollection[moduleId]?.effect === "preserver"
    ).length;

    let detonatedDebuffCount = matchingDebuffs.length;

    if (ability.detonatorEffect !== "spreader") {
        removeDebuffsExcept(
            target,
            detonateDebuffIds,
            countPreservers
        );
    }

    if (detonatedDebuffCount === 0) return;

    // ==============================
    // 2. MAIN EXPLOSION DAMAGE
    // ==============================

    const baseDamage = ability.value;

    const detonationMultiplier = 1 + detonatedDebuffCount * 0.75;

    const explosionDamage = baseDamage * detonationMultiplier;

    const damageDone = applyDamage(target, actor, {
        ...ability,
        value: explosionDamage,
    }, state);

    state.log.push(
        `${detonatedDebuffCount} stack(s) of ${detonateDebuffIds.join(", ")} detonated on ${target.name} for ${damageDone} damage`
    );

    state.animationEvents.push({
        targetId: target.id,
        detonatorId: ability.id,
        timestamp: Date.now(),
    });

    // ==============================
    // 3. DETONATION EFFECT
    // ==============================

    switch (ability.detonatorEffect) {

        case "bomber": {
            // ==============================
            // SPLASH DAMAGE
            // ==============================

            const splashTargets = enemies.filter(
                enemy => enemy.id !== target.id && !enemy.destroyed
            );

            const splashDamage = explosionDamage * 0.4;

            for (const enemy of splashTargets) {
                applyDamage(enemy, actor, {
                    ...ability,
                    value: splashDamage,
                }, state);
            }

            if (splashTargets.length > 0) {
                state.log.push(
                    `Explosion deals ${splashDamage} splash damage to ${splashTargets.length} targets`
                );
            }

            break;
        }

        case "spike": {
            // ==============================
            // SINGLE TARGET DAMAGE
            // ==============================

            const spikeDamage = applyDamage(target, actor, {
                ...ability,
                value: explosionDamage,
            }, state);

            state.log.push(
                `Spike deals another ${spikeDamage} damage to ${target.name}`
            );

            break;
        }

        case "vampire": {
            // ==============================
            // HEAL FROM DAMAGE
            // ==============================

            const { shieldRestored } = repairShip({
                ship: actor,
                shield: damageDone,
            });

            state.log.push(
                `${actor.name}: Gained ${shieldRestored} shield by Vampyr Detonator.`
            );

            break;
        }

        case "spreader": {
            // ==============================
            // SPREAD THE DEBUFFS TO THE FLEET
            // ==============================

            const spreadTargets = enemies.filter(
                enemy => enemy.id !== target.id && !enemy.destroyed
            );

            for (const enemy of spreadTargets) {

                // Spread every detonated debuff with its
                // original number of stacks.
                for (const debuffId of detonateDebuffIds) {

                    const stackCount = matchingDebuffs.filter(
                        debuff => debuff.id === debuffId
                    ).length;

                    for (let i = 0; i < stackCount; i++) {
                        applyDebuff(enemy, debuffId);
                    }
                }
            }

            if (spreadTargets.length > 0) {
                state.log.push(
                    `Spreading ${detonateDebuffIds.join(", ")} to ${spreadTargets.length} targets`
                );
            }

            break;
        }

        case "cascade": {
            // ==============================
            // CASCADE EXPLOSIONS
            // ==============================

            let cascadeDamage = explosionDamage;
            let cascadeTarget = target;

            while (cascadeDamage > 1) {

                // Explosion like bomber but only factor 0.3
                cascadeDamage *= 0.3;

                const splashTargets = enemies.filter(
                    enemy =>
                        enemy.id !== cascadeTarget.id &&
                        !enemy.destroyed
                );

                for (const enemy of splashTargets) {
                    applyDamage(enemy, actor, {
                        ...ability,
                        value: cascadeDamage,
                    }, state);
                }

                if (splashTargets.length > 0) {
                    state.log.push(
                        `Cascade explosion deals ${cascadeDamage} splash damage to ${splashTargets.length} targets`
                    );
                }

                // Find next enemy with at least one
                // of the detonated debuffs.
                cascadeTarget = enemies.find(enemy =>
                    !enemy.destroyed &&
                    enemy.stats.debuffs.some(
                        debuff => detonateDebuffIds.includes(debuff.id)
                    )
                );

                if (!cascadeTarget) break;

                state.animationEvents.push({
                    targetId: cascadeTarget.id,
                    detonatorId: ability.id,
                    timestamp: Date.now(),
                });

                // Remove all matching debuffs from the
                // cascade target.
                const removedDebuffs = cascadeTarget.stats.debuffs.filter(
                    debuff => detonateDebuffIds.includes(debuff.id)
                );

                cascadeTarget.stats.debuffs =
                    cascadeTarget.stats.debuffs.filter(
                        debuff => !detonateDebuffIds.includes(debuff.id)
                    );

                // The number of stacks of ALL matching
                // debuffs contributes to the next explosion.
                cascadeDamage *= (
                    1 + removedDebuffs.length * 0.75
                );
            }

            break;
        }

        case "stunner": {

            applyDebuff(
                target,
                debuffs.stunned.id,
                detonatedDebuffCount
            );

            state.log.push(
                `Stunned ${target.name} for ${detonatedDebuffCount} rounds`
            );

            break;
        }

        case "bomber_elite": {
            // ==============================
            // SPLASH DAMAGE + DEBUFF SPREAD
            // ==============================

            const splashTargets = enemies.filter(
                enemy => enemy.id !== target.id && !enemy.destroyed
            );

            const splashDamage = explosionDamage * 0.4;

            for (const enemy of splashTargets) {

                applyDamage(enemy, actor, {
                    ...ability,
                    value: splashDamage,
                }, state);

                // Apply every detonated debuff.
                for (const debuffId of detonateDebuffIds) {
                    applyDebuff(enemy, debuffId);
                }
            }

            if (splashTargets.length > 0) {
                state.log.push(
                    `Explosion deals ${splashDamage} splash damage to ${splashTargets.length} targets`
                );
            }

            break;
        }

        default:
            break;
    }
}