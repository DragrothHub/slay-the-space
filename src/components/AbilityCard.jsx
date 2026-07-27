import { debuffs, hasDebuff } from "../engine/debuffs";
import { getTargetUnit } from "../engine/helpers";
import { getRemainingCooldown, isAbilityOnCooldown } from "../engine/cooldowns";
import { abilityCollection } from "../data/abilities";

export default function AbilityCard({ abilityId, actor, target, handleSelectAbility = () => { } }) {
    const ability = abilityCollection[abilityId];
    const disabled = actor != undefined ? isAbilityOnCooldown(actor, abilityId) : false;

    return (
        <div
            onClick={() => {
                if (disabled)
                    return;
                handleSelectAbility(abilityId);
            }}
            style={{
                all: "unset",
                position: "relative",
                overflow: "hidden",
                cursor: disabled ? "not-allowed" : "default",
                border: hasDebuff(target, ability.detonatesDebuff)
                    ? "2px solid #fcff4c"
                    : "2px solid #243342",
                background: "#0a1118",
                borderRadius: 10,
                padding: 12,
                minHeight: 62,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                opacity: disabled ? 0.5 : 1,
            }}
        >

            {/* Cooldown Overlay */}
            {disabled && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: `${(getRemainingCooldown(actor, abilityId) / ability.cooldown) * 100
                            }%`,
                        background: "rgba(120,120,120,.45)",
                        transition: "width .25s ease",
                        pointerEvents: "none",
                    }}
                />
            )}

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 15,
                    }}
                >
                    {ability.displayName}
                </div>

                {/* <div
                    onClick={e => {
                        e.stopPropagation();
                        setSelectedAbilityInfo(ability);
                    }}
                    style={{
                        all: "unset",
                        cursor: "pointer",
                        color: "#8aa9c6",
                        fontWeight: "bold",
                        fontSize: 20,
                        padding: "0 4px",
                    }}
                >
                    ⓘ
                </div> */}
            </div>

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    gap: 10,
                    fontSize: 12,
                    color: "#9cb7ca",
                }}
            >
                <span>{ability.type}</span>
                {/* <img alt={ability.type} width={"10px"} height={"10px"} src="" /> */}

                {ability.primer && (
                    <span style={{ color: "#63d8ff" }}>
                        Primer
                    </span>
                )}

                {ability.detonator && (
                    <span style={{ color: "#ffd45c" }}>
                        Detonator
                    </span>
                )}

                {ability.cooldown > 0 && (
                    <span>
                        CD {ability.cooldown}
                    </span>
                )}
            </div>

            {ability.appliesDebuff && (
                <span style={{ color: `${debuffs[ability.appliesDebuff].color}` }}>
                    Applies {debuffs[ability.appliesDebuff].displayName}
                </span>
            )}

            {ability.detonatesDebuff && (
                <span style={{ color: `${debuffs[ability.detonatesDebuff].color}` }}>
                    Detonates {debuffs[ability.detonatesDebuff].displayName}
                </span>
            )}
        </div>
    );
}