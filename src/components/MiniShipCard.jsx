import StatBar from "./StatBar";
import { shipClasses } from "../data/shipClasses";
import { moduleCollection } from "../data/modules";
import { abilityCollection } from "../data/abilities";
import { debuffs } from "../engine/debuffs";

export default function MiniShipCard({ ship, borderColor, backgroundColor, onClick }) {
    return (
        <div
            key={ship.id}
            onClick={onClick}
            style={{
                border: borderColor
                    ? borderColor
                    : "2px solid transparent",
                borderRadius: "10px",
                maxWidth: 370,
                width: "100%",
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

                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                {<span style={{ color: `${moduleCollection[id].color}` }}>{moduleCollection[id].displayName}</span>}
                                <div style={{width: 5, height: 5, borderRadius: 5, background: moduleCollection[id].defenceTypeColor}}></div>
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