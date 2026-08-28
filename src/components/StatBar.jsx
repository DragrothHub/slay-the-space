export default function StatBar({
    label,
    value,
    max,
    color,
}) {
    const percent = (value / max) * 100;

    if (max == 0)
        return (<></>);

    return (
        <div style={{ width: "100%", }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                fontSize: 14,
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
            }}>
                <div
                    style={{
                        height: "100%",
                        borderRadius: 999,
                        transition: "width 0.5s",
                        width: `${percent}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
        </div>
    );
}