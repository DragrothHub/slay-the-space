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
            border: "1px solid #243342",
        }}>
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
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
                {module.type === "shield" && (
                    <span style={{ color: "#63d8ff" }}>
                        Shield
                    </span>
                )}

                {module.type === "armor" && (
                    <span style={{ color: "#ffd45c" }}>
                        Armor
                    </span>
                )}
            </div>
        </div>
    );
}