import { useState } from "react";
import { createShip } from "./data/createShip";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./selections/ShipSelection";
import { useGameState } from "./state/GameStateProvider";

function App()
{

  const { gameState, setScreen } = useGameState();

  const teamB = [
    createShip(),
    createShip(),
  ];

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

      {gameState.screen === "battle" && (
        <BattleScreen
          teamA={gameState.run.ships}
          teamB={teamB}
        />
      )}
    </>
  );
}

export default App;