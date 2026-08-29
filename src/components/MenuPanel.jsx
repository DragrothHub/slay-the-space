import ShipSelection from "../selections/ShipSelection";
import InventoryScreen from "./InventoryScreen";
import { useGameState } from "../state/GameStateProvider";


export default function MenuPanel() {
    const { gameState } = useGameState();

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999,

                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",

                overflowY: "auto",

                background: "rgba(0, 0, 0, 0.90)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100%",
                    maxWidth: "390px",

                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",

                    paddingTop: "45px",
                    boxSizing: "border-box",
                }}
            >
                {!gameState.run.battle && <ShipSelection
                    ships={gameState.run.ships}
                    title="Your Team"
                    maxSelections={0}
                    allowModuleChange={true}
                    allowAbilityChange={true}
                />}

                {!gameState.run.battle && <div style={{ textAlign: "center", fontSize: "1.5em", }}>Inventory</div>}
                {!gameState.run.battle && <InventoryScreen />}

                {gameState.run.battle && <div style={{ textAlign: "center", fontSize: "1.5em", }}>Active Battle</div>}

                {gameState.run.battle && <ShipSelection
                    ships={gameState.run.battle.teams.A}
                    title="Your Team"
                    maxSelections={0}
                />}

                {gameState.run.battle && <ShipSelection
                    ships={gameState.run.battle.teams.B}
                    title="Enemy Team"
                    maxSelections={0}
                />}
            </div>
        </div>
    );
}