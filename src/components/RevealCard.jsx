import { useState } from "react";

export default function RevealCard({
    children,
    backContent,
}) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div
            onClick={() => setRevealed(true)}
            style={{
                maxWidth: 370,
                perspective: 1000,
                cursor: revealed ? "default" : "pointer",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    transformStyle: "preserve-3d",
                    transition:
                        "transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                    transform: revealed
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                }}
            >
                <div
                    style={{
                        visibility: "hidden",
                        pointerEvents: "none",
                    }}
                >
                    {children}
                </div>

                {/* Rückseite */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `
                            repeating-linear-gradient(
                                45deg,
                                transparent 0px,
                                transparent 5px,
                                #1e3245 5px,
                                #101b25 8px
                            ),
                            #0f1521
                        `,
                        borderRadius: 10,
                        border: "2px solid #243342",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    {backContent ?? (
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 8,
                                border: "2px solid #34495a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#668093",
                                fontSize: 22,
                                fontWeight: 700,
                            }}
                        >
                            ?
                        </div>
                    )}
                </div>

                {/* Vorderseite */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,

                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",

                        transform: "rotateY(180deg)",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}