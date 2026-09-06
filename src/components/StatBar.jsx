import armor_icon from "../images/armor_icon.png";
import shield_icon from "../images/shield_icon.png";
import hull_icon from "../images/hull_icon.png";

export default function StatBar({
    label,
    value,
    max,
    color,
}) {

    const segments = Math.max(1, Math.round(max / 50));

    // Normaler Balken: maximal 100 %
    const percent = Math.min(100, (value / max) * 100);

    // Overshield:
    // 0 bei value <= max
    // 100 bei value >= max * 2
    const overshieldPercent = Math.min(
        100,
        Math.max(0, ((value - max) / max) * 100)
    );

    if (max == 0)
        return (<></>);

    return (
        <div style={{ width: "100%" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                fontSize: 14,
                position: "relative",
            }}>
                <div>
                    {label === "Armor" && (
                        <img
                            src={armor_icon}
                            style={{
                                width: 14,
                                height: 14,
                                verticalAlign: "center",
                                marginRight: 4
                            }}
                        />
                    )}

                    {label === "Shield" && (
                        <img
                            src={shield_icon}
                            style={{
                                width: 14,
                                height: 14,
                                verticalAlign: "center",
                                marginRight: 4
                            }}
                        />
                    )}

                    {label === "Hull" && (
                        <img
                            src={hull_icon}
                            style={{
                                width: 14,
                                height: 14,
                                verticalAlign: "center",
                                marginRight: 4
                            }}
                        />
                    )}

                    <span>{label}</span>
                </div>

                <span>
                    {value}/{max}
                </span>
            </div>

            <div style={{
                width: "100%",
                height: 12,
                background: "#374151",
                borderRadius: 999,
                overflow: "hidden",
                position: "relative",
            }}>

                {/* Normaler Balken */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        borderRadius: 999,
                        transition: "width 0.5s",
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                />

                {/* Overshield-Overlay */}
                {overshieldPercent > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            borderRadius: 999,
                            transition: "width 0.5s",
                            width: `${overshieldPercent}%`,
                            background: "rgba(255, 255, 255, 0.5)",
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Segment-Trennlinien */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                    }}
                >
                    {Array.from({ length: segments - 1 }).map((_, index) => {
                        const position = ((index + 1) / segments) * 100;

                        return (
                            <div
                                key={index}
                                style={{
                                    position: "absolute",
                                    left: `${position}%`,
                                    top: 0,
                                    bottom: 0,
                                    width: 2,
                                    transform: "translateX(-50%)",
                                    background: "rgba(0, 0, 0, 0.8)",
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}