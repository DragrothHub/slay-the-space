import { useState } from "react";
import { createShip } from "./data/createShip";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./selections/ShipSelection";
import { useGameState } from "./state/GameStateProvider";
import { moduleCollection } from "./data/modules";
import ModuleCard from "./components/ModuleCard";
import Selection from "./selections/Selection";

function App()
{

  const { gameState, setScreen } = useGameState();

  return (
    <>
      {gameState.screen === "map" && (
        <WorldMap/>
      )}

      {gameState.screen === "shipselection" && (
        <ShipSelection
          ships={[
            createShip(),
            createShip(),
            createShip(),
            createShip(),
            createShip(),
          ]}
          maxSelections={2}
        />
      )}

      {gameState.screen === "moduleselection" && (
        <Selection
          items={[moduleCollection["module_defensive_armor"], moduleCollection["module_defensive_shield"]]}
          maxSelections={1}
          title="Choose a module"

          renderMini={({ item, toggle, selected }) => (
            <div
              onClick={toggle}
              style={{
                border: selected
                  ? "2px solid #fcff4c"
                  : "2px solid transparent",
                borderRadius: "10px",
                width: "370px",
              }}
            >
              <ModuleCard module={item} />
            </div>
          )}

          onConfirm={selectedModule => console.log(selectedModule)}
        />
      )}

      {gameState.screen === "battle" && (
        <BattleScreen/>
      )}
    </>
  );
}

export default App;