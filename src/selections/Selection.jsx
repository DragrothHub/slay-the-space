import { useState } from "react";

export default function Selection({
    sections,
    title,
    getId = item => item.id,
    renderMini,
    renderDetail,
    renderConfirm,
    onConfirm,
}) {

    const [selectedItems, setSelectedItems] = useState(() =>
        sections
            .filter(section => section.initialSelected)
            .flatMap(section => section.items ?? [])
    );

    const [openedItem, setOpenedItem] = useState(null);


    function isSelected(item) {

        return selectedItems.some(
            i => getId(i) === getId(item)
        );
    }


    function getSectionOfItem(item) {

        return sections.find(section =>
            (section.items ?? []).some(
                i => getId(i) === getId(item)
            )
        );
    }


    function getSelectedInSection(
        section,
        selection = selectedItems
    ) {

        return selection.filter(selected =>
            (section.items ?? []).some(
                item => getId(item) === getId(selected)
            )
        );
    }


    function canToggleItem(item) {

        const section = getSectionOfItem(item);

        if (!section) {
            return false;
        }


        const selected = isSelected(item);

        const sectionSelected =
            getSelectedInSection(section);


        // -------------------------
        // Abwählen
        // -------------------------

        if (selected) {

            const minSelections =
                section.minSelections ?? 0;


            return sectionSelected.length > minSelections;
        }


        // -------------------------
        // Auswählen
        // -------------------------

        const maxSelections =
            section.maxSelections ??
            (section.items ?? []).length;


        return sectionSelected.length < maxSelections;
    }


    function toggleItem(item) {

        if (!canToggleItem(item)) {
            return;
        }


        setSelectedItems(current => {

            const selected = current.some(
                i => getId(i) === getId(item)
            );


            if (selected) {

                return current.filter(
                    i => getId(i) !== getId(item)
                );
            }


            return [
                ...current,
                item
            ];
        });
    }


    function canConfirm() {

        return sections.every(section => {

            const count =
                getSelectedInSection(section).length;


            const min =
                section.minSelections ?? 0;


            const max =
                section.maxSelections ??
                (section.items ?? []).length;


            return count >= min && count <= max;
        });
    }


    // ---------------------
    // Detail
    // ---------------------

    if (openedItem && renderDetail) {

        return renderDetail({

            item: openedItem,

            selected: isSelected(openedItem),

            toggle: () =>
                toggleItem(openedItem),

            close: () =>
                setOpenedItem(null),

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

            {title &&
                <div
                    style={{
                        fontSize: "1.5em",
                    }}
                >
                    {title}
                </div>
            }


            {sections.map((section, index) => (

                <div
                    key={section.title ?? index}
                    style={{
                        width: "100%",
                    }}
                >

                    {section.title &&
                        <div
                            style={{
                                fontSize: "1.2em",
                                marginTop: 15,
                                marginBottom: 5,
                            }}
                        >
                            {section.title}
                        </div>
                    }


                    {(section.items ?? []).map(item => (

                        <div
                            key={getId(item)}
                        >

                            {renderMini({

                                item,

                                selected:
                                    isSelected(item),

                                open:
                                    renderDetail
                                        ? () =>
                                            setOpenedItem(item)
                                        : () =>
                                            toggleItem(item),

                                toggle:
                                    () =>
                                        toggleItem(item),

                                disabled:
                                    !canToggleItem(item),

                            })}

                        </div>

                    ))}

                </div>

            ))}



            {renderConfirm

                ? renderConfirm({

                    selectedItems,

                    canConfirm:
                        canConfirm(),

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
                                canConfirm()
                                    ? "linear-gradient(175deg,rgba(10,17,24,1) 50%, rgba(252,255,76,.2) 100%)"
                                    : "#2a2b2e",
                            border:
                                "1px solid #374151",
                            color:
                                canConfirm()
                                    ? "#fcff4c"
                                    : "#fff",
                            marginTop: "10px",
                            fontFamily: "monospace",
                        }}
                        disabled={!canConfirm()}
                        onClick={() =>
                            onConfirm?.(selectedItems)
                        }
                    >
                        Confirm ({selectedItems.length})
                    </button>

                )}

        </div>
    );
}