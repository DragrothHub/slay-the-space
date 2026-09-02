export default function Detonation({ color = "#ff4444" }) {
    return (
        <>
            <style>{`
                .detonation {
                    position: absolute;
                    inset: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    pointer-events: none;

                    color: ${color};
                }

                /* ─────────────────────────────────────────
                   Explosion rings
                   ───────────────────────────────────────── */

                .detonation__ring {
                    position: absolute;

                    width: 100%;
                    height: 100%;

                    border: 2px solid currentColor;
                    border-radius: 50%;

                    opacity: 0;
                }

                .detonation__ring--1 {
                    animation:
                        detonation-ring 300ms
                        cubic-bezier(0.15, 0.8, 0.25, 1)
                        forwards;
                }

                .detonation__ring--2 {
                    animation:
                        detonation-ring 300ms
                        cubic-bezier(0.15, 0.8, 0.25, 1)
                        100ms
                        forwards;
                }

                /* ─────────────────────────────────────────
                   Animations
                   ───────────────────────────────────────── */

                @keyframes detonation-ring {
                    0% {
                        opacity: 1;
                        transform: scale(0.2);
                    }

                    55% {
                        opacity: 1;
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1);
                    }
                }
            `}</style>

            <div className="detonation">
                <div className="detonation__ring detonation__ring--1" />
                <div className="detonation__ring detonation__ring--2" />
            </div>
        </>
    );
}