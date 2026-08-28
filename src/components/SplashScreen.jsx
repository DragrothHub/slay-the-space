import { useEffect, useState } from "react";

export default function SplashScreen({ onFinished }) {
    const [ready, setReady] = useState(false);
    const [launching, setLaunching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setReady(true);
        }, 2600);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleKeyDown = () => {
            if (ready && !launching) {
                launch();
            }
        };

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
        }, 700);
    }

    const stars = Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: `${(i * 47.3) % 100}%`,
        top: `${(i * 83.1) % 100}%`,
        delay: `${(i % 10) * 0.2}s`,
        duration: `${2 + (i % 4)}s`,
    }));

    return (
        <div
            className={`splash ${launching ? "launching" : ""}`}
            onClick={launch}
        >
            {/* ============================
                BACKGROUND
            ============================ */}

            <div className="background" />

            <div className="stars">
                {stars.map((star) => (
                    <span
                        key={star.id}
                        className="star"
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                ))}
            </div>

            {/* ============================
                MAIN
            ============================ */}

            <div className="screen">

                {/* top status */}
                <div className="top-bar">
                    <span>STS // SYSTEM</span>

                    <span className="top-status">
                        <i />
                        ONLINE
                    </span>
                </div>

                {/* ============================
                    LOGO PANEL
                ============================ */}

                <div className="logo-panel">

                    <div className="panel-corner top-left" />
                    <div className="panel-corner top-right" />
                    <div className="panel-corner bottom-left" />
                    <div className="panel-corner bottom-right" />

                    {/* small system label */}
                    <div className="logo-label">
                        <span>PROJECT</span>
                        <span>01</span>
                    </div>

                    {/* main title */}

                    <div className="title-wrapper">

                        <div className="title-line">
                            <span className="title-small">
                                &gt;&gt;
                            </span>

                            <span 
                                className="title-main glitch-text"
                                data-text="SLAY"
                            >
                                SLAY
                            </span>

                            <span className="title-small">
                                &lt;&lt;
                            </span>
                        </div>

                        <div className="title-middle">
                            THE
                        </div>

                        <div 
                            className="title-space glitch-text glitch-space"
                            data-text="SPACE"
                        >
                            SPACE
                        </div>

                    </div>

                    {/* decorative line */}

                    <div className="logo-divider">
                        <span />
                        <b />
                        <span />
                    </div>

                    {/* description */}

                    <div className="tagline">
                        SURVIVE&nbsp;&nbsp; // &nbsp;&nbsp;UPGRADE&nbsp;&nbsp; // &nbsp;&nbsp;SLAY
                    </div>

                </div>

                {/* ============================
                    SYSTEM INFO
                ============================ */}

                <div className="system-info">

                    <div className="info-row">
                        <span>SHIELD</span>

                        <div className="info-bar">
                            <div className="fill blue" />
                        </div>

                        <span>100%</span>
                    </div>

                    <div className="info-row">
                        <span>ARMOR</span>

                        <div className="info-bar">
                            <div className="fill orange" />
                        </div>

                        <span>100%</span>
                    </div>

                    <div className="info-row">
                        <span>HULL</span>

                        <div className="info-bar">
                            <div className="fill red" />
                        </div>

                        <span>100%</span>
                    </div>

                </div>

                {/* ============================
                    LAUNCH
                ============================ */}

                <div className={`launch ${ready ? "ready" : ""}`}>

                    <div className="launch-header">
                        <span className="line" />

                        <span>
                            SYSTEM READY
                        </span>

                        <span className="line" />
                    </div>

                    <div className="launch-button">

                        <div className="button-side">
                            [
                        </div>

                        <div className="button-content">

                            <div className="press">
                                PRESS ANY KEY
                            </div>

                            <div className="launch-text">
                                TO LAUNCH
                            </div>

                        </div>

                        <div className="button-side">
                            ]
                        </div>

                    </div>

                    <div className="tap-hint">
                        TAP SCREEN TO LAUNCH
                    </div>

                </div>

                {/* ============================
                    BOTTOM
                ============================ */}

                <div className="bottom-bar">

                    <span>
                        BUILD 0.1.0
                    </span>

                    <span>
                        DEEP SPACE
                    </span>

                    <span>
                        <i className="green-dot" />
                        READY
                    </span>

                </div>

            </div>

            {/* ============================
                LAUNCH EFFECT
            ============================ */}

            <div className="launch-overlay" />


            <style>{`

    * {
        box-sizing: border-box;
    }

    /* ========================================
       BASE
    ======================================== */

    .splash {
        position: fixed;
        inset: 0;

        width: 100%;
        height: 100dvh;

        overflow: hidden;

        z-index: 99999;

        background: #05070d;

        color: #f1f3f7;

        font-family:
            "Courier New",
            Courier,
            monospace;

        cursor: pointer;

        animation:
            splash-in
            0.6s ease-out;
    }

    .background {
        position: absolute;
        inset: 0;

        background:
            radial-gradient(
                circle at 50% 42%,
                rgba(55, 80, 130, 0.11),
                transparent 38%
            ),
            #05070d;
    }

    /* ========================================
       STARS
    ======================================== */

    .stars {
        position: absolute;
        inset: 0;

        pointer-events: none;
    }

    .star {
        position: absolute;

        width: 2px;
        height: 2px;

        border-radius: 50%;

        background: #8994a8;

        opacity: 0.15;

        animation:
            twinkle
            ease-in-out
            infinite;
    }

    /* ========================================
       SCREEN LAYOUT
    ======================================== */

    .screen {
        position: relative;

        z-index: 5;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;

        align-items: center;

        padding:
            max(28px, env(safe-area-inset-top))
            22px
            max(25px, env(safe-area-inset-bottom));

        animation:
            screen-enter
            1s
            cubic-bezier(.16, 1, .3, 1);
    }

    /* ========================================
       TOP BAR
    ======================================== */

    .top-bar {
        width: 100%;
        max-width: 600px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 10px;

        letter-spacing: 0.15em;

        color: #7e8798;
    }

    .top-status {
        display: flex;
        align-items: center;

        gap: 7px;

        color: #53cf85;
    }

    .top-status i {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #53cf85;

        box-shadow:
            0 0 8px rgba(83, 207, 133, 0.8);

        animation:
            blink
            1.4s
            infinite;
    }

    /* ========================================
       LOGO PANEL
    ======================================== */

    .logo-panel {
        position: relative;

        width: 100%;
        max-width: 600px;

        margin-top: 15vh;

        padding:
            35px
            18px
            32px;

        border-radius: 18px;

        border:
            2px solid
            #293548;

        background:
            rgba(14, 21, 34, 0.88);

        box-shadow:
            0 15px 50px
            rgba(0,0,0,0.35);

        animation:
            panel-enter
            1.1s
            0.15s
            both;
    }

    /* ========================================
       CORNERS
    ======================================== */

    .panel-corner {
        position: absolute;

        width: 14px;
        height: 14px;

        opacity: 0.7;
    }

    .top-left {
        top: 20px;
        left: 10px;

        border-top:
            2px solid #3c83ed;

        border-left:
            2px solid #3c83ed;
    }

    .top-right {
        top: 20px;
        right: 10px;

        border-top:
            2px solid #3c83ed;

        border-right:
            2px solid #3c83ed;
    }

    .bottom-left {
        bottom: 20px;
        left: 10px;

        border-bottom:
            2px solid #f2464d;

        border-left:
            2px solid #f2464d;
    }

    .bottom-right {
        bottom: 20px;
        right: 10px;

        border-bottom:
            2px solid #f2464d;

        border-right:
            2px solid #f2464d;
    }

    /* ========================================
       LOGO LABEL
    ======================================== */

    .logo-label {
        display: flex;

        justify-content: space-between;

        font-size: 9px;

        letter-spacing: 0.18em;

        color: #687387;

        margin-bottom: 25px;
    }

    /* ========================================
       TITLE
    ======================================== */

    .title-wrapper {
        text-align: center;

        user-select: none;
    }

    .title-line {
        display: flex;

        justify-content: center;
        align-items: center;

        gap: 10px;
    }

    .title-main {
        font-size:
            clamp(48px, 15vw, 90px);

        line-height: 0.9;

        letter-spacing:
            0.2em;

        color: #f2f4f8;

        text-shadow:
            0 0 20px
            rgba(255,255,255,0.08);

        animation:
            title-reveal
            1.1s
            0.45s
            both;
    }

    .title-small {
        color: #3c83ed;

        font-size: 13px;

        opacity: 0.8;
    }

    .title-middle {
        margin-top: 12px;

        font-size: 13px;

        font-weight: bold;

        letter-spacing:
            0.55em;

        padding-left:
            0.55em;

        color: #7f8a9c;
    }

    .title-space {
        margin-top: 4px;

        font-size:
            clamp(44px, 14vw, 82px);

        line-height: 0.9;

        letter-spacing:
            0.2em;

        color: #3c83ed;

        text-shadow:
            0 0 18px
            rgba(60, 131, 237, 0.18);

        animation:
            space-reveal
            1.2s
            0.65s
            both;
    }

    /* ========================================
    LOGO GLITCH
    ======================================== */

    .glitch-text {
        position: relative;
        display: inline-block;

        animation:
            title-glitch 4s
            steps(1, end)
            infinite;
    }

    /*
    Die beiden Ebenen werden aus demselben
    Text erzeugt und während des Glitches
    leicht verschoben.
    */

    .glitch-text::before,
    .glitch-text::after {
        content: attr(data-text);

        position: absolute;

        left: 0;
        top: 0;

        width: 100%;
        height: 100%;

        pointer-events: none;

        opacity: 0;
    }

    /* BLUE CHANNEL */

    .glitch-text::before {
        color: #3c83ed;

        text-shadow:
            2px 0 #3c83ed,
            -2px 0 #3c83ed;

        animation:
            glitch-blue 4s
            steps(1, end)
            infinite;
    }

    /* RED / ORANGE CHANNEL */

    .glitch-text::after {
        color: #f2464d;

        text-shadow:
            -2px 0 #f2464d,
            2px 0 #ff9f1a;

        animation:
            glitch-red 4s
            steps(1, end)
            infinite;
    }

    .glitch-space::before,
    .glitch-space::after,
    .glitch-space {
        animation-delay: 0.1s;
    }

    @keyframes title-glitch {

        0%,
        86%,
        100% {
            transform: translate(0, 0);
        }

        87% {
            transform: translate(-1px, 0);
        }

        88% {
            transform: translate(2px, 0);
        }

        89% {
            transform: translate(-1px, 1px);
        }

        90% {
            transform: translate(0, 0);
        }
    }


    /* ========================================
    BLUE GLITCH
    ======================================== */

    @keyframes glitch-blue {

        0%,
        86%,
        100% {
            opacity: 0;

            transform:
                translate(0, 0);
            
            clip-path:
                inset(0 0 100% 0);
        }

        /* tiny digital flicker */

        87% {
            opacity: 0.7;

            transform:
                translate(-3px, 0);

            clip-path:
                inset(18% 0 67% 0);
        }

        88% {
            opacity: 0;

            transform:
                translate(4px, 0);

            clip-path:
                inset(52% 0 30% 0);
        }

        89% {
            opacity: 0.8;

            transform:
                translate(-2px, 1px);

            clip-path:
                inset(72% 0 14% 0);
        }

        90% {
            opacity: 0;

            transform:
                translate(0, 0);

            clip-path:
                inset(0 0 100% 0);
        }
    }


    /* ========================================
    RED / ORANGE GLITCH
    ======================================== */

    @keyframes glitch-red {

        0%,
        87%,
        100% {
            opacity: 0;

            transform:
                translate(0, 0);

            clip-path:
                inset(0 0 100% 0);
        }

        88% {
            opacity: 0.7;

            transform:
                translate(3px, 0);

            clip-path:
                inset(35% 0 48% 0);
        }

        89% {
            opacity: 0.85;

            transform:
                translate(5px, -1px);

            clip-path:
                inset(62% 0 23% 0);
        }

        90% {
            opacity: 0;

            transform:
                translate(-3px, 1px);

            clip-path:
                inset(10% 0 78% 0);
        }

        91% {
            opacity: 0.5;

            transform:
                translate(2px, 0);

            clip-path:
                inset(78% 0 8% 0);
        }

        92% {
            opacity: 0;

            transform:
                translate(0, 0);

            clip-path:
                inset(0 0 100% 0);
        }
    }

    /* ========================================
       LOGO DIVIDER
    ======================================== */

    .logo-divider {
        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        margin:
            25px
            0
            16px;
    }

    .logo-divider span {
        height: 1px;

        flex: 1;

        max-width: 100px;

        background:
            #334055;
    }

    .logo-divider b {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background:
            #f2464d;

        box-shadow:
            0 0 10px
            rgba(242,70,77,0.45);
    }

    /* ========================================
       TAGLINE
    ======================================== */

    .tagline {
        text-align: center;

        font-size: 8px;

        letter-spacing:
            0.14em;

        color: #657084;
    }

    /* ========================================
       SYSTEM INFO
    ======================================== */

    .system-info {
        width: 100%;
        max-width: 500px;

        margin-top: 32px;

        display: flex;
        flex-direction: column;

        gap: 9px;

        animation:
            fade-up
            1s
            1.1s
            both;
    }

    .info-row {
        display: grid;

        grid-template-columns:
            58px
            1fr
            45px;

        align-items: center;

        gap: 9px;

        font-size: 8px;

        color: #697486;
    }

    .info-row > span:last-child {
        text-align: right;
    }

    .info-bar {
        height: 5px;

        overflow: hidden;

        border-radius: 10px;

        background:
            #1d2737;
    }

    .fill {
        width: 100%;
        height: 100%;

        border-radius: inherit;

        transform-origin: left;

        animation:
            bar-fill
            1.2s
            1.3s
            both;
    }

    .red {
        background: #ef4444;
    }

    .blue {
        background: #3b82f6;
    }

    .green {
        background: #22c55e;
    }

    .orange {
        background: #f59e0b;
    }

    /* ========================================
       LAUNCH AREA
    ======================================== */

    .launch {
        position: absolute;

        left: 22px;
        right: 22px;

        bottom:
            max(8vh, 70px);

        display: flex;
        flex-direction: column;

        align-items: center;

        opacity: 0;

        transform:
            translateY(15px);

        transition:
            opacity 0.7s ease,
            transform 0.7s ease;
    }

    .launch.ready {
        opacity: 1;

        transform:
            translateY(0);
    }

    /* ========================================
       LAUNCH HEADER
    ======================================== */

    .launch-header {
        width: 100%;
        max-width: 400px;

        display: flex;

        align-items: center;

        gap: 10px;

        color: #5f6b7e;

        font-size: 8px;

        letter-spacing:
            0.15em;
    }

    .launch-header .line {
        height: 1px;

        flex: 1;

        background:
            #283345;
    }

    /* ========================================
       LAUNCH BUTTON
    ======================================== */

    .launch-button {
        width: 100%;
        max-width: 430px;

        min-height: 75px;

        margin-top: 10px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 14px;

        border:
            2px solid
            #344156;

        background:
            #111a2a;

        box-shadow:
            0 8px 25px
            rgba(0,0,0,0.3);

        transition:
            transform 0.15s,
            border-color 0.15s,
            background 0.15s;
    }

    .launch-button:active {
        transform:
            scale(0.97);

        background:
            #18243a;

        border-color:
            #3c83ed;
    }

    .button-side {
        color: #3c83ed;

        font-size: 20px;

        opacity: 0.65;
    }

    .button-content {
        text-align: center;

        flex: 1;
    }

    .press {
        font-size:
            clamp(12px, 3.5vw, 16px);

        font-weight: bold;

        letter-spacing:
            0.18em;

        padding-left:
            0.18em;

        color: #f0f2f6;

        animation:
            launch-pulse
            1.6s
            ease-in-out
            infinite;
    }

    .launch-text {
        margin-top: 7px;

        font-size: 9px;

        letter-spacing:
            0.35em;

        padding-left:
            0.35em;

        color: #3c83ed;
    }

    .tap-hint {
        margin-top: 12px;

        font-size: 7px;

        letter-spacing:
            0.14em;

        color: #4f5a6c;
    }

    /* ========================================
       BOTTOM BAR
    ======================================== */

    .bottom-bar {
        position: absolute;

        bottom:
            max(18px, env(safe-area-inset-bottom));

        left: 22px;
        right: 22px;

        display: flex;

        justify-content: space-between;

        font-size: 7px;

        letter-spacing:
            0.1em;

        color: #434d5e;
    }

    .bottom-bar span:last-child {
        display: flex;

        align-items: center;

        gap: 5px;

        color: #536175;
    }

    .green-dot {
        width: 5px;
        height: 5px;

        border-radius: 50%;

        background: #31c879;
    }

    /* ========================================
       LAUNCH EFFECT
    ======================================== */

    .launch-overlay {
        position: absolute;
        inset: 0;

        z-index: 100;

        pointer-events: none;

        background: white;

        opacity: 0;
    }

    .launching .launch-overlay {
        animation:
            launch-flash
            0.7s
            ease-out
            forwards;
    }

    .launching .screen {
        animation:
            launch-away
            0.7s
            ease-in
            forwards;
    }

    /* ========================================
       ANIMATIONS
    ======================================== */

    @keyframes splash-in {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes screen-enter {
        from {
            opacity: 0;

            transform:
                translateY(15px);
        }

        to {
            opacity: 1;

            transform:
                translateY(0);
        }
    }

    @keyframes panel-enter {
        from {
            opacity: 0;

            transform:
                translateY(20px)
                scale(0.97);
        }

        to {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);
        }
    }

    @keyframes title-reveal {
        from {
            opacity: 0;

            letter-spacing:
                0.35em;

            transform:
                translateY(8px);
        }

        to {
            opacity: 1;

            letter-spacing:
                0.08em;

            transform:
                translateY(0);
        }
    }

    @keyframes space-reveal {
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

    @keyframes fade-up {
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

    @keyframes bar-fill {
        from {
            transform:
                scaleX(0);
        }

        to {
            transform:
                scaleX(1);
        }
    }

    @keyframes twinkle {
        0%, 100% {
            opacity: 0.1;
        }

        50% {
            opacity: 0.5;
        }
    }

    @keyframes blink {
        0%, 100% {
            opacity: 0.3;
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes launch-pulse {
        0%, 100% {
            opacity: 0.65;
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes launch-flash {
        0% {
            opacity: 0;
        }

        12% {
            opacity: 0.8;
        }

        35% {
            opacity: 0;
        }

        100% {
            opacity: 0;
        }
    }

    @keyframes launch-away {
        0% {
            transform:
                scale(1);

            opacity: 1;
        }

        100% {
            transform:
                scale(1.08);

            opacity: 0;
        }
    }

    /* ========================================
       SMALL PHONES
    ======================================== */

    @media (max-height: 700px) {

        .logo-panel {
            margin-top: 8vh;

            padding:
                25px
                15px
                22px;
        }

        .system-info {
            margin-top: 20px;
        }

        .launch {
            bottom: 55px;
        }
    }

    /* ========================================
       VERY NARROW PHONES
    ======================================== */

    @media (max-width: 350px) {

        .logo-panel {
            margin-top: 10vh;
        }

        .title-main {
            font-size: 45px;
        }

        .title-space {
            font-size: 41px;
        }

        .tagline {
            font-size: 7px;
        }

        .system-info {
            margin-top: 22px;
        }

        .bottom-bar {
            font-size: 6px;
        }
    }

    /* ========================================
       REDUCED MOTION
    ======================================== */

    @media (prefers-reduced-motion: reduce) {

        *,
        *::before,
        *::after {
            animation-duration:
                0.01ms !important;

            animation-iteration-count:
                1 !important;
        }
    }

`}</style>

        </div>
    );
}