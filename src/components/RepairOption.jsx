function RepairOption({
    title,
    description,
    effect,
    onClick,
    disabled,
}) {
    return (
        <button
            onClick={onClick}
            style={{
                textAlign: "left",
                background: disabled ? "#222" : "#0a1118",
                borderRadius: 10,
                padding: 12,
                border: disabled ? "1px solid #333" : "1px solid #243342",
                color: disabled ? "#555" : "#fff",
            }}
            disabled={disabled}
        >
            <div
                style={{
                    color: disabled ? "#666" : "#9cb7ca",
                    fontSize: "17px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    marginTop: "8px",
                    opacity: 0.65,
                }}
            >
                {description}
            </div>

            <div
                style={{
                    marginTop: "12px",
                    opacity: 0.9,
                }}
            >
                {effect}
            </div>
        </button>
    );
}

export default RepairOption;