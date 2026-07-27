import { useState } from "react";
import { createShip } from "./data/createShip";
import ShipCard from "./components/ShipCard";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./shipselection/components/ShipSelection";
import { useGame } from "./state/useGame";

function App() {

  const teamB = [
    createShip(),
    createShip(),
  ];

  function handleSelection(ships) {
    startRun(ships);
  }

  const { game, startRun, setScreen } = useGame();

  return (
    <>
      {game.screen === "world" && (
        <WorldMap
          startBattle={() => {setScreen("battle"); console.log(JSON.stringify(game, null, 2))}}
        />
      )}

      {game.screen === "shipselection" && (
        <ShipSelection
          shipCount={5}
          maxSelections={2}
          onConfirm={handleSelection}
        />
      )}

      {game.screen === "battle" && (
        <BattleScreen
          teamA={game.run.ships}
          teamB={teamB}
          leaveBattle={() => setScreen("world")}
        />
      )}
    </>
  );
}

export default App;