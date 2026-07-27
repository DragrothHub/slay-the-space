import { getTargetUnit, getEnemyUnits, getActiveUnit } from "../engine/helpers";
import { confirmAction, selectAbility } from "../engine/turnEngine";
import { abilityCollection } from "../data/abilities";
import { useState } from "react";
import AbilityInfoDialog from "./AbilityInfoDialog";
import AbilityCard from "./AbilityCard";

export default function ActionPanel({ state, setState }) {
    const actor = getActiveUnit(state);
    const [selectedAbilityInfo, setSelectedAbilityInfo] = useState(null);

    if (!actor) return null;

    function handleSelectAbility(abilityId) {
        setState(prev => {
            const next = structuredClone(prev);

            const actor = getActiveUnit(next);

            const ability = actor.abilities.find(
                a => abilityCollection[a].id === abilityId
            );

            selectAbility(next, ability);
            confirmAction(next);

            return next;
        });
    }

    const enemies = getEnemyUnits(state, actor);

    return (
        <div
            style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 24,
            }}
        >
            {/* ========================= */}
            {/* ABILITIES */}
            {/* ========================= */}

            {state.phase === "select-ability" && (
                <div>
                    <h3
                        style={{
                            marginBottom: 12,
                            color: "#9ecbff",
                        }}
                    >
                        Choose Ability
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 12,
                        }}
                    >
                        {actor.abilities.map(a => {
                            return (
                                <AbilityCard 
                                    abilityId={a} 
                                    actor={actor} 
                                    target={getTargetUnit(state)} 
                                    handleSelectAbility={handleSelectAbility}/>
                            );
                        })}
                    </div>
                </div>
            )}

            <AbilityInfoDialog 
                ability={selectedAbilityInfo} 
                onClose={() => setSelectedAbilityInfo(null)}/>

        </div>
    );
}