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
                   Central impact
                   ───────────────────────────────────────── */

                .detonation__impact {
                    position: absolute;

                    width: 14%;
                    height: 14%;

                    border-radius: 50%;
                    background: currentColor;

                    opacity: 0;

                    animation:
                        detonation-impact
                        220ms
                        cubic-bezier(0.15, 0.8, 0.25, 1)
                        forwards;
                }


                /* ─────────────────────────────────────────
                   Explosion rings
                   ───────────────────────────────────────── */

                .detonation__ring {
                    position: absolute;

                    width: 200%;
                    height: 200%;

                    border: 2px solid currentColor;
                    border-radius: 50%;

                    opacity: 0;

                    transform: scale(0.1);
                }

                .detonation__ring--1 {
                    animation:
                        detonation-ring-1
                        320ms
                        cubic-bezier(0.08, 0.85, 0.2, 1)
                        forwards;
                }

                .detonation__ring--2 {
                    animation:
                        detonation-ring-2
                        340ms
                        cubic-bezier(0.08, 0.85, 0.2, 1)
                        55ms
                        forwards;
                }


                /* ─────────────────────────────────────────
                   Cross / energy burst
                   ───────────────────────────────────────── */

                .detonation__cross {
                    position: absolute;

                    width: 70%;
                    height: 70%;

                    opacity: 0;

                    transform:
                        rotate(0deg)
                        scale(0.15);
                    
                    animation:
                        detonation-cross
                        280ms
                        cubic-bezier(0.1, 0.85, 0.2, 1)
                        20ms
                        forwards;
                }

                .detonation__cross span {
                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 100%;
                    height: 2px;

                    background: currentColor;

                    transform: translate(-50%, -50%);
                }

                .detonation__cross span:nth-child(2) {
                    transform:
                        translate(-50%, -50%)
                        rotate(90deg);
                }


                /* ─────────────────────────────────────────
                   Small secondary burst lines
                   ───────────────────────────────────────── */

                .detonation__burst {
                    position: absolute;

                    width: 100%;
                    height: 100%;

                    opacity: 0;

                    animation:
                        detonation-burst
                        260ms
                        cubic-bezier(0.1, 0.8, 0.2, 1)
                        35ms
                        forwards;
                }

                .detonation__burst span {
                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 42%;
                    height: 2px;

                    background: currentColor;

                    transform-origin: 0 50%;
                }

                .detonation__burst span:nth-child(1) {
                    transform: rotate(0deg) translateX(18%);
                }

                .detonation__burst span:nth-child(2) {
                    transform: rotate(45deg) translateX(18%);
                }

                .detonation__burst span:nth-child(3) {
                    transform: rotate(90deg) translateX(18%);
                }

                .detonation__burst span:nth-child(4) {
                    transform: rotate(135deg) translateX(18%);
                }

                .detonation__burst span:nth-child(5) {
                    transform: rotate(180deg) translateX(18%);
                }

                .detonation__burst span:nth-child(6) {
                    transform: rotate(225deg) translateX(18%);
                }

                .detonation__burst span:nth-child(7) {
                    transform: rotate(270deg) translateX(18%);
                }

                .detonation__burst span:nth-child(8) {
                    transform: rotate(315deg) translateX(18%);
                }


                /* ─────────────────────────────────────────
                   Animations
                   ───────────────────────────────────────── */

                @keyframes detonation-impact {
                    0% {
                        opacity: 0;
                        transform: scale(0.2);
                    }

                    15% {
                        opacity: 1;
                        transform: scale(1.8);
                    }

                    35% {
                        opacity: 1;
                        transform: scale(1);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }


                @keyframes detonation-ring-1 {
                    0% {
                        opacity: 1;
                        transform: scale(0.08);
                    }

                    18% {
                        opacity: 1;
                        transform: scale(0.38);
                    }

                    42% {
                        opacity: 0.9;
                        transform: scale(0.62);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.08);
                    }
                }


                @keyframes detonation-ring-2 {
                    0% {
                        opacity: 0;
                        transform: scale(0.08);
                    }

                    12% {
                        opacity: 1;
                        transform: scale(0.25);
                    }

                    35% {
                        opacity: 0.95;
                        transform: scale(0.55);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.15);
                    }
                }


                @keyframes detonation-cross {
                    0% {
                        opacity: 0;
                        transform:
                            rotate(0deg)
                            scale(0.15);
                    }

                    15% {
                        opacity: 1;
                        transform:
                            rotate(18deg)
                            scale(0.55);
                    }

                    45% {
                        opacity: 0.9;
                        transform:
                            rotate(55deg)
                            scale(0.9);
                    }

                    100% {
                        opacity: 0;
                        transform:
                            rotate(90deg)
                            scale(1.3);
                    }
                }


                @keyframes detonation-burst {
                    0% {
                        opacity: 0;
                        transform: scale(0.2);
                    }

                    20% {
                        opacity: 0.8;
                        transform: scale(0.45);
                    }

                    55% {
                        opacity: 0.45;
                        transform: scale(0.8);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.1);
                    }
                }
            `}</style>


            <div className="detonation">

                {/* Central impact */}
                <div className="detonation__impact" />

                {/* Main explosion rings */}
                <div className="detonation__ring detonation__ring--1" />
                <div className="detonation__ring detonation__ring--2" />

                {/* Rotating cross */}
                <div className="detonation__cross">
                    <span />
                    <span />
                </div>

                {/* Secondary radial burst */}
                <div className="detonation__burst">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

            </div>
        </>
    );
}