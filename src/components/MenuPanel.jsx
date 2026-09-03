import { useState } from "react";
import ShipSelection from "../selections/ShipSelection";
import InventoryScreen from "./InventoryScreen";
import { useGameState } from "../state/GameStateProvider";


export default function MenuPanel() {
    const { gameState } = useGameState();

    const isBattle = !!gameState.run.battle;

    const [activeTab, setActiveTab] = useState(
        isBattle ? "team" : "ships"
    );

    const tabs = isBattle
        ? [
            { id: "team", label: "Your Team" },
            { id: "enemy", label: "Enemy Team" },
        ]
        : [
            { id: "ships", label: "Ships" },
            { id: "inventory", label: "Inventory" },
        ];

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
                    flexDirection: "column",

                    paddingTop: "45px",
                    paddingBottom: "30px",
                    boxSizing: "border-box",
                }}
            >
                {/* Tabs */}
                <div
                    style={{
                        display: "flex",
                        margin: "0 12px 20px",
                        borderBottom: "1px solid #374151",
                    }}
                >
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    border: "none",
                                    borderBottom: active
                                        ? "2px solid #fff"
                                        : "2px solid transparent",
                                    background: "transparent",
                                    color: active
                                        ? "#ffffff"
                                        : "#546791",
                                    fontWeight: active ? "bold" : "normal",
                                    transition: "color 0.15s ease",
                                    fontSize: "1.5em",
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>


                {/* Normal menu */}
                {!isBattle && activeTab === "ships" && (
                    <ShipSelection
                        ships={gameState.run.ships}
                        title="Your Team"
                        maxSelections={0}
                        allowModuleChange={true}
                        allowAbilityChange={true}
                    />
                )}

                {!isBattle && activeTab === "inventory" && (
                   <InventoryScreen />
                )}


                {/* Battle menu */}
                {isBattle && activeTab === "team" && (
                    <ShipSelection
                        ships={gameState.run.battle.teams.A}
                        title="Your Team"
                        maxSelections={0}
                    />
                )}

                {isBattle && activeTab === "enemy" && (
                    <ShipSelection
                        ships={gameState.run.battle.teams.B}
                        title="Enemy Team"
                        maxSelections={0}
                    />
                )}
            </div>
        </div>
    );
}