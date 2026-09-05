export default function MechanicAura({color = "#facc15"}) {
    return (
        <>
            <style>{`
                .mechanicAura {
                    position: absolute;
                    inset: 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    pointer-events: none;

                    color: ${color};

                    overflow: visible;
                }
                
                /* =====================================================
                   BIG EXPLOSION RINGS
                   ===================================================== */

                .ring {
                    position: absolute;

                    width: 250%;
                    height: 250%;

                    border: 4px solid currentColor;
                    border-radius: 50%;

                    opacity: 0;
                }

                .ring1 {
                    animation:
                        detonation-ring-big
                        420ms
                        cubic-bezier(0.05, 0.8, 0.15, 1)
                        forwards;
                }

                .ring2 {
                    animation:
                        detonation-ring-big
                        440ms
                        cubic-bezier(0.05, 0.8, 0.15, 1)
                        65ms
                        forwards;
                }

                @keyframes detonation-ring-big {
                    0% {
                        opacity: 0;
                        transform: scale(0.08);
                    }

                    8% {
                        opacity: 1;
                    }

                    35% {
                        opacity: 1;
                        transform: scale(0.65);
                    }

                    72% {
                        opacity: 0.7;
                        transform: scale(1.12);
                    }

                    84% {
                        opacity: 0.45;
                        transform: scale(1.02);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.25);
                    }
                }`}</style>

            <div className="mechanicAura">
                {/* Large expanding rings */}
                <div className="ring ring1" />
                <div className="ring ring2" />
            </div>
        </>);
}