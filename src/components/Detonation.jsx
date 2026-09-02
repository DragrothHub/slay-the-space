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

                    overflow: visible;
                }


                /* =====================================================
                   CORE IMPACT
                   ===================================================== */

                .detonation__core {
                    position: absolute;

                    width: 12%;
                    height: 12%;

                    border-radius: 50%;

                    background: currentColor;

                    opacity: 0;

                    animation:
                        detonation-core
                        180ms
                        cubic-bezier(0.1, 0.9, 0.2, 1)
                        forwards;
                }


                /* =====================================================
                   BIG EXPLOSION RINGS
                   ===================================================== */

                .detonation__ring {
                    position: absolute;

                    width: 200%;
                    height: 200%;

                    border: 2px solid currentColor;
                    border-radius: 50%;

                    opacity: 0;
                }

                .detonation__ring--1 {
                    animation:
                        detonation-ring-big
                        420ms
                        cubic-bezier(0.05, 0.8, 0.15, 1)
                        forwards;
                }

                .detonation__ring--2 {
                    animation:
                        detonation-ring-big
                        440ms
                        cubic-bezier(0.05, 0.8, 0.15, 1)
                        65ms
                        forwards;
                }


                /* =====================================================
                   THIN AFTERSHOCK RING
                   ===================================================== */

                .detonation__aftershock {
                    position: absolute;

                    width: 100%;
                    height: 100%;

                    border: 1px solid currentColor;
                    border-radius: 50%;

                    opacity: 0;

                    animation:
                        detonation-aftershock
                        520ms
                        cubic-bezier(0.1, 0.7, 0.2, 1)
                        100ms
                        forwards;
                }


                /* =====================================================
                   ROTATING X
                   ===================================================== */

                .detonation__cross {
                    position: absolute;

                    width: 90%;
                    height: 90%;

                    opacity: 0;

                    transform:
                        rotate(0deg)
                        scale(0.1);

                    animation:
                        detonation-cross
                        360ms
                        cubic-bezier(0.05, 0.85, 0.15, 1)
                        10ms
                        forwards;
                }

                .detonation__cross span {
                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 100%;
                    height: 2px;

                    background: currentColor;

                    transform:
                        translate(-50%, -50%);
                }

                .detonation__cross span:nth-child(2) {
                    transform:
                        translate(-50%, -50%)
                        rotate(90deg);
                }


                /* =====================================================
                   RADIAL ENERGY SPIKES
                   ===================================================== */

                .detonation__spikes {
                    position: absolute;

                    width: 100%;
                    height: 100%;

                    opacity: 0;

                    animation:
                        detonation-spikes
                        330ms
                        cubic-bezier(0.05, 0.8, 0.15, 1)
                        25ms
                        forwards;
                }

                .detonation__spikes span {
                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 75%;
                    height: 1px;

                    background: currentColor;

                    transform-origin: 0 50%;
                }

                .detonation__spikes span:nth-child(1) {
                    transform: rotate(0deg);
                }

                .detonation__spikes span:nth-child(2) {
                    transform: rotate(22.5deg);
                }

                .detonation__spikes span:nth-child(3) {
                    transform: rotate(45deg);
                }

                .detonation__spikes span:nth-child(4) {
                    transform: rotate(67.5deg);
                }

                .detonation__spikes span:nth-child(5) {
                    transform: rotate(90deg);
                }

                .detonation__spikes span:nth-child(6) {
                    transform: rotate(112.5deg);
                }

                .detonation__spikes span:nth-child(7) {
                    transform: rotate(135deg);
                }

                .detonation__spikes span:nth-child(8) {
                    transform: rotate(157.5deg);
                }

                .detonation__spikes span:nth-child(9) {
                    transform: rotate(180deg);
                }

                .detonation__spikes span:nth-child(10) {
                    transform: rotate(202.5deg);
                }

                .detonation__spikes span:nth-child(11) {
                    transform: rotate(225deg);
                }

                .detonation__spikes span:nth-child(12) {
                    transform: rotate(247.5deg);
                }

                .detonation__spikes span:nth-child(13) {
                    transform: rotate(270deg);
                }

                .detonation__spikes span:nth-child(14) {
                    transform: rotate(292.5deg);
                }

                .detonation__spikes span:nth-child(15) {
                    transform: rotate(315deg);
                }

                .detonation__spikes span:nth-child(16) {
                    transform: rotate(337.5deg);
                }


                /* =====================================================
                   CINEMATIC LENS FLARE
                   ===================================================== */

                .detonation__flare {
                    position: absolute;

                    width: 180%;
                    height: 180%;

                    opacity: 0;

                    animation:
                        detonation-flare
                        260ms
                        cubic-bezier(0.1, 0.8, 0.2, 1)
                        35ms
                        forwards;
                }


                /* Main horizontal anamorphic flare */

                .detonation__flare::before {
                    content: "";

                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 150%;
                    height: 2px;

                    background: currentColor;

                    transform:
                        translate(-50%, -50%)
                        scaleX(0.05);

                    box-shadow:
                        0 0 8px currentColor,
                        0 0 18px currentColor;

                    animation:
                        detonation-flare-horizontal
                        240ms
                        cubic-bezier(0.05, 0.9, 0.15, 1)
                        35ms
                        forwards;
                }


                /* Vertical flash */

                .detonation__flare::after {
                    content: "";

                    position: absolute;

                    left: 50%;
                    top: 50%;

                    width: 2px;
                    height: 90%;

                    background: currentColor;

                    transform:
                        translate(-50%, -50%)
                        scaleY(0.02);

                    box-shadow:
                        0 0 6px currentColor,
                        0 0 14px currentColor;

                    animation:
                        detonation-flare-vertical
                        190ms
                        cubic-bezier(0.05, 0.9, 0.15, 1)
                        35ms
                        forwards;
                }


                /* =====================================================
                   SMALL FLARE DIAMOND
                   ===================================================== */

                .detonation__diamond {
                    position: absolute;

                    width: 22%;
                    height: 22%;

                    border: 1px solid currentColor;

                    transform:
                        rotate(45deg)
                        scale(0);

                    opacity: 0;

                    animation:
                        detonation-diamond
                        260ms
                        cubic-bezier(0.1, 0.9, 0.2, 1)
                        30ms
                        forwards;
                }


                /* =====================================================
                   ANIMATIONS
                   ===================================================== */

                @keyframes detonation-core {
                    0% {
                        opacity: 0;
                        transform: scale(0.1);
                    }

                    12% {
                        opacity: 1;
                        transform: scale(2.8);
                    }

                    30% {
                        opacity: 1;
                        transform: scale(1);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
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
                }


                @keyframes detonation-aftershock {
                    0% {
                        opacity: 0;
                        transform: scale(0.4);
                    }

                    25% {
                        opacity: 0.45;
                    }

                    70% {
                        opacity: 0.2;
                        transform: scale(1.05);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.35);
                    }
                }


                @keyframes detonation-cross {
                    0% {
                        opacity: 0;
                        transform:
                            rotate(0deg)
                            scale(0.1);
                    }

                    12% {
                        opacity: 1;
                        transform:
                            rotate(20deg)
                            scale(0.55);
                    }

                    45% {
                        opacity: 0.8;
                        transform:
                            rotate(70deg)
                            scale(1.0);
                    }

                    72% {
                        opacity: 0.45;
                        transform:
                            rotate(105deg)
                            scale(1.35);
                    }

                    100% {
                        opacity: 0;
                        transform:
                            rotate(135deg)
                            scale(1.65);
                    }
                }


                @keyframes detonation-spikes {
                    0% {
                        opacity: 0;
                        transform: scale(0.05);
                    }

                    15% {
                        opacity: 0.9;
                        transform: scale(0.3);
                    }

                    45% {
                        opacity: 0.5;
                        transform: scale(0.75);
                    }

                    100% {
                        opacity: 0;
                        transform: scale(1.2);
                    }
                }


                @keyframes detonation-flare {
                    0% {
                        opacity: 0;
                    }

                    15% {
                        opacity: 1;
                    }

                    45% {
                        opacity: 0.8;
                    }

                    100% {
                        opacity: 0;
                    }
                }


                @keyframes detonation-flare-horizontal {
                    0% {
                        transform:
                            translate(-50%, -50%)
                            scaleX(0.01);
                    }

                    18% {
                        transform:
                            translate(-50%, -50%)
                            scaleX(1);
                    }

                    42% {
                        transform:
                            translate(-50%, -50%)
                            scaleX(0.75);
                    }

                    100% {
                        transform:
                            translate(-50%, -50%)
                            scaleX(0);
                    }
                }


                @keyframes detonation-flare-vertical {
                    0% {
                        transform:
                            translate(-50%, -50%)
                            scaleY(0.01);
                    }

                    20% {
                        transform:
                            translate(-50%, -50%)
                            scaleY(1);
                    }

                    100% {
                        transform:
                            translate(-50%, -50%)
                            scaleY(0);
                    }
                }


                @keyframes detonation-diamond {
                    0% {
                        opacity: 0;
                        transform:
                            rotate(45deg)
                            scale(0);
                    }

                    18% {
                        opacity: 0.9;
                        transform:
                            rotate(45deg)
                            scale(0.8);
                    }

                    55% {
                        opacity: 0.4;
                        transform:
                            rotate(45deg)
                            scale(1.5);
                    }

                    100% {
                        opacity: 0;
                        transform:
                            rotate(45deg)
                            scale(2.2);
                    }
                }
            `}</style>


            <div className="detonation">

                {/* Hard central impact */}
                <div className="detonation__core" />

                {/* Large expanding rings */}
                <div className="detonation__ring detonation__ring--1" />
                <div className="detonation__ring detonation__ring--2" />

                {/* Faint final shockwave */}
                <div className="detonation__aftershock" />

                {/* Rotating energy cross */}
                <div className="detonation__cross">
                    <span />
                    <span />
                </div>

                {/* Radial energy burst */}
                <div className="detonation__spikes">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                {/* Cinematic Star-Trek-ish flare */}
                <div className="detonation__flare" />

                {/* Small central diamond */}
                <div className="detonation__diamond" />

            </div>
        </>
    );
}