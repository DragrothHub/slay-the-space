import { debuffs, hasDebuff } from "../engine/debuffs";
import {
    getRemainingCooldown,
    isAbilityOnCooldown
} from "../engine/cooldowns";
import { abilityCollection } from "../data/abilities";

export default function AbilityCard({
    abilityId,
    actor,
    target,
    handleSelectAbility = () => { }
}) {
    const ability = abilityCollection[abilityId];

    const disabled = actor !== undefined
        ? isAbilityOnCooldown(actor, abilityId)
        : false;

    const detonates = ability.detonatesDebuff
        ? hasDebuff(target, ability.detonatesDebuff)
        : false;


    /*
     * ---------------------------------------------------------
     * Ability Type
     * ---------------------------------------------------------
     */

    const abilityType =
        ability.detonator
            ? "D"
            : ability.primer
                ? "P"
                : "N";


    /*
     * ---------------------------------------------------------
     * Damage Type
     * ---------------------------------------------------------
     */

    const damageType =
        ability.type === "kinetic"
            ? "K"
            : ability.type === "laser"
                ? "L"
                : null;


    /*
     * ---------------------------------------------------------
     * Debuff
     *
     * Bei einem Detonator zeigen wir den Debuff,
     * den er detoniert.
     *
     * Bei einem Primer den Debuff, den er anwendet.
     * ---------------------------------------------------------
     */

    const debuffId =
        ability.detonatesDebuff ||
        ability.appliesDebuff ||
        null;

    const debuff = debuffId
        ? debuffs[debuffId]
        : null;

    const debuffColor =
        debuff?.color || "#243342";


    /*
     * ---------------------------------------------------------
     * Cooldown
     * ---------------------------------------------------------
     */

    const cooldownProgress =
        disabled && ability.cooldown > 0
            ? getRemainingCooldown(actor, abilityId) / ability.cooldown
            : 0;


    return (
        <div
            onClick={() => {
                if (disabled)
                    return;

                handleSelectAbility(abilityId);
            }}
            title={ability.displayName}
            style={{
                all: "unset",

                position: "relative",

                width: 62,
                height: 62,

                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",

                borderRadius: "50%",

                background: "#0a1118",

                border: detonates
                    ? "3px solid #fcff4c"
                    : `2px solid ${debuffColor}`,

                boxSizing: "border-box",

                opacity: disabled ? 0.6 : 1,

                transition:
                    "transform .15s ease, box-shadow .15s ease",

                boxShadow: detonates
                    ? "0 0 12px rgba(252,255,76,.7)"
                    : `0 0 5px ${debuffColor}55`,
            }}
        >

            {/* =================================================
                DEBUFF RING
            ================================================= */}

            {debuff && (
                <div
                    style={{
                        position: "absolute",
                        inset: 5,

                        borderRadius: "50%",

                        border: `2px solid ${debuffColor}`,

                        opacity: 0.7,

                        pointerEvents: "none",
                    }}
                />
            )}


            {/* =================================================
                DAMAGE TYPE — oben links
            ================================================= */}

            {damageType && (
                <div
                    style={{
                        position: "absolute",

                        top: 7,
                        left: 8,

                        zIndex: 10,

                        color: "#9cb7ca",

                        fontSize: 9,
                        fontWeight: 800,

                        lineHeight: 1,

                        pointerEvents: "none",
                    }}
                >
                    {damageType}
                </div>
            )}


            {/* =================================================
                ABILITY TYPE — oben rechts
            ================================================= */}

            <div
                style={{
                    position: "absolute",

                    top: 7,
                    right: 8,

                    zIndex: 10,

                    color:
                        abilityType === "P"
                            ? "#63d8ff"
                            : abilityType === "D"
                                ? "#ffd45c"
                                : "#9cb7ca",

                    fontSize: 9,
                    fontWeight: 800,

                    lineHeight: 1,

                    pointerEvents: "none",
                }}
            >
                {abilityType}
            </div>


            {/* =================================================
                ABILITY ICON
            ================================================= */}

            <div
                style={{
                    position: "relative",
                    zIndex: 5,

                    width: 30,
                    height: 30,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    color: "white",

                    fontSize: 22,
                    fontWeight: 700,

                    pointerEvents: "none",
                }}
            >
                ✦
            </div>


            {/* =================================================
                DEBUFF INDICATOR
            ================================================= */}

            {debuff && (
                <div
                    style={{
                        position: "absolute",

                        bottom: 7,

                        zIndex: 10,

                        width: 8,
                        height: 8,

                        borderRadius: "50%",

                        background: debuffColor,

                        boxShadow:
                            `0 0 5px ${debuffColor}`,

                        pointerEvents: "none",
                    }}
                />
            )}


            {/* =================================================
                DETONATION AVAILABLE
            ================================================= */}

            {detonates && (
                <div
                    style={{
                        position: "absolute",
                        inset: -3,

                        borderRadius: "50%",

                        border: "2px solid #fcff4c",

                        pointerEvents: "none",

                        zIndex: 20,

                        animation:
                            "abilityDetonatorPulse 1.2s ease-in-out infinite",
                    }}
                />
            )}


            {/* =================================================
                COOLDOWN RING
            ================================================= */}

            {disabled && ability.cooldown > 0 && (
                <div
                    style={{
                        position: "absolute",

                        inset: -1,

                        borderRadius: "50%",

                        background: `
                            conic-gradient(
                                #5f6870 0deg,
                                #5f6870 ${cooldownProgress * 360}deg,
                                rgba(20, 28, 36, 0.15) ${cooldownProgress * 360}deg,
                                rgba(20, 28, 36, 0.15) 360deg
                            )
                        `,

                        pointerEvents: "none",

                        zIndex: 30,
                    }}
                />
            )}


            {/* =================================================
                COOLDOWN INNER CUTOUT
            ================================================= */}

            {disabled && ability.cooldown > 0 && (
                <div
                    style={{
                        position: "absolute",

                        inset: 4,

                        borderRadius: "50%",

                        background: "#0a1118",

                        pointerEvents: "none",

                        zIndex: 31,
                    }}
                />
            )}


            {/* =================================================
                COOLDOWN TEXT
            ================================================= */}

            {disabled && ability.cooldown > 0 && (
                <div
                    style={{
                        position: "absolute",

                        zIndex: 40,

                        color: "white",

                        fontSize: 11,
                        fontWeight: 800,

                        textShadow:
                            "0 1px 3px black",

                        pointerEvents: "none",
                    }}
                >
                    {Math.ceil(
                        getRemainingCooldown(actor, abilityId)
                    )}
                </div>
            )}

        </div>
    );
}