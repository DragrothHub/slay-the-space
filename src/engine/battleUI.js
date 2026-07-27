// ========================================
// BATTLE UI / PRESENTATION
// ========================================

// Diese Datei enthält:
// - Animationen
// - Delays
// - Kamera
// - Sound
// - VFX
// - UI Highlighting
// - Player Input UI
//
// Die Battle Logic wartet IMMER auf diese Methoden.
//
// Aktuell sind nur Platzhalter enthalten.

// ========================================
// HELPERS
// ========================================

function wait(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// ========================================
// BATTLE FLOW
// ========================================

export async function showBattleStart(state) {

    // TODO:
    // Intro Animation
    // Camera Pan
    // Battle Banner
    // Music Start

    await wait(1000);
}

export async function showBattleEnd(state) {

    // TODO:
    // Victory / Defeat Screen
    // Explosion Background
    // Slow Motion Finish
    // Rewards Screen

    await wait(1500);
}

// ========================================
// TURN FLOW
// ========================================

export async function showTurnStart(actor) {

    // TODO:
    // Highlight active ship
    // Move camera
    // UI portrait glow
    // Turn banner

    console.log("TURN START:", actor.name);

    await wait(700);
}

export async function showTurnEnd(actor) {

    // TODO:
    // Remove highlights
    // End turn animation

    await wait(300);
}

export async function showDestroyedSkip(actor) {

    // TODO:
    // Optional:
    // Show wreckage
    // Skip notification

    await wait(200);
}

// ========================================
// STATUS EFFECTS
// ========================================

export async function showTurnStartEffects(
    actor,
    state
) {

    // TODO:
    // Shock VFX
    // Burning FX
    // DOT numbers
    // Debuff icons pulse

    await wait(500);
}

export async function showStunned(actor) {

    // TODO:
    // EMP effect
    // Stun icon
    // Audio cue

    console.log(actor.name, "is stunned");

    await wait(800);
}

// ========================================
// AI PRESENTATION
// ========================================

export async function showAiThinking(actor) {

    // TODO:
    // AI portrait pulse
    // "Calculating..."
    // Tactical scan effect

    console.log(actor.name, "thinking...");

    await wait(1000);
}

export async function showTargetSelection(
    actor,
    target
) {

    // TODO:
    // Red target outline
    // Camera focus
    // Lock-on VFX

    console.log(
        actor.name,
        "targets",
        target.name
    );

    await wait(800);
}

export async function showAbilitySelection(
    actor,
    ability
) {

    // TODO:
    // Ability name popup
    // Weapon charging effect
    // Energy buildup

    console.log(
        actor.name,
        "uses",
        ability.displayName
    );

    await wait(1000);
}

// ========================================
// PLAYER INPUT
// ========================================

export async function requestPlayerTarget(
    state,
    actor
) {

    // TODO:
    // Wait for actual player UI input
    // Highlight selectable targets
    // Hover previews

    // TEMP:
    return state.teams.B.find(
        u => u.stats.currentHull > 0
    );
}

export async function requestPlayerAbility(
    state,
    actor
) {

    // TODO:
    // Wait for player button click
    // Ability tooltip
    // Cooldown display

    // TEMP:
    return actor.abilities[0];
}

// ========================================
// ACTION PRESENTATION
// ========================================

export async function showAbilityCast(
    actor,
    ability,
    target
) {

    // TODO:
    // Muzzle flash
    // Ship recoil
    // Charge animation
    // Sound FX

    await wait(500);
}

export async function showProjectile(
    actor,
    target,
    ability
) {

    // TODO:
    // Laser projectile
    // Missile flight
    // Beam effect
    // Trail particles

    await wait(700);
}

export async function showDamageResult(
    target,
    damageEvents
) {

    // TODO:
    // Floating numbers
    // Shield impact
    // Hull sparks
    // Camera shake
    // Explosion VFX

    await wait(800);
}

export async function showDestroyed(target) {

    // TODO:
    // Ship explosion
    // Debris
    // Flash
    // Sound FX
    // Screen shake

    console.log(target.name, "destroyed");

    await wait(1200);
}