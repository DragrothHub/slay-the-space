import { useState } from "react";
import { createShip } from "./data/createShip";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./selections/ShipSelection";
import { useGameState } from "./state/GameStateProvider";
import { moduleCollection } from "./data/modules";
import ModuleCard from "./components/ModuleCard";
import Selection from "./selections/Selection";
import AbilityCard from "./components/AbilityCard";
import { detonatorAbilityCollection } from "./data/abilities";

function App()
{

  const { gameState, setScreen, startRun, updateShips } = useGameState();

  const ships = [
            createShip(),
            createShip(),
            createShip(),
            createShip(),
            createShip(),
          ];

  return (
    <>
      {gameState.screen === "map" && (
        <WorldMap/>
      )}

      {gameState.screen === "initialshipselection" && (
        <ShipSelection
          ships={ships}
          title="Choose 2 ships"
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
          title="Choose one ship"
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
          preselectedShips={gameState?.run?.ships?.slice(0, 4)}
          title="Your team can only have 4 ships"
          maxSelections={4}
          onConfirm={(selectedShips) => {
            updateShips(selectedShips);
            setScreen("map");
          }}
        />
      )}

      {gameState.screen === "moduleselection" && gameState.rewards?.rewardType === "module" && (
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

          onConfirm={selectedModule => { 
            console.log(selectedModule); 
            setScreen("map");
          }}
        />
      )}

      {gameState.screen === "collectReward" && gameState.rewards?.rewardType === "ability" && (
        <Selection
          items={Object.values(detonatorAbilityCollection)}
          maxSelections={1}
          title="Choose an ability"

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
              <AbilityCard abilityId={item.id} />
            </div>
          )}

          onConfirm={selectedAbility => {
            console.log(selectedAbility[0].id);
            setScreen("map");
          }}
        />
      )}

      {gameState.screen === "battle" && (
        <BattleScreen/>
      )}
    </>
  );
}

export default App;