import { useGameState } from "../state/GameStateProvider";
import Ship from "./Ship";

function TeamFleet({
    team,
    state,
    handleSelectTarget,
    reverse = false,
}) {
    const topRow = team.slice(0, 2);
    const bottomRow = team.slice(2, 4);

    const renderImageRow = (row, rowIndex) => (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "0px",

                // ganze Reihe leicht verschieben
                transform:
                    rowIndex === 0
                        ? "translateX(-20px)"
                        : "translateX(20px)",
            }}
        >
            {row.map((unit, index) => (
                <div
                    key={unit.id}
                    style={{
                        // einzelne ships zusätzlich leicht versetzen
                        transform:
                            index % 2 === 0
                                ? "translateY(0px)"
                                : "translateY(-12px)",
                    }}
                >
                    <Ship
                        unit={unit}
                        damageEvents={state.damageEvents}
                        isActive={state.activeUnitId === unit.id}
                        isTargeted={state.selectedTargetId === unit.id}
                        isDead={unit.stats.currentHull <= 0}
                        mode="image"
                        reverse={reverse}
                        onClick={() => handleSelectTarget(unit)}
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Gegner zuerst Stats, dann Ships */}
            {reverse && (
                <>
                    {renderImageRow(topRow, 0)}
                    {renderImageRow(bottomRow, 1)}
                </>
            )}

            {/* Spieler zuerst Ships, dann Stats */}
            {!reverse && (
                <>
                    {renderImageRow(topRow, 0)}
                    {renderImageRow(bottomRow, 1)}
                </>
            )}
        </div>
    );
}

export default function BattleField({ handleSelectTarget }) {

    const { gameState } = useGameState();
    if(!gameState.run?.battle) return null;
    const teamA = gameState.run.battle.teams.A;
    const teamB = gameState.run.battle.teams.B;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "100px",
                paddingTop: 60,
                paddingBottom: 60,
            }}
        >
            {/* TEAM B */}
            <TeamFleet
                team={teamB}
                state={gameState.run.battle}
                reverse={true}
                handleSelectTarget={handleSelectTarget}
            />

            {/* TEAM A */}
            <TeamFleet
                team={teamA}
                state={gameState.run.battle}
                reverse={false}
                handleSelectTarget={handleSelectTarget}
            />
        </div>
    );
}