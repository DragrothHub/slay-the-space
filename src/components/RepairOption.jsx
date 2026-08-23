function RepairOption({
    title,
    description,
    effect,
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            style={{
                textAlign: "left",
                background: "#0a1118",
                borderRadius: 10,
                padding: 12,
                border: "1px solid #243342",
                color: "#fff",
            }}
        >
            <div
                style={{
                    color: "#9cb7ca",
                    fontSize: "17px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
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