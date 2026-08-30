import { useEffect, useRef, useState } from "react";

export default function ComboBox({
    items,
    value,
    onChange,

    renderItem,

    getId = item => item.id,

    renderSelected,
})
{
    const [open, setOpen] = useState(false);

    const ref = useRef(null);


    const selectedItem = items.find(
        item =>
            getId(item) === value
    );


    // --------------------------------
    // Click outside
    // --------------------------------

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


    // --------------------------------
    // Auswahl
    // --------------------------------

    function selectItem(item)
    {
        onChange?.(item);

        setOpen(false);
    }


    return (
        <>
            {/* ============================== */}
            {/* Overlay */}
            {/* ============================== */}

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


            {/* ============================== */}
            {/* ComboBox */}
            {/* ============================== */}

            <div
                ref={ref}

                style={{
                    position: "relative",
                    width: "100%",

                    zIndex:
                        open
                            ? 100
                            : 1,
                }}
            >

                {/* -------------------------- */}
                {/* Selected Item */}
                {/* -------------------------- */}

                <div
                    onClick={() =>
                        setOpen(
                            current => !current
                        )
                    }

                    style={{
                        position: "relative",

                        cursor: "pointer",

                        borderRadius: "10px",

                        border:
                            open
                                ? "2px solid #fcff4c"
                                : "2px solid transparent",

                        boxShadow:
                            open
                                ? "0 0 20px rgba(252,255,76,0.2)"
                                : "none",

                        transition:
                            "border 0.15s, box-shadow 0.15s",
                    }}
                >

                    {selectedItem && (
                        renderSelected
                            ? renderSelected(
                                selectedItem
                            )
                            : renderItem(
                                selectedItem
                            )
                    )}


                    {/* Arrow */}

                    <div
                        style={{
                            position: "absolute",

                            right: 10,
                            bottom: 10,

                            width: 28,
                            height: 28,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            border: "1px solid #293242",

                            borderRadius: "6px",

                            background:
                                "#111827",

                            color: "#fff",

                            fontSize: 16,

                            pointerEvents: "none",
                        }}
                    >
                        {open
                            ? "▲"
                            : "▼"}
                    </div>

                </div>


                {/* -------------------------- */}
                {/* Dropdown */}
                {/* -------------------------- */}

                {open && (
                    <div
                        style={{
                            position: "absolute",

                            zIndex: 101,

                            top:
                                "calc(100% + 6px)",

                            left: 0,
                            right: 0,

                            maxHeight: "400px",

                            overflowY: "auto",

                            padding: 4,

                            background:
                                "#101114",

                            border:
                                "1px solid #4b5563",

                            borderRadius: "10px",

                            boxShadow:
                                "0 15px 40px rgba(0,0,0,0.7)",
                        }}
                    >

                        {items.map(item =>
                        {
                            const id =
                                getId(item);

                            const isSelected =
                                selectedItem &&
                                getId(selectedItem) === id;

                            return (
                                <div
                                    key={id}

                                    onClick={() =>
                                        selectItem(item)
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
                                    {renderItem(item)}
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </>
    );
}