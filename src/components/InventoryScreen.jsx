import { useGameState } from "../state/GameStateProvider";
import { moduleCollection } from "../data/modules";
import ModuleCard from "./ModuleCard";
import AbilityCard from "./AbilityCard";

export default function InventoryScreen() {

    const { gameState } = useGameState();

    return (
        <div style={{
                padding: 16,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
        }}>
            <span
                style={{
                    margin: "10px auto 4px auto",
                }}
            >
                Modules
            </span>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 4,
                }}
            >
                {gameState.inventory.modules.map((moduleId, index) => (
                    <ModuleCard
                        key={index + moduleId}
                        module={moduleCollection[moduleId]}
                    />
                ))}
            </div>

            <span
                style={{
                    margin: "10px auto 4px auto",
                }}
            >
                Primers
            </span>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 4,
                }}
            >
                {gameState.inventory.primerAbilities.map((abilityId, index) => (
                    <AbilityCard
                        key={abilityId + "_" + index}
                        abilityId={abilityId}
                    />
                ))}
            </div>

            <span
                style={{
                    margin: "10px auto 4px auto",
                }}
            >
                Detonators
            </span>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 4,
                }}
            >
                {gameState.inventory.detonatorAbilities.map((abilityId, index) => (
                    <AbilityCard
                        key={abilityId + "_" + index}
                        abilityId={abilityId}
                    />
                ))}
            </div>
        </div>
    );
}