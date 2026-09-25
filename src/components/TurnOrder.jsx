import { useGameState } from "../state/GameStateProvider";

import interceptor from "../images/interceptor.png";
import corvette from "../images/corvette.png";
import frigate from "../images/frigate.png";
import dreadnought from "../images/dreadnought.png";

import { selectTarget } from "../engine/turnEngine";
import { getRemainingCooldown } from "../engine/cooldowns";
import { gradientFromDebuffList } from "../engine/helpers";
import { abilityCollection } from "../data/abilities";

// ============================================================
// ABILITY HELPERS
// ============================================================

function getPrimerAbility(ship) {
    return abilityCollection[ship.abilities?.find(
        abilityId => abilityCollection[abilityId].primer === true
    )] ?? null;
}

function getDetonatorAbility(ship) {
    return abilityCollection[ship.abilities?.find(
        abilityId => abilityCollection[abilityId].detonator === true
    )] ?? null;
}


// ============================================================
// COOLDOWN
// ============================================================

function isAbilityReadyForNextTurn(ship, abilityId) {
    return getRemainingCooldown(ship, abilityId) <= 1;
}


// ============================================================
// ABILITY STATE
// ============================================================

function getPrimerState(ship) {
    const ability = getPrimerAbility(ship);

    if (!ability?.appliesDebuff)
        return null;

    const color = gradientFromDebuffList(ability.appliesDebuff);

    if (!color)
        return null;

    return {
        color,
        available: isAbilityReadyForNextTurn(ship, ability.id),
    };
}

function getDetonatorState(ship) {
    const ability = getDetonatorAbility(ship);

    if (!ability?.detonatesDebuff)
        return null;

    const color = gradientFromDebuffList(ability.detonatesDebuff);

    if (!color)
        return null;

    return {
        color,
        available: isAbilityReadyForNextTurn(ship, ability.id),
    };
}


// ============================================================
// COMPONENT
// ============================================================

export default function TurnOrder() {

    const { gameState, updateBattle } = useGameState();

    if (!gameState?.run?.battle)
        return null;

    const battle = gameState.run.battle;

    const turnOrder = battle.turnOrder;
    const turnIndex = battle.turnIndex;

    const shipIcons = {
        interceptor,
        corvette,
        frigate,
        dreadnought,
    };


    // ========================================================
    // TARGET SELECTION
    // ========================================================

    function canSelectTarget(target) {

        if (target.destroyed)
            return false;

        const targetIsInTeamA =
            battle.teams.A.some(u => u.id === target.id);

        const sourceIsInTeamA =
            battle.teams.A.some(
                u => u.id === battle.activeUnitId
            );

        if (targetIsInTeamA === sourceIsInTeamA)
            return false;

        return true;
    }


    function handleSelectTarget(target) {

        if (
            canSelectTarget(target) &&
            !battle.winner
        ) {
            updateBattle(s =>
                selectTarget(s, target.id)
            );
        }
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            style={{
                position: "absolute",
                top: "2px",
                left: "2px",

                padding: "5px",

                maxHeight: "340px",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",

                overflowY: "auto",
                scrollbarWidth: "none",

                zIndex: 10,
            }}
        >

            {turnOrder.map((ship, i) => {

                const isPlayerShip =
                    gameState.run.ships.some(
                        s => s.id === ship.id
                    );

                const isSelectedTarget =
                    battle.selectedTargetId === ship.id;

                const isActive =
                    i === turnIndex;

                const icon =
                    shipIcons[ship.class];

                if (ship.destroyed)
                    return null;


                // ------------------------------------------------
                // PRIMER / DETONATOR
                // ------------------------------------------------

                const primer =
                    getPrimerState(ship);

                const detonator =
                    getDetonatorState(ship);


                // ------------------------------------------------
                // COLORS
                // ------------------------------------------------

                const shipBorderColor =
                    isPlayerShip
                        ? "#9ecbff"
                        : "#ef4444";


                // ------------------------------------------------
                // RENDER
                // ------------------------------------------------

                return (
                    <div
                        key={ship.id}
                        onClick={() =>
                            handleSelectTarget(ship)
                        }
                        style={{
                            position: "relative",

                            flex: "0 0 auto",

                            width: "34px",
                            height: "34px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: "8px",

                            border:
                                `1px solid ${shipBorderColor}`,

                            outlineOffset: "2px",

                            outline: isActive
                                ? `2px solid ${shipBorderColor}`
                                : isSelectedTarget
                                    ? "2px solid #fcff4c"
                                    : "none",

                            background:
                                isPlayerShip
                                    ? "#9ecbff33"
                                    : "#ef444433",

                            boxShadow: isActive
                                ? "0 0 10px rgba(255,255,255,0.3)"
                                : "none",

                            cursor:
                                canSelectTarget(ship)
                                    ? "pointer"
                                    : "default",

                            transition:
                                "all 150ms ease",
                        }}
                    >

                        {/* ======================================
                            SHIP ICON
                        ====================================== */}

                        <img
                            src={icon}
                            alt={ship.class}
                            style={{
                                width:
                                    isActive
                                        ? "28px"
                                        : "23px",

                                height:
                                    isActive
                                        ? "28px"
                                        : "23px",

                                objectFit: "contain",

                                transition:
                                    "all 150ms ease",
                            }}
                        />


                        {/* ======================================
                            PRIMER
                        ====================================== */}

                        {primer && (
                            <div
                                style={{
                                    position: "absolute",

                                    bottom: "2px",
                                    right: "12px",

                                    width: "5px",
                                    height: "5px",

                                    boxSizing: "border-box",

                                    borderRadius: "50%",

                                    background: primer.available
                                        ? primer.color
                                        : `linear-gradient(
                                            rgba(0, 0, 0, 0.6),
                                            rgba(0, 0, 0, 0.6)
                                        ) padding-box,
                                        ${primer.color} border-box`,

                                    border: primer.available
                                        ? `1px solid ${primer.color}`
                                        : "1px solid transparent",

                                    pointerEvents: "none",
                                }}
                            />
                        )}


                        {/* ======================================
                            DETONATOR
                        ====================================== */}

                        {detonator && (
                            <div
                                style={{
                                    position: "absolute",

                                    bottom: "2px",
                                    right: "4px",

                                    width: "5px",
                                    height: "5px",

                                    boxSizing: "border-box",

                                    borderRadius: "50%",

                                    background: detonator.available
                                        ? detonator.color
                                        : `linear-gradient(
                                            rgba(0, 0, 0, 0.6),
                                            rgba(0, 0, 0, 0.6)
                                        ) padding-box,
                                        ${detonator.color} border-box`,

                                    border: detonator.available
                                        ? `1px solid ${detonator.color}`
                                        : "1px solid transparent",

                                    pointerEvents: "none",
                                }}
                            />
                        )}

                    </div>
                );
            })}
        </div>
    );
}