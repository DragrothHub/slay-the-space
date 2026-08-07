import { useGameState } from "../state/GameStateProvider";

import interceptor from "../images/interceptor.png";
import corvette from "../images/corvette.png";
import frigate from "../images/frigate.png";
import dreadnaught from "../images/dreadnaught.png";

export default function TurnOrder() {

    const { gameState } = useGameState();

    if (!gameState?.run?.battle) return null;

    const turnOrder = gameState.run.battle.turnOrder;
    const turnIndex = gameState.run.battle.turnIndex;

    const shipIcons = {
        interceptor,
        corvette,
        frigate,
        dreadnaught,
    };

    return (
        <div
            style={{
                position: "absolute",
                top: "2px",
                left: "50%",
                transform: "translateX(-50%)",

                maxWidth: "calc(100% - 24px)",

                display: "flex",
                alignItems: "center",
                gap: "6px",

                overflowX: "auto",
                scrollbarWidth: "none",

                zIndex: 10,
            }}
        >
            {turnOrder.map((ship, i) => {

                const isPlayerShip =
                    gameState.run.ships.some(s => s.id === ship.id);

                const isActive = i === turnIndex;

                const icon = shipIcons[ship.class];

                return (
                    <div
                        key={ship.id}
                        style={{
                            flex: "0 0 auto",

                            width: "34px",
                            height: "34px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: "8px",

                            border: isActive
                                ? `2px solid ${isPlayerShip ? "#4ade80" : "#f87171"}`
                                : `1px solid ${
                                    isPlayerShip
                                        ? "rgba(74,222,128,0.5)"
                                        : "rgba(248,113,113,0.5)"
                                }`,

                            background: isPlayerShip
                                ? "rgba(30, 80, 50, 0.35)"
                                : "rgba(100, 30, 30, 0.35)",

                            boxShadow: isActive
                                ? "0 0 10px rgba(255,255,255,0.3)"
                                : "none",

                            transition: "all 150ms ease",
                        }}
                    >
                        <img
                            src={icon}
                            alt={ship.class}
                            style={{
                                width: isActive ? "28px" : "23px",
                                height: isActive ? "28px" : "23px",

                                objectFit: "contain",

                                transition: "all 150ms ease",
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}