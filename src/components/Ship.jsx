import "./Ship.css";
import { useRef } from "react";
import { debuffs } from "../engine/debuffs";
import StatusEffect from "./StatusEffect";
import StatBarSmall from "./StatBarSmall";
import ShipAnimations from "../animations/ShipAnimations";
import useShipAnimations from "../animations/useShipAnimations";

export default function Ship({
    unit,
    damageEvents = [],
    animationEvents = [],
    isActive,
    isTargeted,
    isDead,
    onClick,
    reverse = false,
    onLongPress,
}) {

    const {damageFlash, detonationFlash, mechanicFlash,} = useShipAnimations({
        unitId: unit.id,
        damageEvents,
        animationEvents,
    });

    const borderColor = isDead
        ? "darkred"
        : isActive
            ? "#9ecbff"
            : isTargeted
                ? "#ef4444"
                : "transparent";

    const activeDebuffs = unit.stats?.debuffs ?? [];

    const longPressTimer = useRef(null);

    const handlePointerDown = () => {
        longPressTimer.current = setTimeout(() => {
            onLongPress?.(unit);
            longPressTimer.current = null;
        }, 500);
    };

    const handlePointerUp = () => {
        clearTimeout(longPressTimer.current);
    };

    const handlePointerLeave = () => {
        clearTimeout(longPressTimer.current);
    };

    const handlePointerCancel = () => {
        clearTimeout(longPressTimer.current);
    };

    return (
        <div
            style={{
                width: 80,
                height: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                opacity: isDead && !detonationFlash ? 0.35 : 1,
                position: "relative",
            }}
            onClick={onClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerCancel}
        >
            <div>
                <StatBarSmall
                    bigger={isTargeted || isActive}
                    value={unit.stats?.currentShield ?? 0}
                    max={unit.stats.maxShield ?? 0}
                    color="#3b82f6"
                />

                <StatBarSmall
                    bigger={isTargeted || isActive}
                    value={unit.stats?.currentArmor ?? 0}
                    max={unit.stats?.maxArmor ?? 0}
                    color="#f59e0b"
                />

                <StatBarSmall
                    bigger={isTargeted || isActive}
                    value={unit.stats?.currentHull ?? 0}
                    max={unit.stats?.maxHull ?? 0}
                    color="#ef4444"
                />

                <div style={{
                    transition: "width 0.2s, left 0.2s, top 0.2s, font-size 0.4s",
                    width: isTargeted || isActive ? 60 : 30,
                    marginTop: 0,
                    color: isTargeted ? "#ef4444" : isActive ? "rgb(158, 203, 255)" : "black",
                    position: "relative",
                    left: isTargeted || isActive ? 60 : 30,
                    top: isTargeted || isActive ? 45 : 30,
                    zIndex: 1,
                    fontSize: isTargeted || isActive ? "1em" : "0.0em",
                }}>{unit.name}</div>
            </div>

            <div
                style={{
                    position: "relative",
                    width: isTargeted || isActive ? 140 : 60,
                    height: isTargeted || isActive ? 140 : 60,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    transition: "width 0.25s ease, height 0.25s ease",
                }}
            >
                {(isTargeted || isActive) && (
                    <div
                        className="targetRingInner"
                        style={{
                            position: `absolute`,
                            borderLeft: `2px solid ${borderColor}`,
                            borderRight: `2px solid ${borderColor}`,
                            borderTop: "2px solid transparent",
                            borderBottom: "2px solid transparent",
                            animation: `rotateTargetReverse 10s linear infinite`,
                            inset: 30,
                            opacity: 0.6,
                            pointerEvents: `none`,
                            borderRadius: `50%`,
                        }}
                    />
                )}

                {(isTargeted || isActive) && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 22,

                            border: `2px solid ${borderColor}`,
                            borderRadius: "50%",

                            opacity: 0.6,

                            animation: "rotateTarget 8s linear infinite",

                            clipPath: `
                                    polygon(
                                        0% 20%,
                                        20% 20%,
                                        20% 0%,

                                        80% 0%,
                                        80% 20%,
                                        100% 20%,

                                        100% 80%,
                                        80% 80%,
                                        80% 100%,

                                        20% 100%,
                                        20% 80%,
                                        0% 80%
                                    )
                                `,
                        }}
                    />
                )}

                <img
                    src={unit.image}
                    style={{
                        width: isTargeted || isActive ? "140px" : "60px",

                        transform: reverse
                            ? "rotate(180deg)"
                            : "rotate(0deg)",

                        opacity: isTargeted || isActive ? 1 : 0.8,

                        transition: `
                                width 0.25s ease,
                                opacity 0.25s ease,
                                filter 0.25s ease
                            `,
                    }}
                />

                <ShipAnimations 
                    detonationFlash={detonationFlash} 
                    mechanicFlash={mechanicFlash}
                    damageFlash={damageFlash}
                />

                {/* Debuff Indicators */}
                {activeDebuffs.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: isTargeted || isActive ? -10 : -20,
                            display: "flex",
                            gap: 4,
                            borderRadius: 999,
                        }}
                    >
                        {activeDebuffs.map((debuff, index) => (
                            <StatusEffect
                                effect={debuffs[debuff.id]}
                                duration={debuff.duration}
                                isTargeted={isTargeted}
                                isActive={isActive} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}