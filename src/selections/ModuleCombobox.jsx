import { useEffect, useRef, useState } from "react";
import ModuleCard from "../components/ModuleCard";

export default function ModuleComboBox({
    modules,
    value,
    onChange,
})
{
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selectedModule = modules.find(
        module => module.id === value
    );


    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (
                ref.current &&
                !ref.current.contains(event.target)
            )
            {
                setOpen(false);
            }
        }

        if (open)
        {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () =>
        {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [open]);


    function selectModule(module)
    {
        onChange(module);
        setOpen(false);
    }


    return (
        <>
            {/* -------------------------------- */}
            {/* Overlay */}
            {/* -------------------------------- */}

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,

                        background:
                            "rgba(0, 0, 0, 0.55)",

                        zIndex: 90,
                    }}
                />
            )}


            {/* -------------------------------- */}
            {/* ComboBox */}
            {/* -------------------------------- */}

            <div
                ref={ref}
                style={{
                    position: "relative",
                    width: "100%",
                    zIndex: open ? 100 : 1,
                }}
            >

                {/* Aktuelles Modul */}

                <div
                    onClick={() =>
                        setOpen(current => !current)
                    }

                    style={{
                        cursor: "pointer",

                        position: "relative",

                        borderRadius: "10px",

                        // Fokus-Rahmen
                        border: open
                            ? "2px solid #fcff4c"
                            : "2px solid transparent",

                        boxShadow: open
                            ? "0 0 20px rgba(252,255,76,0.2)"
                            : "none",

                        transition:
                            "border 0.15s, box-shadow 0.15s",
                    }}
                >
                    {selectedModule && (
                        <ModuleCard
                            module={selectedModule}
                        />
                    )}

                    {/* Pfeil */}

                    <div
                        style={{
                            position: "absolute",
                            right: 10,
                            top: 10,

                            width: 28,
                            height: 28,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: "6px",

                            background:
                                "rgba(0,0,0,0.65)",

                            color: "#fff",

                            fontSize: 16,

                            pointerEvents: "none",
                        }}
                    >
                        {open ? "▲" : "▼"}
                    </div>
                </div>


                {/* -------------------------------- */}
                {/* Dropdown */}
                {/* -------------------------------- */}

                {open && (
                    <div
                        style={{
                            position: "absolute",

                            zIndex: 101,

                            top: "calc(100% + 6px)",
                            left: 0,
                            right: 0,

                            maxHeight: "400px",

                            overflowY: "auto",

                            padding: 4,

                            background: "#101114",

                            border:
                                "1px solid #4b5563",

                            borderRadius: "10px",

                            boxShadow:
                                "0 15px 40px rgba(0,0,0,0.7)",
                        }}
                    >

                        {modules.map(module =>
                        {
                            const isSelected =
                                module.id === value;

                            return (
                                <div
                                    key={module.id}

                                    onClick={() =>
                                        selectModule(module)
                                    }

                                    style={{
                                        cursor: "pointer",

                                        marginBottom: 4,

                                        borderRadius: "8px",

                                        border:
                                            isSelected
                                                ? "2px solid #fcff4c"
                                                : "2px solid transparent",

                                        opacity:
                                            isSelected
                                                ? 1
                                                : 0.9,
                                    }}
                                >
                                    <ModuleCard
                                        module={module}
                                    />
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </>
    );
}