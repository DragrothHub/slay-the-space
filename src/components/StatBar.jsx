export default function StatBar({
    label,
    value,
    max,
    color,
}) {

    const segments = Math.max(1, Math.round(max / 25));
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
                <span>{label}</span>
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