import { applyDamage } from "./damage";
import { getFriendlyUnits } from "./helpers";

// ========================================
// DETONATION
// ========================================

export function detonate(target, actor, ability, state) {
    const debuffId = ability.detonatesDebuff;

    // ==============================
    // 1. COUNT + REMOVE DEBUFFS
    // ==============================
    const before = target.stats.debuffs.length;

    const removedDebuffs = target.stats.debuffs.filter(
        d => d.id === debuffId
    );

    target.stats.debuffs = target.stats.debuffs.filter(
        d => d.id !== debuffId
    );

    const removedCount = removedDebuffs.length;

    if (removedCount === 0) return;

    // ==============================
    // 2. MAIN EXPLOSION DAMAGE
    // ==============================
    const baseDamage = ability.value;

    const detonationMultiplier = 1 + removedCount * 0.75;

    const explosionDamage = baseDamage * detonationMultiplier;

    applyDamage(target, actor, {
        ...ability,
        value: explosionDamage,
    }, state);

    state.log.push(
        `${target.name} detonated ${removedCount} stack(s) of ${debuffId}`
    );

    // ==============================
    // 3. SPLASH DAMAGE
    // ==============================
    const enemies = getFriendlyUnits(state, target);

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
}