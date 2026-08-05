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

  const { gameState, setScreen, startRun, updateShips } = useGameState();

  return (
    <>
      {gameState.screen === "map" && (
        <WorldMap/>
      )}

      {gameState.screen === "initialshipselection" && (
        <ShipSelection
          ships={[
            createShip(),
            createShip(),
            createShip(),
            createShip(),
            createShip(),
          ]}
          maxSelections={2}
          onConfirm={(selectedShips) => startRun(selectedShips, Math.floor(Math.random() * 1000))}
        />
      )}

      {gameState.screen === "dock" && (
        <ShipSelection
          ships={[
            createShip(),
            createShip(),
            createShip(),
          ]}
          maxSelections={1}
          onConfirm={(selectedShip) => {
            let ships = [...gameState.run.ships, selectedShip[0]];
            updateShips(ships);

            if(ships.length > 4)
            {
              setScreen("toomuchships");
            }
            else
            {
              setScreen("map");
            }
          }}
        />
      )}

      {gameState.screen === "toomuchships" && (
        <ShipSelection
          ships={gameState.run.ships}
          maxSelections={4}
          onConfirm={(selectedShips) => {
            updateShips(selectedShips);
            setScreen("map");
          }}
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