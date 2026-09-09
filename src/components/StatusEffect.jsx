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

            {effect.icon && <img 
                src={effect.icon} 
                style={{
                    width: size + 2, 
                    position: "absolute", 
                    top: - size - 2 - 2,
                    filter: "brightness(0) saturate(100%) invert(72%) sepia(90%) saturate(1000%) hue-rotate(5deg)",
                    pointerEvents: "none",
                    verticalAlign: "center",
                }}
            />}

            {/* Countdown */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",

                    transform: "translateX(-50%)",

                    fontSize: "0.8em",

                    color: color, //"#b4b4b4",

                    zIndex: 1,

                    whiteSpace: "nowrap",
                }}
            >
                {duration}
            </div>
        </div>
    );
}