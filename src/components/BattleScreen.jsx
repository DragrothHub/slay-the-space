import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import {
    createBattleState,
    startBattle,
    selectTarget,
} from "../engine/turnEngine";
import { getActiveUnit } from "../engine/helpers";
import { useGameState } from "../state/GameStateProvider";


export default function BattleScreen({ teamA, teamB }) {
    const [state, setState] = useState(null);

    const { setScreen } = useGameState();

    // INIT
    useEffect(() => {
        const initial = createBattleState(teamA, teamB);
        const started = startBattle(initial);

        setState(structuredClone(started));
    }, [teamA, teamB]);

    useEffect(() => {
        if (state?.winner) {
            setScreen("map");
        }
    }, [state?.winner]);

    if (!state) return <div>Loading...</div>;

    const activeUnit = getActiveUnit(state);

    function update(fn) {
        setState(prev => {
            const next = structuredClone(prev);
            return fn(next);
        });
    }
    
    function handleSelectTarget(target) {
        if(target.stats.currentHull <= 0)
            return;

        const targetIsInTeamA = state.teams.A.some(u => u.id === target.id);
        const sourceIsInTeamA = state.teams.A.some(u => u.id === activeUnit.id);

        if(targetIsInTeamA == sourceIsInTeamA)
            return;

        update(s => selectTarget(s, target.id));
    }

    return (
        <div className="battle-screen">
            <BattleField
                state={state}
                activeUnit={activeUnit}
                handleSelectTarget={handleSelectTarget}
            />

            <ActionPanel
                state={state}
                setState={setState}
            />

            <BattleLog log={state.log} />
        </div>
    );
}