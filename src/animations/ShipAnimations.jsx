import Detonation from "../components/Detonation";
import MechanicAura from "../components/MechanicAura";

export default function ShipAnimations({
    detonationFlashes,
    mechanicFlashes,
    damageFlashes,
}) {
    return (
        <>
            {detonationFlashes.map(flash => (
                <Detonation key={flash.id} color={flash.color} />
            ))}

            {mechanicFlashes.map(flash => (
                <MechanicAura key={flash.id} color={flash.color} />
            ))}

            {damageFlashes.map(flash => (
                <div
                    key={flash.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        left: -30,
                        color: "#ef4444",
                        fontWeight: "bold",
                        fontSize: 24,
                        animation: "floatUp 2.5s ease-out",
                        pointerEvents: "none",
                    }}
                >
                    -{flash.amount}
                </div>
            ))}
        </>
    );
}