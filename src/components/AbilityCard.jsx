import React from "react";
import { debuffs, hasDebuffOfList } from "../engine/debuffs";
import { getRemainingCooldown, isAbilityOnCooldown } from "../engine/cooldowns";
import { abilityCollection } from "../data/abilities";
import { gradientFromDebuffList } from "../engine/helpers";

export default function AbilityCard({ abilityId, actor, target, withDescription = true, handleSelectAbility = () => { } }) {
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
                border: hasDebuffOfList(target, ability.detonatesDebuff)
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
                    {ability.primer || ability.detonator ? "" : ability.displayName}
                    {ability.primer &&
                        <span style={{
                            backgroundImage: gradientFromDebuffList(ability?.appliesDebuff),
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {ability.displayName}
                        </span>
                    }
                    {ability.detonator &&
                        <span style={{
                            backgroundImage: gradientFromDebuffList(ability?.detonatesDebuff),
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {ability.displayName}
                        </span>
                    }
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

                    {!ability.primer && !ability.detonator && (
                        <span>
                            Neutral
                        </span>
                    )}

                    {ability.primer && (
                        <span style={{ color: "#9cb7ca" }}>
                            Primer
                        </span>
                    )}

                    {ability.detonator && (
                        <span style={{ color: "#9cb7ca" }}>
                            Detonator
                        </span>
                    )}

                    {(ability.primer || ability.detonator) && <img
                        src={ability.icon}
                        style={{
                            width: 18,
                            height: 18,
                        }} />}
                </div>
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

                {ability.cooldown > 0 && (
                    <span>
                        CD {ability.cooldown}
                    </span>
                )}
            </div>

            {ability.appliesDebuff?.length > 0 && (
                <span>
                    Applies {formatDebuffList(ability.appliesDebuff)}
                </span>
            )}

            {ability.detonatesDebuff?.length > 0 && (
                <span>
                    Detonates {formatDebuffList(ability.detonatesDebuff)}
                </span>
            )}

            {ability.description && withDescription && (
                <span style={{ fontSize: 12, color: "#9cb7ca", }}>
                    {ability.description}
                </span>
            )}
        </div>
    );
}

function formatDebuffList(ids) {
    return ids.map((debuffId, index) => (
        <React.Fragment key={debuffId}>
            {index > 0 && (index === ids.length - 1 ? " and " : ", ")}
            <span style={{ color: debuffs[debuffId].color }}>
                {debuffs[debuffId].displayName}
            </span>
        </React.Fragment>
    ));
}