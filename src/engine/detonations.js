import { applyDamage } from "./damage";
import { applyDebuff, debuffs } from "./debuffs";
import { getFriendlyUnits, isPlayerShip, repairShip } from "./helpers";
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
        displayName: "Detonaton",
        value: explosionDamage,
    }, state);

    state.log.push(
        `${detonatedDebuffCount} stack(s) of ${detonateDebuffIds.join(", ")} detonated on <${isPlayerShip(state, target) ? "player" : "enemy"}>${target.name}</${isPlayerShip(state, target) ? "player" : "enemy"}> for <damage>${damageDone}</damage> damage`
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
                    displayName: "Bomber Explosion",
                    value: splashDamage,
                }, state);
            }

            break;
        }

        case "cleanse": {
            // ==============================
            // CLEANSE DEBUFFS
            // ==============================

            const team = getFriendlyUnits(state, actor);

            for (const ship of team) {

                ship.stats.debuffs = ship.stats.debuffs.filter(
                    d => debuffs[d.id]?.category === "mechanic"
                );
            }

            state.log.push(
                `<${isPlayerShip(state, actor) ? "player" : "enemy"}>${actor.name}</${isPlayerShip(state, actor) ? "player" : "enemy"}> cleanses all debuffs from all team ships.`
            );

            state.animationEvents.push({
                targetId: actor.id,
                mechanicId: "cleanseDebuffs",
                color: debuffs[ability.detonatesDebuff[0]].color,
                timestamp: Date.now(),
            });

            break;
        }

        case "spike": {
            // ==============================
            // SINGLE TARGET DAMAGE
            // ==============================

            applyDamage(target, actor, {
                ...ability,
                displayName: "Impale",
                value: explosionDamage,
            }, state);

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
                `<${isPlayerShip(state, actor) ? "player" : "enemy"}>${actor.name}</${isPlayerShip(state, actor) ? "player" : "enemy"}>: Gained <shield>${shieldRestored}</shield> shield by Vampyr Detonator.`
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

                    // for (let i = 0; i < stackCount; i++) {
                    //     applyDebuff(enemy, debuffId);
                    // }

                    if(stackCount > 0){
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
                        displayName: "Cascade Explosion",
                        value: cascadeDamage,
                    }, state);
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
                `Stunned <${isPlayerShip(state, target) ? "player" : "enemy"}>${target.name}</${isPlayerShip(state, target) ? "player" : "enemy"}> for ${detonatedDebuffCount} rounds`
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

            break;
        }

        default:
            break;
    }
}