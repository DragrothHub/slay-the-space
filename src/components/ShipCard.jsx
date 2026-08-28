import { RadarChart } from "./RadarChart";
import { shipClasses } from "../data/shipClasses";
import AbilityCard from "./AbilityCard";
import { abilityCollection } from "../data/abilities";
import { moduleCollection } from "../data/modules";
import ModuleCard from "./ModuleCard";
import ComboBox from "../selections/ComboBox";
import { useGameState } from "../state/GameStateProvider";
import StatBar from "./StatBar";
import DebuffCard from "./DebuffCard";

function ShipCard({
    ship,
    close,
    closeText,
    children,
    allowModuleChange,
    allowAbilityChange,
}) {

    const { gameState, changeModule, changeAbility } = useGameState();

    function onModuleChange(index, newModuleId) {
        changeModule({ ship: ship, index: index, newModuleId: newModuleId });
    }

    function onAbilityChange(index, newAbilityId) {
        changeAbility({ ship: ship, index: index, newAbilityId: newAbilityId });
    }

    return (
        <div style={{
            width: 370,
            background: "#111827",
            borderRadius: 16,
            overflow: "visible",
            color: "white",
            border: "1px solid #374151",
        }}>
            <div style={{
                width: "100%",
                height: 180,
                background: "#000",
                display: "flex",
                justifyContent: "center",
                borderRadius: 16,
            }}>
                <img
                    src={ship.image}
                    alt={ship.name}
                    style={{ height: "100%", }}
                />
            </div>

            <div style={{
                padding: 16,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}>

                <div style={{ marginBottom: 12, }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 22,
                    }}>
                        {ship.name || "Unnamed Ship"}
                    </h2>

                    <span style={{
                        color: "#9ca3af",
                        fontSize: 14,
                    }}>
                        {shipClasses[ship.class].displayName ||
                            "Unknown"}{" "}
                        Class • {ship.manufacturer}
                    </span>
                </div>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                }}>
                    <StatBar
                        label="Shield"
                        value={ship.stats.currentShield}
                        max={ship.stats.maxShield}
                        color="#3b82f6"
                    />

                    <StatBar
                        label="Armor"
                        value={ship.stats.currentArmor}
                        max={ship.stats.maxArmor}
                        color="#f59e0b"
                    />

                    <StatBar
                        label="Hull"
                        value={ship.stats.currentHull}
                        max={ship.stats.maxHull}
                        color="#ef4444"
                    />
                </div>


                <div style={{
                    margin: "0 auto",
                    marginTop: "10px",
                }}>
                    <RadarChart
                        attributes={ship.attributes}
                    />
                </div>


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
                    {ship.modules.map((moduleId, index) => {
                        const module = moduleCollection[moduleId];

                        const availableModules = gameState.inventory?.modules ?? [];

                        const possibleModules = [
                            ...availableModules,
                            moduleId
                        ].map(id => moduleCollection[id]);

                        const canChange = availableModules.length > 0;

                        if (!allowModuleChange || !canChange) {
                            return (
                                <ModuleCard
                                    key={index + moduleId}
                                    module={module}
                                />
                            );
                        }

                        return (
                            <ComboBox
                                key={module.id + "_" + index}

                                items={possibleModules}

                                value={module.id}

                                onChange={newModule =>
                                    onModuleChange?.(
                                        index,
                                        newModule.id
                                    )
                                }

                                renderItem={module => (
                                    <ModuleCard
                                        module={module}
                                    />
                                )}
                            />
                        );
                    })}
                </div>


                <span
                    style={{
                        margin: "10px auto 4px auto",
                    }}
                >
                    Abilities
                </span>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 4,
                    }}
                >
                    {ship.abilities.map((abilityId, index) => {
                        const ability = abilityCollection[abilityId];

                        const availableAbilities =
                            index === 0
                                ? gameState?.inventory?.neutralAbilities ?? []
                                : index === 1
                                    ? gameState?.inventory?.primerAbilities ?? []
                                    : gameState?.inventory?.detonatorAbilities ?? [];

                        const possibleAbilities = [
                            ...availableAbilities,
                            abilityId
                        ].map(id => abilityCollection[id]);

                        const canChange = availableAbilities.length > 0;

                        if (!allowAbilityChange || !canChange) {
                            return (
                                <AbilityCard
                                    key={ability.id + "_" + index}
                                    abilityId={ability.id}
                                />
                            );
                        }

                        return (
                            <ComboBox
                                key={ability.id + "_" + index}

                                items={possibleAbilities}

                                value={ability.id}

                                onChange={newAbility =>
                                    onAbilityChange?.(
                                        index,
                                        newAbility.id
                                    )
                                }

                                renderItem={ability => (
                                    <AbilityCard
                                        abilityId={ability.id}
                                    />
                                )}
                            />
                        );
                    })}
                </div>

                {ship.stats.debuffs.length > 0 && <span
                    style={{
                        margin: "10px auto 4px auto",
                    }}
                >
                    Debuffs
                </span>}

                {ship.stats.debuffs.length > 0 && <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 4,
                    }}
                >
                    {ship.stats.debuffs.map((debuff, index) => (
                        <DebuffCard
                            key={debuff.id+"_"+index}
                            debuffId={debuff.id}
                            duration={debuff.duration}
                        />
                    ))}
                </div>}


                <div style={{ marginTop: "20px", }}>
                    {children}

                    <div
                        style={{
                            background: "#0a1118",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "2px solid #243342",
                            textAlign: "center",
                        }}
                        onClick={() => close()}
                    >
                        {closeText}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ShipCard;