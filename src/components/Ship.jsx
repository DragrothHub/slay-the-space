import { useEffect, useState } from "react";
import { debuffs } from "../engine/debuffs";
import "./Ship.css";

export default function Ship({
    unit,
    damageEvents = [],
    isActive,
    isTargeted,
    isDead,
    onClick,
    mode = "image",
    reverse = false,
}) {
    const [damageFlash, setDamageFlash] = useState(null);
    const [lastEventTime, setLastEventTime] = useState(null);

    useEffect(() => {
        const event = damageEvents.find(
            e => e.targetId === unit.id && e.timestamp > lastEventTime
        );

        if (!event) return;

        setDamageFlash(event.amount);
        setLastEventTime(event.timestamp);

        const t = setTimeout(() => {
            setDamageFlash(null);
        }, 500);

        return () => clearTimeout(t);
    }, [damageEvents]);

    const borderColor = isDead
        ? "darkred"
        : isActive
            ? "#9ecbff"
            : isTargeted
                ? "#ef4444"
                : "transparent";

    const activeDebuffs = unit.stats?.debuffs ?? [];

    if (mode === "image") {
        return (
            <div
                style={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 12,
                    opacity: isDead ? 0.35 : 1,
                    position: "relative",
                }}
                onClick={onClick}
            >
                <div>
                    <StatBarSmall
                        bigger={isTargeted || isActive}
                        value={unit.stats?.currentShield ?? 0}
                        max={Math.max(
                                unit.stats?.maxShield ?? 0,
                                unit.stats?.currentShield ?? 0
                            )}
                        color="#3b82f6"
                    />

                    <StatBarSmall
                        bigger={isTargeted || isActive}
                        value={unit.stats?.currentArmor ?? 0}
                        max={Math.max(
                                unit.stats?.maxArmor ?? 0,
                                unit.stats?.currentArmor ?? 0
                            )}
                        color="#f59e0b"
                    />

                    <StatBarSmall
                        bigger={isTargeted || isActive}
                        value={unit.stats?.currentHull ?? 0}
                        max={Math.max(
                                unit.stats?.maxHull ?? 0,
                                unit.stats?.currentHull ?? 0
                            )}
                        color="#ef4444"
                    />

                    <div style={{
                        transition: "width 0.2s, left 0.2s, top 0.2s, font-size 0.4s",
                        width: isTargeted || isActive ? 60 : 30,
                        marginTop: 0,
                        color: isTargeted ? "#ef4444" : isActive ? "rgb(158, 203, 255)" : "black",
                        position: "relative",
                        left: isTargeted || isActive ? 60 : 30,
                        top: isTargeted || isActive ? 45 : 30,
                        zIndex: 1,
                        fontSize: isTargeted || isActive ? "1em" : "0.0em",
                    }}>{unit.name}</div>

                    {damageFlash && (
                        <div
                            style={{
                                position: "absolute",
                                top: 40,
                                color: "#ef4444",
                                fontWeight: "bold",
                                fontSize: 18,
                                animation: "floatUp 2.5s ease-out",
                                pointerEvents: "none",
                            }}
                        >
                            -{damageFlash}
                        </div>
                    )}

                </div>

                <div
                    style={{
                        position: "relative",
                        width: isTargeted || isActive ? 140 : 60,
                        height: isTargeted || isActive ? 140 : 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        transition: "width 0.25s ease, height 0.25s ease",
                    }}
                >
                    {(isTargeted || isActive) && (
                        <div
                            className="targetRingInner"
                            style={{
                                position: `absolute`,
                                borderLeft: `2px solid ${borderColor}`,
                                borderRight: `2px solid ${borderColor}`,
                                borderTop: "2px solid transparent",
                                borderBottom: "2px solid transparent",
                                animation: `rotateTargetReverse 10s linear infinite`,
                                inset: 30,
                                opacity: 0.6,
                                pointerEvents: `none`,
                                borderRadius: `50%`,
                            }}
                        />
                    )}

                    {(isTargeted || isActive) && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 22,

                                border: `2px solid ${borderColor}`,
                                borderRadius: "50%",

                                opacity: 0.6,

                                animation: "rotateTarget 8s linear infinite",

                                clipPath: `
                                    polygon(
                                        0% 20%,
                                        20% 20%,
                                        20% 0%,

                                        80% 0%,
                                        80% 20%,
                                        100% 20%,

                                        100% 80%,
                                        80% 80%,
                                        80% 100%,

                                        20% 100%,
                                        20% 80%,
                                        0% 80%
                                    )
                                `,
                            }}
                        />
                    )}

                    <img
                        src={unit.image}
                        style={{
                            width: isTargeted || isActive ? "140px" : "60px",

                            transform: reverse
                                ? "rotate(180deg)"
                                : "rotate(0deg)",

                            opacity: isTargeted || isActive ? 1 : 0.8,

                            transition: `
                                width 0.25s ease,
                                opacity 0.25s ease,
                                filter 0.25s ease
                            `,
                        }}
                    />

                    {/* Debuff Indicators */}
                    {activeDebuffs.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: isTargeted || isActive ? -10 : -20,
                                display: "flex",
                                gap: 4,
                                borderRadius: 999,
                            }}
                        >
                            {activeDebuffs.map((debuff, index) => (
                                <div
                                    key={`${debuff.id}-${index}`}
                                    title={`${debuff.id} (${debuff.duration})`}
                                    style={{
                                        width: isTargeted || isActive ? 10 : 8,
                                        height: isTargeted || isActive ? 10 : 8,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "0.8em",
                                        borderRadius: "50%",
                                        color: "#b4b4b4",
                                        boxShadow: `
                                            0 0 6px ${
                                                debuffs[debuff.id].color ?? "#fff"
                                            }
                                        `,
                                        background: "conic-gradient(transparent 0deg " + 120 * (3 - debuff.duration) + "deg, " + debuffs[debuff.id].color + " 0deg 360deg)",
                                        border: "1px solid" + debuffs[debuff.id].color,
                                    }}
                                >
                                    <div style={{ position: "relative", top: "12px", left: "0px" }}>{debuff.duration}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                width: 140,
                opacity: isDead ? 0.4 : 1,
                fontSize: 12,
                border: `2px solid ${borderColor}`,
                borderRadius: 12,
                padding: 4,
            }}
            onClick={onClick}
        >
            <div
                style={{
                    marginBottom: 4,
                    textAlign: "center",
                }}
            >
                {unit.name || "Unnamed"}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 6,
                    minHeight: 10,
                }}
            >
                {activeDebuffs.map((debuff, index) => (
                    <div
                        key={`${debuff.id}-${index}`}
                        title={`${debuff.id} (${debuff.duration})`}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                                debuffColors[debuff.id] ?? "#ffffff",
                        }}
                    />
                ))}
            </div>

            <StatBar
                label="Shield"
                value={unit.stats?.currentShield ?? 0}
                max={unit.stats?.maxShield ?? 0}
                color="#3b82f6"
            />

            <StatBar
                label="Armor"
                value={unit.stats?.currentArmor ?? 0}
                max={unit.stats?.maxArmor ?? 0}
                color="#f59e0b"
            />

            <StatBar
                label="Hull"
                value={unit.stats?.currentHull ?? 0}
                max={unit.stats?.maxHull ?? 0}
                color="#ef4444"
            />
        </div>
    );
}

function StatBarSmall({
    label,
    value,
    max,
    color,
    bigger,
}) {
    if (max <= 0)
        return null;

    const percent = (value / max) * 100;

    return (
        <div
            style={{
                transition: "width 0.2s, left 0.2s, top 0.2s",
                width: bigger ? 60 : 30,
                marginBottom: 2,
                position: "relative",
                left: bigger ? 60 : 30,
                top: bigger ? 40 : 30,
                zIndex: 1,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: bigger ? 4 : 2,
                    background: "#222",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: color,
                        transition: "width 0.2s",
                    }}
                />
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
    if (max <= 0)
        return null;

    const percent = (value / max) * 100;

    return (
        <div style={{ marginBottom: 4 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                }}
            >
                <span>{label}</span>
                <span>
                    {value}/{max}
                </span>
            </div>

            <div
                style={{
                    width: "100%",
                    height: 6,
                    background: "#222",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: color,
                        transition: "width 0.2s",
                    }}
                />
            </div>
        </div>
    );
}