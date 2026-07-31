import { getTargetUnit, getEnemyUnits, getActiveUnit } from "../engine/helpers";
import { confirmAction, selectAbility } from "../engine/turnEngine";
import { abilityCollection } from "../data/abilities";
import { useState } from "react";
import AbilityInfoDialog from "./AbilityInfoDialog";
import AbilityCard from "./AbilityCard";
import { useGameState } from "../state/GameStateProvider";

export default function ActionPanel() {
    const [selectedAbilityInfo, setSelectedAbilityInfo] = useState(null);
    const { gameState, updateBattle } = useGameState();
    const battle = gameState.run?.battle;
    if (!battle) return null;
    const actor = getActiveUnit(battle);
    if (!actor) return null;

    function handleSelectAbility(abilityId) {
        updateBattle(prev => {
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

            {battle.phase === "select-ability" && (
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
                                    target={getTargetUnit(battle)} 
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