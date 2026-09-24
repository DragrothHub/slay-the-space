import {
    createBattleState,
    initBattle,
    resolveAction
} from "./turnEngine";

import {
    getActiveUnit,
    getAllUnits,
    isPlayerShip
} from "./helpers";

import { calculateNextAIIntent } from "./ai";
import { createEnemyTest, createShip } from "../data/createShip";


// ========================================
// SIMULATE ONE BATTLE
// ========================================

/*
Testdurchlauf:

const teamA = [createShip(),createShip(),];
const teamB = [createShip(),createShip(),];
const result = simulateBattle(teamA, teamB);
console.log(result);

Anlegen von Testschiffen:

createShip(2, 360, {
    class: "frigate",
    abilities: [
        "neutral_offensive_laser",
        "primer_x",
        "detonator_y"
    ]
});


Oder so:

const teamA = [
    createShip(2, 360, {
        abilities: [
            "neutral_offensive_laser"
        ],
    }),
]

const teamB = [
    createStandardEnemy(),
]

const result = simulateBattle(teamA, teamB);
console.log(result);
*/

export function createStandardEnemy() {
    return createEnemyTest({
        typeId: "standardEnemy",
        name: "Training Dummy",

        shield: 100,
        armor: 100,
        hull: 100,

        attributes: {
            initiative: 1,
            kineticAtk: 0,
            laserAtk: 0,
            hull: 0,
            shieldDef: 0,
            armorDef: 0,
        },

        abilities: []
    });
}

export function simulateBattle(teamA, teamB, options = {}) {

    const maxActions = options.maxActions ?? 1000;

    const state = createBattleState(teamA, teamB);

    initBattle(state);

    let actions = 0;

    while (!state.winner && actions < maxActions) {

        const actor = getActiveUnit(state);

        if (!actor) {
            break;
        }

        // ========================================
        // PLAYER / TEAM A
        // ========================================

        if (isPlayerShip(state, actor)) {

            const intent = calculateNextAIIntent(state, actor);

            if (!intent) {
                break;
            }

            state.selectedAbilityId = intent.abilityId;
            state.selectedTargetId = intent.targetId;
        }

        // ========================================
        // ENEMY / TEAM B
        // ========================================

        // Bei einem Enemy wurden selectedAbilityId
        // und selectedTargetId bereits von aiTurn()
        // gesetzt.

        if (!state.selectedAbilityId || !state.selectedTargetId) {
            break;
        }

        // ========================================
        // RESOLVE
        // ========================================

        resolveAction(state);

        actions++;
    }

    return {
        teamA,
        teamB,

        winner: state.winner,
        rounds: state.round,
        actions,
        aborted: !state.winner && actions >= maxActions,
        state,
        aggregatedDamageEvents: aggregateDamageEvents(state),
    };
}

export function aggregateDamageEvents(state) {

    const result = {};

    state.damageEvents.forEach(event => {

        const actor = getAllUnits(state).find(
            unit => unit.id === event.actorId
        );

        if (!actor) return;

        // Nicht nach zufälliger ID gruppieren,
        // sondern nach der ID des konkreten Schiffs.
        if (!result[actor.id]) {

            result[actor.id] = {
                id: actor.id,
                name: actor.name,
                typeId: actor.typeId,
                class: actor.class,

                abilities: actor.abilities,
                modules: actor.modules,

                totalDamage: 0,
                attacks: 0,
                averageDamagePerAttack: 0,

                abilityStats: {}
            };
        }

        const ship = result[actor.id];

        // ========================================
        // SHIP TOTALS
        // ========================================

        ship.totalDamage += event.amount;
        ship.attacks++;

        // ========================================
        // ABILITY
        // ========================================

        if (!ship.abilityStats[event.abilityId]) {

            ship.abilityStats[event.abilityId] = {
                attacks: 0,

                totalDamage: 0,
                shieldDamage: 0,
                armorDamage: 0,
                hullDamage: 0,

                averageDamagePerAttack: 0
            };
        }

        const ability =
            ship.abilityStats[event.abilityId];

        ability.attacks++;

        ability.totalDamage += event.amount;
        ability.shieldDamage += event.shieldDmg;
        ability.armorDamage += event.armorDmg;
        ability.hullDamage += event.hullDmg;
    });

    // ========================================
    // AVERAGES
    // ========================================

    Object.values(result).forEach(ship => {

        if (ship.attacks > 0) {
            ship.averageDamagePerAttack =
                ship.totalDamage / ship.attacks;
        }

        Object.values(ship.abilityStats).forEach(ability => {

            if (ability.attacks > 0) {
                ability.averageDamagePerAttack =
                    ability.totalDamage / ability.attacks;
            }
        });
    });

    return result;
}



export function createTestShip({
    name,
    class: shipClass
}) {

    const ship = createShip(
        2,
        360,
        {
            class: shipClass
        }
    );

    ship.name = name;

    return ship;
}

export function simulateBattles(createTeams, count = 10000, options = {}) {

    const results = [];

    for (let i = 0; i < count; i++) {

        const { teamA, teamB } = createTeams();

        const result = simulateBattle(
            teamA,
            teamB,
            options
        );

        results.push(result);
    }

    return {
        count,
        results,
        aggregate: aggregateSimulationResults(results)
    };
}

export function aggregateSimulationResults(results) {

    console.log(results);

    const aggregate = {
        battles: results.length,

        combatants: {},

        matchups: {}
    };

    for (const battle of results) {

        const teamA = battle.teamA;
        const teamB = battle.teamB;

        const nameA = getCombatantName(teamA);
        const nameB = getCombatantName(teamB);

        // ========================================
        // COMBATANTS
        // ========================================

        ensureCombatant(aggregate, nameA);
        ensureCombatant(aggregate, nameB);

        aggregate.combatants[nameA].battles++;
        aggregate.combatants[nameB].battles++;

        // ========================================
        // WIN / LOSS
        // ========================================

        if (battle.winner === "A") {

            aggregate.combatants[nameA].wins++;
            aggregate.combatants[nameB].losses++;

        } else if (battle.winner === "B") {

            aggregate.combatants[nameB].wins++;
            aggregate.combatants[nameA].losses++;

        } else {

            aggregate.combatants[nameA].draws++;
            aggregate.combatants[nameB].draws++;
        }

        // ========================================
        // MATCHUP
        // ========================================

        ensureMatchup(
            aggregate,
            nameA,
            nameB
        );

        const matchup =
            aggregate.matchups[nameA][nameB];

        matchup.battles++;

        if (battle.winner === "A") {
            matchup.winsA++;
        }

        if (battle.winner === "B") {
            matchup.winsB++;
        }

        if (!battle.winner) {
            matchup.draws++;
        }

        // ========================================
        // DAMAGE
        // ========================================

        for (const ship of Object.values(
            battle.aggregatedDamageEvents
        )) {

            const name = ship.name;

            ensureCombatant(
                aggregate,
                name
            );

            const combatant =
                aggregate.combatants[name];

            combatant.totalDamage +=
                ship.totalDamage;

            combatant.attacks +=
                ship.attacks;

            mergeAbilityStats(
                combatant,
                ship
            );
        }
    }

    // ========================================
    // CALCULATE FINAL VALUES
    // ========================================

    finalizeCombatants(aggregate);
    finalizeMatchups(aggregate);

    return aggregate;
}

function mergeAbilityStats(combatant, ship) {

    Object.entries(ship.abilityStats)
        .forEach(([abilityId, ability]) => {

            if (!combatant.abilityStats[abilityId]) {

                combatant.abilityStats[abilityId] = {
                    attacks: 0,

                    totalDamage: 0,
                    shieldDamage: 0,
                    armorDamage: 0,
                    hullDamage: 0,

                    averageDamagePerAttack: 0
                };
            }

            const target =
                combatant.abilityStats[abilityId];

            target.attacks += ability.attacks;

            target.totalDamage +=
                ability.totalDamage;

            target.shieldDamage +=
                ability.shieldDamage;

            target.armorDamage +=
                ability.armorDamage;

            target.hullDamage +=
                ability.hullDamage;
        });
}

function ensureCombatant(aggregate, name) {

    if (!aggregate.combatants[name]) {

        aggregate.combatants[name] = {

            name,

            battles: 0,

            wins: 0,
            losses: 0,
            draws: 0,

            winRate: 0,

            totalDamage: 0,
            attacks: 0,
            averageDamagePerAttack: 0,

            abilityStats: {}
        };
    }
}

function ensureMatchup(
    aggregate,
    nameA,
    nameB
) {

    if (!aggregate.matchups[nameA]) {
        aggregate.matchups[nameA] = {};
    }

    if (!aggregate.matchups[nameA][nameB]) {

        aggregate.matchups[nameA][nameB] = {

            combatantA: nameA,
            combatantB: nameB,

            battles: 0,

            winsA: 0,
            winsB: 0,
            draws: 0,

            winRateA: 0,
            winRateB: 0
        };
    }
}

function finalizeCombatants(aggregate) {

    Object.values(aggregate.combatants)
        .forEach(combatant => {

            if (combatant.battles > 0) {

                combatant.winRate =
                    combatant.wins /
                    combatant.battles;
            }

            if (combatant.attacks > 0) {

                combatant.averageDamagePerAttack =
                    combatant.totalDamage /
                    combatant.attacks;
            }

            Object.values(
                combatant.abilityStats
            ).forEach(ability => {

                if (ability.attacks > 0) {

                    ability.averageDamagePerAttack =
                        ability.totalDamage /
                        ability.attacks;
                }
            });
        });
}

function finalizeMatchups(aggregate) {

    Object.values(aggregate.matchups)
        .forEach(row => {

            Object.values(row)
                .forEach(matchup => {

                    if (matchup.battles > 0) {

                        matchup.winRateA =
                            matchup.winsA /
                            matchup.battles;

                        matchup.winRateB =
                            matchup.winsB /
                            matchup.battles;
                    }
                });
        });
}

function getCombatantName(team) {

    if (team.length === 1) {
        return team[0].name;
    }

    return team
        .map(unit => unit.name)
        .join(" + ");
}

export function simulationAggregateToString(
    aggregate
) {

    const lines = [];

    const formatNumber =
        value => value.toLocaleString("en-US");

    const formatPercent =
        value => `${(value * 100).toFixed(2)}%`;

    const formatDamage =
        value => value.toFixed(2);

    // ========================================
    // HEADER
    // ========================================

    lines.push(
        "========================================"
    );

    lines.push(
        "BALANCE SIMULATION"
    );

    lines.push(
        "========================================"
    );

    lines.push("");

    lines.push(
        `Battles: ${formatNumber(aggregate.battles)}`
    );

    lines.push("");

    // ========================================
    // COMBATANTS
    // ========================================

    lines.push(
        "----------------------------------------"
    );

    lines.push(
        "COMBATANTS"
    );

    lines.push(
        "----------------------------------------"
    );

    for (
        const combatant
        of Object.values(aggregate.combatants)
    ) {

        lines.push("");
        lines.push(combatant.name);

        lines.push(
            `  Battles: ${formatNumber(
                combatant.battles
            )}`
        );

        lines.push(
            `  Wins: ${formatNumber(
                combatant.wins
            )}`
        );

        lines.push(
            `  Losses: ${formatNumber(
                combatant.losses
            )}`
        );

        lines.push(
            `  Draws: ${formatNumber(
                combatant.draws
            )}`
        );

        lines.push(
            `  Win rate: ${formatPercent(
                combatant.winRate
            )}`
        );

        lines.push("");

        lines.push(
            `  Total damage: ${formatNumber(
                combatant.totalDamage
            )}`
        );

        lines.push(
            `  Attacks: ${formatNumber(
                combatant.attacks
            )}`
        );

        lines.push(
            `  Average damage/attack: ${formatDamage(
                combatant.averageDamagePerAttack
            )
            }`
        );

        // ====================================
        // ABILITIES
        // ====================================

        if (
            Object.keys(
                combatant.abilityStats
            ).length > 0
        ) {

            lines.push("");
            lines.push("  Abilities:");

            for (
                const [
                    abilityId,
                    ability
                ]
                of Object.entries(
                    combatant.abilityStats
                )
            ) {

                lines.push(
                    `    ${abilityId}`
                );

                lines.push(
                    `      Attacks: ${formatNumber(
                        ability.attacks
                    )
                    }`
                );

                lines.push(
                    `      Total damage: ${formatNumber(
                        ability.totalDamage
                    )
                    }`
                );

                lines.push(
                    `      Shield damage: ${formatNumber(
                        ability.shieldDamage
                    )
                    }`
                );

                lines.push(
                    `      Armor damage: ${formatNumber(
                        ability.armorDamage
                    )
                    }`
                );

                lines.push(
                    `      Hull damage: ${formatNumber(
                        ability.hullDamage
                    )
                    }`
                );

                lines.push(
                    `      Average damage/attack: ${formatDamage(
                        ability.averageDamagePerAttack
                    )
                    }`
                );
            }
        }
    }

    // ========================================
    // WIN RATE MATRIX
    // ========================================

    lines.push("");
    lines.push(
        "----------------------------------------"
    );

    lines.push(
        "WIN RATE MATRIX"
    );

    lines.push(
        "----------------------------------------"
    );

    lines.push(
        createWinRateMatrixString(
            aggregate
        )
    );

    lines.push("");
    lines.push(
        "========================================"
    );

    return lines.join("\n");
}

function createWinRateMatrixString(
    aggregate
) {

    const names =
        Object.keys(
            aggregate.combatants
        );

    if (names.length === 0) {
        return "No combatants.";
    }

    // Spaltenbreite bestimmen
    const nameWidth = Math.max(
        12,
        ...names.map(name => name.length)
    );

    const cellWidth = 14;

    const pad =
        (value, width) =>
            String(value)
                .padStart(width);

    const lines = [];

    // Header
    let header =
        " ".repeat(nameWidth + 2);

    for (const name of names) {

        header +=
            pad(
                name,
                cellWidth
            );
    }

    lines.push(header);

    // Rows
    for (const rowName of names) {

        let row =
            rowName.padEnd(nameWidth + 2);

        for (const columnName of names) {

            if (rowName === columnName) {
                row += pad("--", cellWidth);
                continue;
            }

            // Direkte Richtung vorhanden?
            const directMatchup =
                aggregate.matchups[rowName]
                ?.[columnName];

            if (directMatchup) {

                row += pad(
                    `${(directMatchup.winRateA * 100).toFixed(2)}%`,
                    cellWidth
                );

                continue;
            }

            // Gegenrichtung vorhanden?
            const reverseMatchup =
                aggregate.matchups[columnName]
                ?.[rowName];

            if (reverseMatchup) {

                // Wenn dort columnName = A und rowName = B ist,
                // interessiert uns hier die Gewinnrate von B.
                const winRate =
                    reverseMatchup.winRateB;

                row += pad(
                    `${(winRate * 100).toFixed(2)}%`,
                    cellWidth
                );

                continue;
            }

            row += pad("n/a", cellWidth);
        }

        lines.push(row);
    }

    return lines.join("\n");
}