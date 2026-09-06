import { use } from "react";
import { applyDamage } from "./damage";
import { applyDebuff, debuffs } from "./debuffs";
import { getFriendlyUnits, repairShip } from "./helpers";
import { moduleCollection } from "../data/modules";

function removeDebuffsExcept(target, debuffId, amountToPreserve) {

    let preserved = 0;

    target.stats.debuffs = target.stats.debuffs.filter(debuff => {

        if (debuff.id !== debuffId) {
            return true;
        }

        if (preserved < amountToPreserve) {
            preserved++;
            return true;
        }

        return false;
    });
}

// ========================================
// DETONATION
// ========================================

export function detonate(target, actor, ability, state) {
    const debuffId = ability.detonatesDebuff;
    const enemies = getFriendlyUnits(state, target);

    // ==============================
    // 1. COUNT + REMOVE DEBUFFS
    // ==============================
    const before = target.stats.debuffs.length;

    const removedDebuffs = target.stats.debuffs.filter(
        d => d.id === debuffId
    );

    const countPreservers = actor.modules.filter(moduleId => moduleCollection[moduleId]?.effect === "preserver").length;

    if (ability.detonatorEffect != "spreader") {
        removeDebuffsExcept(target, debuffId, countPreservers);
    }

    const removedCount = removedDebuffs.length;

    if (removedCount === 0) return;

    // ==============================
    // 2. MAIN EXPLOSION DAMAGE
    // ==============================
    const baseDamage = ability.value;

    const detonationMultiplier = 1 + removedCount * 0.75;

    const explosionDamage = baseDamage * detonationMultiplier;

    const damageDone = applyDamage(target, actor, {
        ...ability,
        value: explosionDamage,
    }, state);

    state.log.push(
        `${removedCount} stack(s) of ${debuffId} detonated on ${target.name} for ${damageDone} damage`
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
        case "bomber":
            // ==============================
            // SPLASH DAMAGE
            // ==============================
            const splashTargets = enemies.filter(enemy => enemy.id !== target.id && !enemy.destroyed);

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

        case "spike":
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

        case "vampire":
            // ==============================
            // HEAL FROM DAMAGE (MAX SHIELD * 2)
            // ==============================

            const { shieldRestored } = repairShip({
                ship: actor,
                shield: damageDone,
            });

            state.log.push(
                `${actor.name}: Gained ${shieldRestored} shield by Vampyr Detonator.`
            );

            break;
    
        case "spreader":
            // ==============================
            // SPREAD THE DEBUFF TO THE FLEET
            // ==============================
            const spreadTargets = enemies.filter(enemy => enemy.id !== target.id && !enemy.destroyed);

            for (const enemy of spreadTargets) {
                for(let i = 0; i < removedCount; i++){
                    applyDebuff(enemy, debuffId);
                }
            }

            if (spreadTargets.length > 0) {
                state.log.push(
                    `Spreading ${debuffId} to ${spreadTargets.length} targets`
                );
            }
            break;

        case "cascade":
            // ==============================
            // CASCADE EXPLOSIONS
            // ==============================
            let cascadeDamage = explosionDamage;

            let cascadeTarget = target;

            while (cascadeDamage > 1) {

                // Explosion like bomber but only factor 0.3
                cascadeDamage *= 0.3;

                const splashTargets = enemies.filter(enemy => enemy.id !== cascadeTarget.id && !enemy.destroyed);

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

                // Find next enemy with same debuff
                cascadeTarget = enemies.find(enemy =>
                    !enemy.destroyed &&
                    enemy.stats.debuffs.some(d => d.id === debuffId)
                );

                if (!cascadeTarget) break;

                state.animationEvents.push({
                    targetId: cascadeTarget.id,
                    detonatorId: ability.id,
                    timestamp: Date.now(),
                });

                // Remove debuff
                const removed = cascadeTarget.stats.debuffs.filter(d => d.id === debuffId);
                cascadeTarget.stats.debuffs = cascadeTarget.stats.debuffs.filter(d => d.id !== debuffId);

                cascadeDamage = cascadeDamage * (1 + removed.length * 0.75)
            }

            break;
        
        case "stunner":

            applyDebuff(target, debuffs.stunned.id, removedCount);

            state.log.push(
                `Stunned ${target.name} for ${removedCount} rounds`
            );

            break;

        default:
            break;
    }


}