import { useState } from "react";
import { createShip } from "./data/createShip";
import ShipCard from "./components/ShipCard";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./shipselection/components/ShipSelection";
import { useGameState } from "./state/GameStateProvider";

function App() {
  
  const { gameState, startRun, setScreen } = useGameState();

  const teamB = [
    createShip(),
    createShip(),
  ];

  function handleSelection(ships) {
    startRun(ships, 1);
  }

  return (
    <>
      {gameState.screen === "world" && (
        <WorldMap
          startBattle={() => {setScreen("battle"); console.log(JSON.stringify(gameState, null, 2))}}
        />
      )}

      {gameState.screen === "shipselection" && (
        <ShipSelection
          shipCount={5}
          maxSelections={2}
          onConfirm={handleSelection}
        />
      )}

      {gameState.screen === "battle" && (
        <BattleScreen
          teamA={gameState.run.ships}
          teamB={teamB}
          leaveBattle={() => setScreen("world")}
        />
      )}
    </>
  );
}

export default App;