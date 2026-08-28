import { useState, useEffect } from "react";
import { createShip } from "./data/createShip";
import WorldMap from "./worldmap/components/WorldMap";
import BattleScreen from "./components/BattleScreen";
import ShipSelection from "./selections/ShipSelection";
import { useGameState } from "./state/GameStateProvider";
import ModuleCard from "./components/ModuleCard";
import Selection from "./selections/Selection";
import AbilityCard from "./components/AbilityCard";
import RepairScreen from "./components/RepairScreen";
import ShopScreen from "./components/ShopScreen";
import SplashScreen from "./components/SplashScreen";

function App() {
  const {
    gameState,
    setScreen,
    startRun,
    updateShips,
    collectRewards
  } = useGameState();

  const [showShipModal, setShowShipModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [ships] = useState(() => [
    createShip(),
    createShip(),
    createShip(),
    createShip(),
    createShip(),
  ]);
  const [dockShips, setDockShips] = useState([]);

  useEffect(() => {
    if (gameState.screen === "dock") {
      setDockShips([
        createShip(),
        createShip(),
        createShip(),
      ]);
    }
  }, [gameState.screen]);

  return (
    <>
      {showSplash && (
        <SplashScreen
          onFinished={() => setShowSplash(false)}
        />
      )}

      {gameState.screen === "map" && (
        <WorldMap />
      )}

      {gameState.screen === "initialshipselection" && !showSplash && (
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
          ships={dockShips}
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
          maxSelections={gameState.rewards.maxSelection}
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

      {gameState.screen === "repair" && (
        <RepairScreen />
      )}

      {gameState.screen === "shop" && (
        <ShopScreen />
      )}

      {/* Ship-Management Button */}
      {gameState?.run && <button
        onClick={() => {setShowShipModal(prev => !prev); console.log(gameState);}}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,

          height: "64px",
          width: "64px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          border: "1px solid #293242",
          borderRadius: "50%",
          background: "#111827",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        {showShipModal ? "▼" : "▲"}
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

            background: "rgba(0, 0, 0, 0.90)",
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