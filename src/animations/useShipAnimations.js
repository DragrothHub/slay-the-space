import { useEffect, useRef, useState } from "react";
import { debuffs } from "../engine/debuffs";
import { detonatorAbilityCollection } from "../data/abilities";
import { scheduleAnimation } from "./animationScheduler";

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

    // ------------------------------------------------------------
    // Damage
    // ------------------------------------------------------------

    useEffect(() => {
        const events = damageEvents.filter(
            e =>
                e.targetId === unitId &&
                e.timestamp > (lastEventTime.current ?? 0)
        );

        if (events.length === 0) return;

        // Alle neuen Events als verarbeitet markieren.
        lastEventTime.current = Math.max(
            ...events.map(e => e.timestamp)
        );

        events.forEach(event => {
            scheduleAnimation(() => {
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
            });
        });
    }, [damageEvents, unitId]);

    // ------------------------------------------------------------
    // Other animations
    // ------------------------------------------------------------

    useEffect(() => {
        const events = animationEvents.filter(
            e =>
                e.targetId === unitId &&
                e.timestamp > (lastAnimationTime.current ?? 0)
        );

        if (events.length === 0) return;

        // Alle neuen Events als verarbeitet markieren.
        lastAnimationTime.current = Math.max(
            ...events.map(e => e.timestamp)
        );

        events.forEach(event => {
            scheduleAnimation(() => {
                // ------------------------------------------------
                // Detonation
                // ------------------------------------------------

                if (
                    event.detonatorId &&
                    detonatorAbilityCollection[event.detonatorId]
                ) {
                    const detonator =
                        detonatorAbilityCollection[event.detonatorId];

                    const debuff =
                        debuffs[detonator.detonatesDebuff];

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
                                prev.filter(
                                    flash => flash.id !== id
                                )
                            );
                        }, 500);
                    }
                }

                // ------------------------------------------------
                // Mechanic
                // ------------------------------------------------

                if (
                    event.mechanicId &&
                    debuffs[event.mechanicId]
                ) {
                    const mechanicEffect =
                        debuffs[event.mechanicId];

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
                            prev.filter(
                                flash => flash.id !== id
                            )
                        );
                    }, 500);
                }
            });
        });
    }, [animationEvents, unitId]);

    return {
        damageFlashes,
        detonationFlashes,
        mechanicFlashes,
    };
}