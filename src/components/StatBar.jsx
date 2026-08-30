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
    const percent = Math.min(100, (value / max) * 100);

    if (max == 0)
        return (<></>);

    return (
        <div style={{ width: "100%", }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                fontSize: 14,
                position: "relative",
            }}>
                <div>
                    {label === "Armor" && <img src={armor_icon} style={{width: 14, height: 14, verticalAlign: "center", marginRight: 4}}/>}
                    {label === "Shield" && <img src={shield_icon} style={{width: 14, height: 14, verticalAlign: "center", marginRight: 4}}/>}
                    {label === "Hull" && <img src={hull_icon} style={{width: 14, height: 14, verticalAlign: "center", marginRight: 4}}/>}
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
                <div
                    style={{
                        position: "absolute",
                        height: "100%",
                        borderRadius: 999,
                        transition: "width 0.5s",
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                />
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