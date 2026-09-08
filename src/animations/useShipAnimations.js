import { useEffect, useRef, useState } from "react";
import { debuffs } from "../engine/debuffs";
import { detonatorAbilityCollection } from "../data/abilities";

export default function useShipAnimations({
    unitId,
    damageEvents = [],
    animationEvents = [],
}) {
    const [damageFlashes, setDamageFlashes] = useState([]);
    const [detonationFlashes, setDetonationFlashes] = useState([]);
    const [mechanicFlashes, setMechanicFlashes] = useState([]);

    const lastEventTime = useRef(null);
    const lastAnimationTime = useRef(null);

    // Damage
    useEffect(() => {
        const event = damageEvents.find(
            e =>
                e.targetId === unitId &&
                e.timestamp > (lastEventTime.current ?? 0)
        );

        if (!event) return;

        lastEventTime.current = event.timestamp;

        const id = crypto.randomUUID();

        setDamageFlashes(prev => [
            ...prev,
            {
                id,
                amount: event.amount,
            },
        ]);

        setTimeout(() => {
            setDamageFlashes(prev =>
                prev.filter(flash => flash.id !== id)
            );
        }, 1000);
    }, [damageEvents, unitId]);

    // Other animations
    useEffect(() => {
        const event = animationEvents.find(
            e =>
                e.targetId === unitId &&
                e.timestamp > (lastAnimationTime.current ?? 0)
        );

        if (!event) return;

        lastAnimationTime.current = event.timestamp;

        // Detonation
        if (
            event.detonatorId &&
            detonatorAbilityCollection[event.detonatorId]
        ) {
            const detonator =
                detonatorAbilityCollection[event.detonatorId];

            const debuff = debuffs[detonator.detonatesDebuff];

            if (debuff) {
                const id = crypto.randomUUID();

                setDetonationFlashes(prev => [
                    ...prev,
                    {
                        id,
                        color: debuff.color,
                    },
                ]);

                setTimeout(() => {
                    setDetonationFlashes(prev =>
                        prev.filter(flash => flash.id !== id)
                    );
                }, 500);
            }
        }

        // Mechanic
        if (event.mechanicId && debuffs[event.mechanicId]) {
            const mechanicEffect = debuffs[event.mechanicId];

            const id = crypto.randomUUID();

            setMechanicFlashes(prev => [
                ...prev,
                {
                    id,
                    color: mechanicEffect.color,
                },
            ]);

            setTimeout(() => {
                setMechanicFlashes(prev =>
                    prev.filter(flash => flash.id !== id)
                );
            }, 500);
        }
    }, [animationEvents, unitId]);

    return {
        damageFlashes,
        detonationFlashes,
        mechanicFlashes,
    };
}