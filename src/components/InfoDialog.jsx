export default function InfoDialog({
    open,
    title,
    onClose,
    width = 500,
    children,
}) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.65)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                padding: 20,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width,
                    maxWidth: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",

                    background: "#111922",
                    border: "2px solid #33485d",
                    borderRadius: 12,

                    boxShadow: "0 0 24px rgba(0,0,0,.4)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",

                        padding: "16px 20px",
                        borderBottom: "1px solid #2d4357",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize: 22,
                        }}
                    >
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            fontSize: 24,
                            color: "#88a4bf",
                            padding: 4,
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div
                    style={{
                        padding: 20,
                        color: "#d7e5ef",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}