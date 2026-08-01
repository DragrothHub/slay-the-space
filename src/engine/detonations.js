import { applyDamage } from "./damage";
import { applyDebuff } from "./debuffs";
import { getFriendlyUnits } from "./helpers";

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

    if(ability.detonatorEffect != "spreader"){
        target.stats.debuffs = target.stats.debuffs.filter(
            d => d.id !== debuffId
        );
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
        `${removedCount} stack(s) of ${debuffId} detonated on ${target.name}`
    );

    // ==============================
    // 3. DETONATION EFFECT
    // ==============================

    switch (ability.detonatorEffect) {
        case "bomber":
            // ==============================
            // SPLASH DAMAGE
            // ==============================
            const splashTargets = enemies.filter(u => u.id !== target.id);

            const splashDamage = explosionDamage * 0.4;

            for (const enemy of splashTargets) {
                applyDamage(enemy, actor, {
                    ...ability,
                    value: splashDamage,
                }, state);
            }

            if (splashTargets.length > 0) {
                state.log.push(
                    `Explosion deals splash damage to ${splashTargets.length} targets`
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
            // HEAL FROM DAMAGE
            // ==============================
            actor.stats.currentShield += damageDone;

            state.log.push(
                `${actor.name} reloads shield by ${damageDone}`
            );

            break;
    
        case "spreader":
            // ==============================
            // SPREAD THE DEBUFF TO THE FLEET
            // ==============================
            const spreadTargets = enemies.filter(u => u.id !== target.id);

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

        default:
            break;
    }


}