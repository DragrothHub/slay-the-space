import RepairOption from "./RepairOption";
import { useState } from "react";
import { useGameState } from "../state/GameStateProvider";

function RepairScreen() {

    const {
        gameState,
        setScreen,
        updateShips
    } = useGameState();

    const [ repairUsed, setRepairUsed ] = useState(false);

    if(!gameState || !gameState?.run?.ships)
        return;

    const ships = gameState.run.ships;

    function onLeave() {
        
        // Confirm when repair not used
        if (!repairUsed) {
            if (!confirm("Repair was not used by now. Leave anyways?"))
                return;
        }

        setScreen("map");
    }

    function onRepair(type) {

        console.log("repair: ", type);

        const repairedShips = gameState.run.ships.map(ship => ({
            ...ship,
            stats: {
                ...ship.stats,
                currentShield: ship.stats.maxShield,
                currentArmor: ship.stats.maxArmor,
                currentHull: ship.stats.maxHull,
            }
        }));

        updateShips(repairedShips);
        
        setRepairUsed(true);
    }

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
            }}
        >
            <div
                style={{
                    width: "700px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "28px",
                            letterSpacing: "4px",
                        }}
                    >
                        REPAIR DOCK
                    </div>

                    <div
                        style={{
                            marginTop: "8px",
                            opacity: 0.5,
                        }}
                    >
                        Select a repair protocol
                    </div>
                </div>

                <RepairOption
                    title="FIELD REPAIR"
                    description="Repair all ships."
                    effect="+20% Hull"
                    onClick={() => onRepair("field")}
                />

                <RepairOption
                    title="MAJOR REPAIR"
                    description="Heavily repair one ship."
                    effect="+60% Hull · +30% Armor"
                    onClick={() => onRepair("major")}
                />

                <RepairOption
                    title="SHIELD RECALIBRATION"
                    description="Restore the shields of your entire fleet."
                    effect="Fully restore Shields"
                    onClick={() => onRepair("shield")}
                />

                <button
                    onClick={onLeave}
                    style={{
                        background: "#0a1118",
                        borderRadius: 10,
                        padding: 12,
                        border: "1px solid #243342",
                        fontSize: 14,
                        marginTop: "8px",
                        color: "#fff",
                    }}
                >
                    Leave
                </button>
            </div>
        </div>
    );
}

export default RepairScreen;