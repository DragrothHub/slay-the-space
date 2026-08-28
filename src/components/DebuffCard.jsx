import { debuffs } from "../engine/debuffs";

export default function DebuffCard({ debuffId, duration }) {

    const debuff = debuffs[debuffId];

    console.log(debuff, debuffId, duration);

    return (
        <div
            style={{
                background: "#0a1118",
                borderRadius: 10,
                padding: 12,
                minHeight: 60,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                border: "2px solid #243342",
            }}
        >
            <div
                style={{
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
                    {debuff.displayName}
                </div>

                <div
                    style={{
                        width: 10,
                        height: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "0.8em",
                        borderRadius: "50%",
                        color: "#b4b4b4",
                        boxShadow: `0 0 6px ${debuff.color ?? "#fff"}`,
                        background: "conic-gradient(transparent 0deg " + 120 * (3 - duration) + "deg, " + debuff.color + " 0deg 360deg)",
                        border: "1px solid" + debuff.color,
                    }}
                >
                    <div style={{ position: "relative", top: "12px", left: "0px" }}>{duration}</div>
                </div>
            </div>

            <div
                style={{
                    fontSize: 12,
                    color: "#9cb7ca",
                }}
            >
                <span style={{ color: debuff.color }}>
                    {debuff.description}
                </span>
            </div>
        </div>
    );
}