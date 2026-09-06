export default function StatBarSmall({
    value,
    max,
    color,
    bigger,
}) {
    if (max <= 0)
        return null;

    const width = bigger ? 60 : 30;
    const height = bigger ? 4 : 2;

    const segments = Math.max(1, Math.round(max / 50));
    const percent = Math.min(100, (value / max) * 100);

    // Overshield:
    // 0 bei value <= max
    // 100 bei value >= max * 2
    const overshieldPercent = Math.min(
        100,
        Math.max(0, ((value - max) / max) * 100)
    );

    return (
        <div
            style={{
                transition: "width 0.2s, left 0.2s, top 0.2s",
                width,
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
                    height,
                    background: "#222",
                    borderRadius: 999,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${percent}%`,
                        background: color,
                        transition: "width 0.2s",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${overshieldPercent}%`,
                        background: "rgba(255, 255, 255, 0.5)",
                        transition: "width 0.2s",
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