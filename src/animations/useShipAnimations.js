import { useEffect, useState } from "react";
import { debuffs } from "../engine/debuffs";
import { detonatorAbilityCollection } from "../data/abilities";

export default function useShipAnimations({
    unitId,
    damageEvents = [],
    animationEvents = [],
}) {
    const [damageFlash, setDamageFlash] = useState(null);
    const [detonationFlash, setDetonationFlash] = useState(null);
    const [mechanicFlash, setMechanicFlash] = useState(null);

    const [lastEventTime, setLastEventTime] = useState(null);
    const [lastAnimationTime, setLastAnimationTime] = useState(null);

    // Damage
    useEffect(() => {
        const event = damageEvents.find(
            e => e.targetId === unitId && e.timestamp > (lastEventTime ?? 0)
        );

        if (!event) return;

        setDamageFlash(event.amount);
        setLastEventTime(event.timestamp);
    }, [damageEvents]);

    useEffect(() => {
        if (damageFlash === null) return;

        const timeout = setTimeout(() => {
            setDamageFlash(null);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [damageFlash]);

    // Other animations
    useEffect(() => {
        const event = animationEvents.find(
            e => e.targetId === unitId && e.timestamp > (lastAnimationTime ?? 0)
        );

        if (!event) return;

        setLastAnimationTime(event.timestamp);

        if (event.detonatorId && detonatorAbilityCollection[event.detonatorId]) {
            const detonator = detonatorAbilityCollection[event.detonatorId];
            const debuff = debuffs[detonator.detonatesDebuff];

            setDetonationFlash(debuff.color);
        }

        if (event.mechanicId && debuffs[event.mechanicId]) {
            const mechanicEffect = debuffs[event.mechanicId];

            setMechanicFlash(mechanicEffect.color);
        }
    }, [animationEvents]);

    useEffect(() => {
        if (detonationFlash === null) return;

        const timeout = setTimeout(() => {
            setDetonationFlash(null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [detonationFlash]);

    useEffect(() => {
        if (mechanicFlash === null) return;

        const timeout = setTimeout(() => {
            setMechanicFlash(null);
        }, 500);

        return () => clearTimeout(timeout);
    }, [mechanicFlash]);

    return {
        damageFlash,
        detonationFlash,
        mechanicFlash,
    };
}