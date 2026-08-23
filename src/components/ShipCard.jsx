import { RadarChart } from "./RadarChart";
import { shipClasses } from "../data/shipClasses";
import AbilityCard from "./AbilityCard";
import { abilityCollection, detonatorAbilityCollection, neutralAbilityCollection, primerAbilityCollection } from "../data/abilities";
import { moduleCollection } from "../data/modules";
import ModuleCard from "./ModuleCard";
import { debuffs } from "../engine/debuffs";
import Selection from "../selections/Selection";
import ComboBox from "../selections/ComboBox";
import { useGameState } from "../state/GameStateProvider";


function ShipCard({
    ship,
    close,
    closeText,
    children,
    allowModuleChange,
    allowAbilityChange,
}) {

    const { gameState, updateShips, changeModule, changeAbility } = useGameState();

    function onModuleChange(index, newModuleId){
        changeModule({ship: ship, index: index, newModuleId: newModuleId});
    }

    function onAbilityChange(index, newAbilityId){
        changeAbility({ship: ship, index: index, newAbilityId: newAbilityId});
    }

    return (
        <div style={styles.card}>
            <div style={styles.imageWrapper}>
                <img
                    src={ship.image}
                    alt={ship.name}
                    style={styles.image}
                />
            </div>

            <div style={styles.content}>

                <div style={styles.header}>
                    <h2 style={styles.name}>
                        {ship.name || "Unnamed Ship"}
                    </h2>

                    <span style={styles.class}>
                        {shipClasses[ship.class].displayName ||
                            "Unknown"}{" "}
                        Class • {ship.manufacturer}
                    </span>
                </div>


                <div style={styles.stats}>
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


                <div style={styles.radarChart}>
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


                <div style={styles.buttonContainer}>
                    {children}

                    <div
                        style={styles.backButton}
                        onClick={() => close()}
                    >
                        {closeText}
                    </div>
                </div>

            </div>
        </div>
    );
}

export function MiniShipCard({ ship, borderColor, backgroundColor, onClick }) {
    return (
        <div
            key={ship.id}
            onClick={onClick}
            style={{
                border: borderColor
                    ? borderColor
                    : "2px solid transparent",
                borderRadius: "10px",
                maxWidth: 390,
                minWidth: 370,
            }}
        >
            <div
                style={{
                    background: backgroundColor ? backgroundColor : "#111827",
                    border: "1px solid #374151",
                    borderRadius: 12,
                    overflow: "hidden",
                    color: "white",
                    display: "flex",
                    gap: 10,
                    padding: 10,
                }}
            >
                <img
                    src={ship.image}
                    alt={ship.name}
                    style={{
                        width: 80,
                        height: 60,
                        objectFit: "contain",
                        flexShrink: 0,
                        margin: "auto",
                    }}
                />

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        minWidth: 0,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {ship.name}
                        </div>

                        <div
                            style={{
                                fontSize: 11,
                                color: "#9ca3af",
                            }}
                        >
                            {shipClasses[ship.class].displayName} • {ship.manufacturer}
                        </div>
                    </div>

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

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                        }}
                    >
                        {ship.modules.map((id, index) => (
                            <span
                                key={id + "_" + index}
                                style={{
                                    flex: "1 1 60px",
                                    textAlign: "center",
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 999,
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                }}
                            >
                                {<span style={{ color: `${moduleCollection[id].color}` }}>{moduleCollection[id].displayName}</span>}
                            </span>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                        }}
                    >
                        {ship.abilities.map(id => (
                            <span
                                key={id}
                                style={{
                                    flex: "1 1 60px",
                                    textAlign: "center",
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 999,
                                    background: "#1f2937",
                                    border: "1px solid #374151",
                                }}
                            >
                                {abilityCollection[id].primer || abilityCollection[id].detonator ? "" : abilityCollection[id].displayName}
                                {abilityCollection[id].primer && <span style={{ color: `${debuffs[abilityCollection[id].appliesDebuff].color}` }}>{abilityCollection[id].displayName}</span>}
                                {abilityCollection[id].detonator && <span style={{ color: `${debuffs[abilityCollection[id].detonatesDebuff].color}` }}>{abilityCollection[id].displayName}</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBar({
    label,
    value,
    max,
    color,
}) {
    const percent = (value / max) * 100;

    if (max == 0)
        return (<></>
            // <div
            //     style={{
            //         height: 20, // gleiche Höhe wie eine normale StatBar
            //     }}
            // />
        );

    return (
        <div style={styles.statRow}>
            <div style={styles.statHeader}>
                <span>{label}</span>
                <span>
                    {value}/{max}
                </span>
            </div>

            <div style={styles.barBackground}>
                <div
                    style={{
                        ...styles.barFill,
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
}

export default ShipCard;

const styles = {
    card: {
        width: 370,
        background: "#111827",
        borderRadius: 16,
        overflow: "visible",
        color: "white",
        border: "1px solid #374151",
        // fontFamily: "Arial",
    },

    imageWrapper: {
        width: "100%",
        height: 180,
        background: "#000",
        display: "flex",
        justifyContent: "center",
    },

    image: {
        height: "100%",
    },

    content: {
        padding: 16,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },

    header: {
        marginBottom: 12,
    },

    name: {
        margin: 0,
        fontSize: 22,
    },

    class: {
        color: "#9ca3af",
        fontSize: 14,
    },

    weapon: {
        marginBottom: 16,
        color: "#d1d5db",
    },

    stats: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    statRow: {
        width: "100%",
    },

    statHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 4,
        fontSize: 14,
    },

    barBackground: {
        width: "100%",
        height: 12,
        background: "#374151",
        borderRadius: 999,
        overflow: "hidden",
    },

    barFill: {
        height: "100%",
        borderRadius: 999,
        transition: "width 0.2s",
    },

    radarChart: {
        margin: "0 auto",
        marginTop: "10px",
    },

    backButton: {
        background: "#0a1118",
        padding: "10px",
        borderRadius: "10px",
        border: "2px solid #243342",
        textAlign: "center",
    },

    buttonContainer: {
        marginTop: "20px",
    }
};