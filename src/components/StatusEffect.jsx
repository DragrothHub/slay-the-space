const mechanicStyles = {
    mechanic: {
        color: "#facc15",
    },
};

export default function StatusEffect({
    effect,
    duration,
    isTargeted = false,
    isActive = false,
}) {
    const isMechanic = effect.category === "mechanic";

    if (!effect) {
        return null;
    }

    const size = isTargeted || isActive ? 10 : 8;

    // Für normale Debuffs weiterhin 3 als maximale Dauer.
    // Boss-Mechaniken können beliebige Timer haben.
    const baseDuration = effect.baseDuration ?? 3;

    const progress = Math.max(
        0,
        Math.min(1, duration / baseDuration)
    );

    const color = effect.color;

    return (
        <div
            title={`${effect.id} (${duration})`}
            style={{
                position: "relative",

                width: size,
                height: size,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                borderRadius: "50%",

                color: "#b4b4b4",

                boxShadow: `0 0 6px ${color}`,

                background: `
                    conic-gradient(
                        transparent 0deg ${(1 - progress) * 360}deg,
                        ${color} ${(1 - progress) * 360}deg 360deg
                    )
                `,

                border: `1px solid ${color}`,

                // Wichtig: Icon und Zahl dürfen außerhalb
                // des eigentlichen Kreises liegen.
                overflow: "visible",
            }}
        >
            {/* Optionales Hintergrund-Icon */}
            {effect.icon && (
                <div
                    style={{
                        position: "absolute",
                        inset: "-2px",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        fontSize: size * 0.9,

                        opacity: 0.18,

                        color: color,

                        pointerEvents: "none",

                        zIndex: 0,
                    }}
                >
                    {effect.icon}
                </div>
            )}

            {/* Countdown */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",

                    transform: "translateX(-50%)",

                    fontSize: "0.8em",

                    color: "#b4b4b4",

                    zIndex: 1,

                    whiteSpace: "nowrap",
                }}
            >
                {duration}
            </div>
        </div>
    );
}