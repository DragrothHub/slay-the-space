import armor_icon_colored from "../images/armor_icon_colored.png";
import shield_icon_colored from "../images/shield_icon_colored.png";

export default function ModuleCard({ module }) {
    return (
        <div style={{
            background: "#0a1118",
            borderRadius: 10,
            padding: 12,
            minHeight: 60,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            border: "2px solid #243342",
        }}>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 15,
                    }}
                >
                    {module.displayName}
                </div>

                {module.defenceType === "armor" && <img src={armor_icon_colored} style={{ width: 18, height: 18, verticalAlign: "center" }} />}
                {module.defenceType === "shield" && <img src={shield_icon_colored} style={{ width: 18, height: 18, verticalAlign: "center" }} />}
                {module.defenceType === "mixed" && <div><img src={shield_icon_colored} style={{ width: 18, height: 18, verticalAlign: "center" }} /><img src={armor_icon_colored} style={{ width: 18, height: 18, verticalAlign: "center" }} /></div>}
            </div>

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    gap: 10,
                    fontSize: 12,
                    color: "#9cb7ca",
                }}
            >
                <span style={{ color: module.color }}>
                        {module.description}
                </span>
            </div>
        </div>
    );
}