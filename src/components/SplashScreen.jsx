import { useEffect, useState } from "react";

export default function SplashScreen({ onFinished }) {
    const [ready, setReady] = useState(false);
    const [launching, setLaunching] = useState(false);

    useEffect(() => {
        // Intro ist nach dieser Zeit bereit für den Launch
        const timer = setTimeout(() => {
            setReady(true);
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        function handleKeyDown() {
            if (ready && !launching) {
                launch();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [ready, launching]);

    function launch() {
        if (!ready || launching) return;

        setLaunching(true);

        setTimeout(() => {
            onFinished?.();
        }, 900);
    }

    const stars = Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: `${(i * 47.31) % 100}%`,
        top: `${(i * 83.17) % 100}%`,
        size: `${1 + (i % 3)}px`,
        delay: `${(i % 15) * 0.17}s`,
        duration: `${2 + (i % 5)}s`,
    }));

    return (
        <div
            className={`splash-screen ${
                launching ? "launching" : ""
            }`}
            onClick={launch}
        >
            {/* --------------------------------
                BACKGROUND
            -------------------------------- */}

            <div className="space" />

            <div className="nebula nebula-left" />
            <div className="nebula nebula-right" />

            <div className="stars">
                {stars.map((star) => (
                    <span
                        key={star.id}
                        className="star"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                ))}
            </div>

            {/* --------------------------------
                PLANET / HORIZON
            -------------------------------- */}

            <div className="planet">
                <div className="planet-glow" />
                <div className="planet-surface" />
            </div>

            {/* --------------------------------
                MAIN CONTENT
            -------------------------------- */}

            <main className="content">

                {/* Small top label */}
                <div className="top-label">
                    <span className="top-line" />
                    <span>DEEP SPACE PROTOCOL</span>
                    <span className="top-line" />
                </div>

                {/* --------------------------------
                    LOGO
                -------------------------------- */}

                <div className="logo">

                    {/* HUD rings */}
                    <div className="ring ring-outer" />
                    <div className="ring ring-middle" />
                    <div className="ring ring-inner" />

                    {/* Rotating HUD segments */}
                    <div className="hud-segments segment-one" />
                    <div className="hud-segments segment-two" />

                    {/* SLAY */}
                    <div className="title slay">
                        <span>SLAY</span>
                    </div>

                    {/* THE */}
                    <div className="the-row">
                        <div className="energy-line" />

                        <div className="the">
                            THE
                        </div>

                        <div className="energy-line" />
                    </div>

                    {/* SPACE */}
                    <div className="title space-title">
                        <span>SPACE</span>
                    </div>

                    {/* Logo flash */}
                    <div className="logo-flash" />

                    {/* Glitch */}
                    <div className="glitch glitch-cyan">
                        SLAY
                    </div>

                    <div className="glitch glitch-pink">
                        SPACE
                    </div>
                </div>

                {/* --------------------------------
                    SUBTITLE
                -------------------------------- */}

                <div className="subtitle">
                    <span>THE UNIVERSE</span>
                    <span className="subtitle-divider">×</span>
                    <span>IS YOURS TO SLAY</span>
                </div>

                {/* --------------------------------
                    LAUNCH PROMPT
                -------------------------------- */}

                <div
                    className={`launch-area ${
                        ready ? "ready" : ""
                    }`}
                >
                    <div className="launch-bracket">
                        <span>[</span>
                        <div className="launch-line" />
                        <span>]</span>
                    </div>

                    <div className="launch-text">
                        PRESS ANY KEY
                    </div>

                    <div className="launch-subtext">
                        TO LAUNCH
                    </div>

                    <div className="launch-hint">
                        TAP SCREEN TO LAUNCH
                    </div>
                </div>
            </main>

            {/* --------------------------------
                CORNER HUD
            -------------------------------- */}

            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />

            <div className="version">
                STS // 01
            </div>

            {/* --------------------------------
                SCANLINES
            -------------------------------- */}

            <div className="scanlines" />

            {/* --------------------------------
                LAUNCH FLASH
            -------------------------------- */}

            <div className="launch-flash" />

            <style>{`

                * {
                    box-sizing: border-box;
                }

                /* =================================
                   SCREEN
                ================================= */

                .splash-screen {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;

                    width: 100%;
                    height: 100dvh;

                    overflow: hidden;

                    background: #02030a;
                    color: white;

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    cursor: pointer;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    animation: screenAppear 1s ease-out;
                }

                /* =================================
                   BACKGROUND
                ================================= */

                .space {
                    position: absolute;
                    inset: -20%;

                    background:
                        radial-gradient(
                            circle at 50% 48%,
                            rgba(75, 20, 130, 0.22),
                            transparent 34%
                        ),
                        radial-gradient(
                            circle at 0% 45%,
                            rgba(0, 80, 255, 0.17),
                            transparent 38%
                        ),
                        radial-gradient(
                            circle at 100% 50%,
                            rgba(255, 0, 160, 0.14),
                            transparent 38%
                        ),
                        #02030a;

                    animation:
                        backgroundDrift 12s ease-in-out infinite;
                }

                .nebula {
                    position: absolute;

                    width: 70vw;
                    height: 70vw;

                    max-width: 500px;
                    max-height: 500px;

                    border-radius: 50%;

                    filter: blur(80px);

                    opacity: 0.12;
                }

                .nebula-left {
                    left: -35%;
                    top: 25%;

                    background: #164dff;

                    animation:
                        nebulaFloat 9s ease-in-out infinite;
                }

                .nebula-right {
                    right: -35%;
                    top: 35%;

                    background: #d020ff;

                    animation:
                        nebulaFloat 11s ease-in-out infinite reverse;
                }

                /* =================================
                   STARS
                ================================= */

                .stars {
                    position: absolute;
                    inset: 0;
                }

                .star {
                    position: absolute;

                    display: block;

                    border-radius: 50%;

                    background: white;

                    opacity: 0.25;

                    animation:
                        twinkle ease-in-out infinite;
                }

                /* =================================
                   PLANET
                ================================= */

                .planet {
                    position: absolute;

                    left: 50%;
                    bottom: -43%;

                    width: 150%;
                    aspect-ratio: 1;

                    transform: translateX(-50%);

                    border-radius: 50%;

                    opacity: 0;

                    animation:
                        planetAppear 2s 1.3s forwards;
                }

                .planet-surface {
                    position: absolute;
                    inset: 0;

                    border-radius: 50%;

                    background:
                        radial-gradient(
                            circle at 50% 35%,
                            rgba(50, 70, 150, 0.5),
                            rgba(10, 12, 35, 0.95) 55%,
                            #02030a 70%
                        );

                    box-shadow:
                        inset 0 30px 80px rgba(70, 100, 255, 0.18);
                }

                .planet-glow {
                    position: absolute;

                    top: -3px;
                    left: 5%;

                    width: 90%;
                    height: 20px;

                    border-radius: 50%;

                    background: rgba(120, 150, 255, 0.9);

                    filter: blur(8px);

                    box-shadow:
                        0 0 15px rgba(100, 130, 255, 0.8),
                        0 0 45px rgba(70, 100, 255, 0.5),
                        0 0 100px rgba(100, 50, 255, 0.3);
                }

                /* =================================
                   CONTENT
                ================================= */

                .content {
                    position: relative;

                    z-index: 10;

                    width: 100%;
                    height: 100%;

                    display: flex;
                    flex-direction: column;

                    align-items: center;

                    padding:
                        max(8vh, 45px)
                        18px
                        max(7vh, 40px);

                    animation:
                        contentEnter 1.5s
                        cubic-bezier(.16, 1, .3, 1);
                }

                /* =================================
                   TOP LABEL
                ================================= */

                .top-label {
                    display: flex;
                    align-items: center;
                    gap: 9px;

                    margin-top: 1vh;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 8px;

                    letter-spacing: 0.22em;

                    color: rgba(210, 220, 255, 0.45);

                    white-space: nowrap;
                }

                .top-line {
                    width: 25px;
                    height: 1px;

                    background:
                        rgba(170, 130, 255, 0.5);
                }

                /* =================================
                   LOGO
                ================================= */

                .logo {
                    position: relative;

                    width: min(94vw, 520px);

                    margin-top: 9vh;

                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    transform:
                        perspective(700px)
                        rotateX(8deg);

                    animation:
                        logoEnter 1.5s
                        cubic-bezier(.16, 1, .3, 1);
                }

                /* =================================
                   HUD RINGS
                ================================= */

                .ring {
                    position: absolute;

                    left: 50%;
                    top: 50%;

                    border-radius: 50%;

                    transform:
                        translate(-50%, -50%);

                    pointer-events: none;
                }

                .ring-outer {
                    width: 115%;
                    aspect-ratio: 1;

                    border:
                        1px solid
                        rgba(140, 150, 255, 0.18);

                    border-top-color:
                        rgba(200, 100, 255, 0.8);

                    animation:
                        rotate 18s linear infinite;
                }

                .ring-middle {
                    width: 94%;
                    aspect-ratio: 1;

                    border:
                        1px dashed
                        rgba(150, 110, 255, 0.2);

                    animation:
                        rotateReverse 25s linear infinite;
                }

                .ring-inner {
                    width: 74%;
                    aspect-ratio: 1;

                    border:
                        1px solid
                        rgba(100, 140, 255, 0.13);

                    animation:
                        rotate 35s linear infinite;
                }

                .hud-segments {
                    position: absolute;

                    width: 108%;
                    aspect-ratio: 1;

                    border-radius: 50%;

                    border:
                        3px solid transparent;

                    pointer-events: none;
                }

                .segment-one {
                    border-top-color:
                        rgba(150, 80, 255, 0.8);

                    border-right-color:
                        rgba(70, 120, 255, 0.35);

                    animation:
                        rotate 9s linear infinite;
                }

                .segment-two {
                    border-bottom-color:
                        rgba(255, 50, 210, 0.55);

                    border-left-color:
                        rgba(50, 180, 255, 0.3);

                    animation:
                        rotateReverse 13s linear infinite;
                }

                /* =================================
                   TITLE
                ================================= */

                .title {
                    position: relative;

                    font-family:
                        Impact,
                        Haettenschweiler,
                        "Arial Black",
                        sans-serif;

                    font-weight: 900;

                    line-height: 0.8;

                    letter-spacing: 0.055em;

                    text-align: center;

                    user-select: none;

                    z-index: 5;
                }

                .slay {
                    font-size:
                        clamp(76px, 19vw, 125px);

                    color: #f3f6ff;

                    text-shadow:
                        0 3px 0 #b9c4dd,
                        0 7px 0 #66728e,
                        0 12px 20px rgba(0,0,0,0.9),
                        0 0 20px rgba(180,210,255,0.3);
                }

                .space-title {
                    margin-top: 6px;

                    font-size:
                        clamp(67px, 17vw, 115px);

                    color: #e8d8ff;

                    text-shadow:
                        0 3px 0 #a26fd2,
                        0 7px 0 #552a80,
                        0 12px 20px rgba(0,0,0,0.9),
                        0 0 20px rgba(200,60,255,0.9),
                        0 0 50px rgba(130,20,255,0.45);
                }

                /* =================================
                   THE
                ================================= */

                .the-row {
                    position: relative;

                    z-index: 5;

                    width: 100%;

                    display: flex;
                    align-items: center;

                    justify-content: center;

                    gap: 10px;

                    margin:
                        20px 0
                        16px;
                }

                .the {
                    font-size: 15px;

                    font-weight: 900;

                    letter-spacing: 0.45em;

                    padding-left: 0.45em;

                    color: white;

                    text-shadow:
                        0 0 10px rgba(255,255,255,0.8),
                        0 0 25px rgba(170,70,255,0.9);
                }

                .energy-line {
                    height: 1px;

                    flex: 1;

                    max-width: 95px;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,0.8),
                            #b34cff,
                            transparent
                        );

                    box-shadow:
                        0 0 8px #a137ff;

                    animation:
                        energyPulse 2s ease-in-out infinite;
                }

                /* =================================
                   LOGO FLASH
                ================================= */

                .logo-flash {
                    position: absolute;

                    top: -30%;
                    bottom: -30%;

                    left: -70%;

                    width: 35px;

                    transform: skewX(-20deg);

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,0.9),
                            rgba(190,90,255,0.5),
                            transparent
                        );

                    filter: blur(6px);

                    opacity: 0;

                    animation:
                        lightSweep 2.8s 1s ease-out forwards;
                }

                /* =================================
                   GLITCH
                ================================= */

                .glitch {
                    position: absolute;

                    z-index: 20;

                    opacity: 0;

                    font-family:
                        Impact,
                        Haettenschweiler,
                        "Arial Black",
                        sans-serif;

                    font-weight: 900;

                    pointer-events: none;
                }

                .glitch-cyan {
                    top: 0;

                    font-size:
                        clamp(76px, 19vw, 125px);

                    color: #00eaff;

                    animation:
                        glitch 2.8s 0.4s;
                }

                .glitch-pink {
                    bottom: 0;

                    font-size:
                        clamp(67px, 17vw, 115px);

                    color: #ff2bd6;

                    animation:
                        glitch 2.8s 0.4s;
                }

                /* =================================
                   SUBTITLE
                ================================= */

                .subtitle {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    margin-top: 5vh;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 7px;

                    letter-spacing: 0.16em;

                    color:
                        rgba(210, 210, 240, 0.38);

                    animation:
                        fadeUp 1s 1.7s both;
                }

                .subtitle-divider {
                    color:
                        rgba(190, 70, 255, 0.8);
                }

                /* =================================
                   LAUNCH
                ================================= */

                .launch-area {
                    position: absolute;

                    bottom: max(8vh, 55px);

                    left: 20px;
                    right: 20px;

                    display: flex;
                    flex-direction: column;

                    align-items: center;

                    opacity: 0;

                    transform:
                        translateY(15px);

                    transition:
                        opacity 0.8s ease,
                        transform 0.8s ease;
                }

                .launch-area.ready {
                    opacity: 1;

                    transform:
                        translateY(0);
                }

                .launch-bracket {
                    display: flex;

                    align-items: center;

                    gap: 10px;

                    width: min(250px, 70vw);

                    color:
                        rgba(190, 120, 255, 0.7);

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 18px;
                }

                .launch-bracket > span {
                    animation:
                        bracketPulse 1.5s ease-in-out infinite;
                }

                .launch-line {
                    height: 1px;

                    flex: 1;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(180,100,255,0.7),
                            transparent
                        );
                }

                .launch-text {
                    margin-top: 12px;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size:
                        clamp(12px, 3.5vw, 16px);

                    font-weight: bold;

                    letter-spacing:
                        0.25em;

                    padding-left:
                        0.25em;

                    color: white;

                    text-shadow:
                        0 0 10px rgba(190,100,255,0.8);
                }

                .launch-subtext {
                    margin-top: 6px;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 9px;

                    letter-spacing: 0.45em;

                    padding-left: 0.45em;

                    color:
                        rgba(190,150,255,0.7);

                    animation:
                        launchPulse 1.5s ease-in-out infinite;
                }

                .launch-hint {
                    margin-top: 18px;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 7px;

                    letter-spacing: 0.18em;

                    color:
                        rgba(210,210,240,0.3);

                    opacity: 0;

                    animation:
                        hintAppear 1s 3s forwards;
                }

                /* =================================
                   CORNERS
                ================================= */

                .corner {
                    position: absolute;

                    width: 22px;
                    height: 22px;

                    z-index: 20;

                    opacity: 0.35;
                }

                .corner-tl {
                    top: 20px;
                    left: 20px;

                    border-top: 1px solid white;
                    border-left: 1px solid white;
                }

                .corner-tr {
                    top: 20px;
                    right: 20px;

                    border-top: 1px solid white;
                    border-right: 1px solid white;
                }

                .corner-bl {
                    bottom: 20px;
                    left: 20px;

                    border-bottom: 1px solid white;
                    border-left: 1px solid white;
                }

                .corner-br {
                    bottom: 20px;
                    right: 20px;

                    border-bottom: 1px solid white;
                    border-right: 1px solid white;
                }

                .version {
                    position: absolute;

                    right: 23px;
                    top: 52px;

                    font-family:
                        "Courier New",
                        monospace;

                    font-size: 7px;

                    letter-spacing: 0.2em;

                    color:
                        rgba(200,200,230,0.25);

                    writing-mode:
                        vertical-rl;
                }

                /* =================================
                   SCANLINES
                ================================= */

                .scanlines {
                    position: absolute;
                    inset: 0;

                    pointer-events: none;

                    background:
                        repeating-linear-gradient(
                            to bottom,
                            transparent 0px,
                            transparent 3px,
                            rgba(255,255,255,0.012) 4px
                        );

                    opacity: 0.6;

                    z-index: 50;
                }

                /* =================================
                   LAUNCH FLASH
                ================================= */

                .launch-flash {
                    position: absolute;

                    inset: 0;

                    background: white;

                    opacity: 0;

                    pointer-events: none;

                    z-index: 100;
                }

                .launching .launch-flash {
                    animation:
                        launchFlash 0.9s ease-out forwards;
                }

                .launching .content {
                    animation:
                        warpAway 0.9s
                        cubic-bezier(.7,0,.84,0);
                }

                .launching .stars {
                    animation:
                        starsWarp 0.9s ease-in forwards;
                }

                /* =================================
                   ANIMATIONS
                ================================= */

                @keyframes screenAppear {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                @keyframes contentEnter {
                    from {
                        opacity: 0;

                        transform:
                            translateY(25px)
                            scale(0.95);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0)
                            scale(1);
                    }
                }

                @keyframes logoEnter {
                    0% {
                        opacity: 0;

                        transform:
                            perspective(700px)
                            rotateX(25deg)
                            scale(0.55);

                        filter:
                            blur(15px);
                    }

                    55% {
                        opacity: 1;
                    }

                    100% {
                        opacity: 1;

                        transform:
                            perspective(700px)
                            rotateX(8deg)
                            scale(1);

                        filter:
                            blur(0);
                    }
                }

                @keyframes backgroundDrift {
                    0%, 100% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(1.08);
                    }
                }

                @keyframes nebulaFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                    }

                    50% {
                        transform: translate(20px, -30px);
                    }
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.15;
                        transform: scale(0.8);
                    }

                    50% {
                        opacity: 0.9;
                        transform: scale(1.2);
                    }
                }

                @keyframes planetAppear {
                    from {
                        opacity: 0;
                        transform:
                            translateX(-50%)
                            scale(0.8);
                    }

                    to {
                        opacity: 1;
                        transform:
                            translateX(-50%)
                            scale(1);
                    }
                }

                @keyframes rotate {
                    from {
                        transform:
                            translate(-50%, -50%)
                            rotate(0deg);
                    }

                    to {
                        transform:
                            translate(-50%, -50%)
                            rotate(360deg);
                    }
                }

                @keyframes rotateReverse {
                    from {
                        transform:
                            translate(-50%, -50%)
                            rotate(360deg);
                    }

                    to {
                        transform:
                            translate(-50%, -50%)
                            rotate(0deg);
                    }
                }

                @keyframes energyPulse {
                    0%, 100% {
                        opacity: 0.35;
                        transform: scaleX(0.8);
                    }

                    50% {
                        opacity: 1;
                        transform: scaleX(1);
                    }
                }

                @keyframes lightSweep {
                    0% {
                        left: -70%;
                        opacity: 0;
                    }

                    10% {
                        opacity: 1;
                    }

                    60% {
                        opacity: 0.8;
                    }

                    100% {
                        left: 150%;
                        opacity: 0;
                    }
                }

                @keyframes glitch {
                    0%, 75%, 100% {
                        opacity: 0;
                    }

                    78% {
                        opacity: 0.7;
                        transform: translateX(-8px);
                    }

                    80% {
                        opacity: 0;
                        transform: translateX(12px);
                    }

                    82% {
                        opacity: 0.6;
                        transform: translateX(-5px);
                    }

                    85% {
                        opacity: 0;
                    }
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform:
                            translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform:
                            translateY(0);
                    }
                }

                @keyframes bracketPulse {
                    0%, 100% {
                        opacity: 0.4;
                    }

                    50% {
                        opacity: 1;
                    }
                }

                @keyframes launchPulse {
                    0%, 100% {
                        opacity: 0.55;
                        text-shadow:
                            0 0 5px rgba(180,80,255,0.4);
                    }

                    50% {
                        opacity: 1;
                        text-shadow:
                            0 0 15px rgba(190,80,255,1),
                            0 0 30px rgba(130,30,255,0.6);
                    }
                }

                @keyframes hintAppear {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                /* =================================
                   LAUNCH
                ================================= */

                @keyframes launchFlash {
                    0% {
                        opacity: 0;
                    }

                    10% {
                        opacity: 0.85;
                    }

                    35% {
                        opacity: 0;
                    }

                    100% {
                        opacity: 0;
                    }
                }

                @keyframes warpAway {
                    0% {
                        opacity: 1;

                        transform:
                            scale(1);
                    }

                    100% {
                        opacity: 0;

                        transform:
                            scale(1.35);

                        filter:
                            blur(15px);
                    }
                }

                @keyframes starsWarp {
                    from {
                        transform: scale(1);
                    }

                    to {
                        transform: scale(3);
                    }
                }

                /* =================================
                   SMALL PHONES
                ================================= */

                @media (max-height: 700px) {

                    .logo {
                        margin-top: 5vh;
                    }

                    .subtitle {
                        margin-top: 3vh;
                    }

                    .launch-area {
                        bottom: 5vh;
                    }

                    .planet {
                        bottom: -52%;
                    }
                }

                /* =================================
                   LANDSCAPE
                ================================= */

                @media (orientation: landscape) {

                    .content {
                        padding-top: 25px;
                        padding-bottom: 25px;
                    }

                    .logo {
                        margin-top: 2vh;

                        transform:
                            perspective(700px)
                            rotateX(5deg)
                            scale(0.68);
                    }

                    .subtitle {
                        margin-top: -1vh;
                    }

                    .launch-area {
                        bottom: 25px;
                    }

                    .planet {
                        bottom: -85%;
                    }
                }

                /* =================================
                   REDUCE MOTION
                ================================= */

                @media (prefers-reduced-motion: reduce) {

                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                    }
                }

            `}</style>
        </div>
    );
}