import { useState } from "react";
import { createShip } from "./data/createShip";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./selections/ShipSelection";
import { useGameState } from "./state/GameStateProvider";
import ModuleCard from "./components/ModuleCard";
import Selection from "./selections/Selection";
import AbilityCard from "./components/AbilityCard";
import RepairScreen from "./components/RepairScreen";

function App()
{
  const {
    gameState,
    setScreen,
    startRun,
    updateShips,
    collectRewards
  } = useGameState();

  const [showShipModal, setShowShipModal] = useState(false);

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
        <WorldMap />
      )}

      {gameState.screen === "initialshipselection" && (
        <ShipSelection
          ships={ships}
          title="Choose 2 ships"
          maxSelections={2}
          onConfirm={(selectedShips) =>
            startRun(
              selectedShips,
              Math.floor(Math.random() * 1000)
            )
          }
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
            const ships = [
              ...gameState.run.ships,
              selectedShip[0]
            ];

            updateShips(ships);

            if (ships.length > 4) {
              setScreen("toomuchships");
            } else {
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

      {gameState.screen === "selectRewards" && (
        <Selection
          items={gameState.rewards.possibleRewards}
          maxSelections={gameState.rewards.maxSelections}
          title={`Choose an ${gameState.rewards.rewardType}`}

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
              {gameState.rewards?.rewardType === "ability" && (
                <AbilityCard abilityId={item.id} />
              )}

              {gameState.rewards?.rewardType === "module" && (
                <ModuleCard module={item} />
              )}
            </div>
          )}

          onConfirm={(selectedRewards) => {
            collectRewards({
              screen: "map",
              rewardType: gameState.rewards.rewardType,
              selectedRewards: selectedRewards.map(reward => reward.id),
            });
          }}
        />
      )}

      {gameState.screen === "battle" && (
        <BattleScreen />
      )}

      {gameState.screen === "repair" &&(
        <RepairScreen />
      )}

      {/* Ship-Management Button */}
      {gameState?.run && <button
        onClick={() => {setShowShipModal(!showShipModal); console.log(gameState);}}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 1000,

          height: "28px",
          width: "28px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          border: "1px solid #293242",
          borderRadius: "6px",
          background: "#111827",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        {showShipModal ? "▲" : "▼"}
      </button>}

      {/* Ship Selection Overlay */}
      {showShipModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,

            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",

            overflowY: "auto",

            background: "rgba(0, 0, 0, 0.75)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: "100%",
              maxWidth: "390px",

              display: "flex",
              justifyContent: "center",

              paddingTop: "45px",
              boxSizing: "border-box",
            }}
          >
            <ShipSelection
              ships={gameState.run.ships}
              preselectedShips={[]}
              title="Your Team"
              maxSelections={0}
              allowModuleChange={true} 
              allowAbilityChange={true}
              onConfirm={() => setShowShipModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;