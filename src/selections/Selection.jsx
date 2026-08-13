import { useState } from "react";

export default function Selection({
    items,
    markedItems,
    preselectedItems,
    maxSelections = 1,
    title,
    getId = item => item.id,
    renderMini,
    renderDetail,
    renderConfirm,
    onConfirm,
})
{

    const [selectedItems, setSelectedItems] = useState(preselectedItems ?? []);
    const [openedItem, setOpenedItem] = useState(null);

    function isSelected(item)
    {
        return selectedItems.some(
            i => getId(i) === getId(item)
        );
    }

    function isMarked(item)
    {
        return Array.from(markedItems ?? []).some(
            i => getId(i) === getId(item)
        );
    }

    function toggleItem(item)
    {
        setSelectedItems(current =>
        {
            const selected = current.some(
                i => getId(i) === getId(item)
            );

            if (selected)
            {
                return current.filter(
                    i => getId(i) !== getId(item)
                );
            }

            if (current.length >= maxSelections)
            {
                // Bei Single-Selection: Auswahl ersetzen
                if (maxSelections === 1)
                {
                    return [item];
                }

                // Bei Multi-Selection: keine weitere Auswahl erlauben
                return current;
            }

            return [...current, item];
        });
    }

    function openItem(item)
    {
        setOpenedItem(current =>
            current && getId(current) === getId(item)
                ? null
                : item
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >

            {title && (
                <div
                    style={{
                        fontSize: "1.5em",
                        marginBottom: "10px",
                    }}
                >
                    {title}
                </div>
            )}

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

                {items.map(item =>
                {
                    const id = getId(item);
                    const isOpen =
                        openedItem &&
                        getId(openedItem) === id;

                    return (
                        <div
                            key={id}
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >

                            {/* Mini Ansicht */}
                            {!isOpen && renderMini({

                                item,

                                selected: isSelected(item),

                                marked: isMarked(item),

                                open: renderDetail
                                    ? () => openItem(item)
                                    : undefined,

                                toggle: () => toggleItem(item),

                                maxReached:
                                    selectedItems.length >= maxSelections,

                            })}

                            {/* Detail Ansicht */}
                            {isOpen && renderDetail && (
                                <div
                                    style={{
                                        width: "100%",
                                        overflow: "hidden",
                                    }}
                                >
                                    {renderDetail({

                                        item: openedItem,

                                        selected:
                                            isSelected(openedItem),

                                        maxReached:
                                            selectedItems.length >=
                                            maxSelections,

                                        toggle:
                                            () =>
                                                toggleItem(openedItem),

                                        close:
                                            () =>
                                                setOpenedItem(null),

                                        selectedItems,

                                    })}
                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

            {/* Confirm */}
            {renderConfirm
                ? renderConfirm({

                    selectedItems,

                    maxSelections,

                    confirm: () =>
                        onConfirm?.(selectedItems),

                })
                : (

                    <button
                        style={{
                            width: "100%",
                            maxWidth: "370px",
                            height: "100px",
                            borderRadius: "10px",
                            background:
                                selectedItems.length !== maxSelections
                                    ? "#2a2b2e"
                                    : "linear-gradient(175deg,rgba(10, 17, 24, 1) 50%, rgba(252, 255, 76, 0.2) 100%)",
                            border: "1px solid #374151",
                            color:
                                selectedItems.length !== maxSelections
                                    ? "#fff"
                                    : "#fcff4c",
                            marginTop: "10px",
                            fontFamily: "monospace",
                        }}
                        disabled={
                            selectedItems.length !== maxSelections
                        }
                        onClick={() =>
                            onConfirm?.(selectedItems)
                        }
                    >
                        Confirm ({selectedItems.length}/{maxSelections})
                    </button>
                )}

        </div>
    );
}