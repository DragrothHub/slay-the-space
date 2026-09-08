import { debuffs } from "../engine/debuffs";
import StatusEffect from "./StatusEffect";

export default function DebuffCard({ debuffId, duration }) {

    const debuff = debuffs[debuffId];

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

                <StatusEffect
                    effect={debuff}
                    duration={duration}
                    isTargeted={false}
                    isActive={false} />
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