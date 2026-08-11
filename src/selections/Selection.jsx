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
        return Array.from(markedItems)?.some(
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

            if (current.length >= maxSelections) {

                // Bei Single-Selection: Auswahl ersetzen
                if (maxSelections === 1) {
                    return [item];
                }

                // Bei Multi-Selection: keine weitere Auswahl erlauben
                return current;
            }

            return [...current, item];
        });
    }

    // ---------------------
    // Detail
    // ---------------------

    if (openedItem && renderDetail)
    {

        return renderDetail({

            item: openedItem,

            selected: isSelected(openedItem),

            maxReached:
                selectedItems.length >= maxSelections,

            toggle: () => toggleItem(openedItem),

            close: () => setOpenedItem(null),

            selectedItems,
        });
    }

    // ---------------------
    // Übersicht
    // ---------------------

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {title && <div style={{fontSize: "1.5em"}}>{title}</div>}

            {items.map(item =>
                renderMini({

                    key: getId(item),

                    item,

                    selected: isSelected(item),

                    marked: isMarked(item),

                    open: renderDetail
                        ? () => setOpenedItem(item)
                        : undefined,

                    toggle: () => toggleItem(item),

                    maxReached:
                        selectedItems.length >= maxSelections,
                })
            )}

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