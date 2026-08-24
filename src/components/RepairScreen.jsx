import RepairOption from "./RepairOption";
import { useState } from "react";
import { useGameState } from "../state/GameStateProvider";
import Selection from "../selections/Selection";
import { MiniShipCard } from "../components/ShipCard";

function RepairScreen() {

    const {
        gameState,
        setScreen,
        updateShips
    } = useGameState();

    const [repairUsed, setRepairUsed] = useState(false);
    const [shipSelectionOpen, setShipSelectionOpen] = useState(false);

    if (!gameState || !gameState?.run?.ships)
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

        switch (type) {
            case "major":
                // Select ship to heal to full
                setShipSelectionOpen(true);
                break;

            case "field":
                // Heal all ships a little
                const repairedShips = gameState.run.ships.map(ship => ({
                    ...ship,
                    stats: {
                        ...ship.stats,
                        currentShield: Math.ceil(Math.min(ship.stats.currentShield + ship.stats.maxShield * 0.3, ship.stats.maxShield)),
                        currentArmor: Math.ceil(Math.min(ship.stats.currentArmor + ship.stats.maxArmor * 0.3, ship.stats.maxArmor)),
                        currentHull: Math.ceil(Math.min(ship.stats.currentHull + ship.stats.maxHull * 0.3, ship.stats.maxHull)),
                    }
                }));

                updateShips(repairedShips);

                setRepairUsed(true);
                break;

            default:
                break;
        }
    }

    function onConfirmFullRepair(shipToRepair) {
        setShipSelectionOpen(false);

        const repairedShips = gameState.run.ships.map(ship => {
            if (ship.id !== shipToRepair.id) {
                return ship;
            }

            return {
                ...ship,
                stats: {
                    ...ship.stats,
                    currentShield: Math.max(ship.stats.currentShield, ship.stats.maxShield),
                    currentArmor: Math.max(ship.stats.currentArmor, ship.stats.maxArmor),
                    currentHull: Math.max(ship.stats.currentHull, ship.stats.maxHull),
                }
            };
        });

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

                {!shipSelectionOpen && <RepairOption
                    title="FIELD REPAIR"
                    description="Repair all ships."
                    effect="+30% Shield/Armor/Hull"
                    onClick={() => onRepair("field")}
                    disabled={repairUsed}
                />}

                {!shipSelectionOpen && <RepairOption
                    title="MAJOR REPAIR"
                    description="Heavily repair one ship."
                    effect="100% Full repair"
                    onClick={() => onRepair("major")}
                    disabled={repairUsed}
                />}

                {/* <RepairOption
                    title="SHIELD RECALIBRATION"
                    description="Restore the shields of your entire fleet."
                    effect="Fully restore Shields"
                    onClick={() => onRepair("shield")}
                /> */}

                {!shipSelectionOpen && <button
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
                </button>}

                {shipSelectionOpen && <Selection
                    items={gameState.run.ships}
                    maxSelections={1}
                    title={"Select a ship to repair"}

                    renderMini={({
                        key,
                        item,
                        selected,
                        toggle,
                    }) => (
                        <MiniShipCard
                            key={key}
                            ship={item}
                            borderColor={
                                selected
                                    ? "2px solid #fcff4c"
                                    : "2px solid transparent"
                            }
                            onClick={toggle}
                        />
                    )}

                    onConfirm={(ships) => onConfirmFullRepair(ships[0])}
                />}

                {shipSelectionOpen && <button
                    style={{
                        background: "#0a1118",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "2px solid #243342",
                        textAlign: "center",
                        position: "fixed",
                        bottom: "70px",
                        width: "100%",
                        maxWidth: "374px",
                        height: "50px",
                    }}
                    onClick={() => setShipSelectionOpen(false)}>
                    Cancel
                </button>}

            </div>

        </div>
    );
}

export default RepairScreen;