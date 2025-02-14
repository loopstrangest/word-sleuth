import { useState, useMemo, useEffect, useCallback } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import MainMenu from "./components/MainMenu";
import GameplayMenu from "./components/GameplayMenu";
import Level from "./components/Level";
import {
  getLastAccessedLevel,
  setLastAccessedLevel,
  getSoundLevel,
  setSoundLevel as saveSoundLevel,
} from "./utils/progressUtils";
import { WORLD_IDS } from "./utils/rules";
import {
  WORLD_STRUCTURE,
  getLevelInfo,
  getDisplayId,
} from "./data/worlds/worldStructure";
import "./styles/Level.css";

// Import world text files
import {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
} from "./data/worlds/worldZeroText.js";
import {
  worldOnePointOneLevels,
  worldOnePointTwoLevels,
  worldOnePointThreeLevels,
} from "./data/worlds/worldOneText.js";

/**
 * Returns the total number of levels for a given stage.
 * This is a pure utility function that doesn't rely on component state.
 */
function getTotalLevelsForStage(worldId) {
  const worldInfo = WORLD_STRUCTURE[worldId];
  if (!worldInfo) return 0;
  return worldInfo.sets[0].numLevels; // Assuming all sets in a world have same number of levels
}

function getLevelText(displayId) {
  const { worldId, setId, levelNum } = getLevelInfo(displayId);

  // Get the correct text based on worldId and setId
  let levelSet;
  if (worldId === 0) {
    switch (setId) {
      case 1:
        levelSet = tutorialSetOneLevels;
        break;
      case 2:
        levelSet = tutorialSetTwoLevels;
        break;
      case 3:
        levelSet = tutorialSetThreeLevels;
        break;
      case 4:
        levelSet = tutorialSetFourLevels;
        break;
      default:
        console.error(`No text found for tutorial set ${setId}`);
        return "";
    }
  } else if (worldId === 1) {
    switch (setId) {
      case 1:
        levelSet = worldOnePointOneLevels;
        break;
      case 2:
        levelSet = worldOnePointTwoLevels;
        break;
      case 3:
        levelSet = worldOnePointThreeLevels;
        break;
      default:
        console.error(`No text found for world ${worldId} set ${setId}`);
        return "";
    }
  } else {
    console.error(`No text found for world ${worldId}`);
    return "";
  }

  return levelSet.levelText[levelNum - 1] || "";
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("main"); // 'main', 'gameplay', 'level'
  const [soundLevel, setSoundLevel] = useState(() => getSoundLevel() || "low");
  const [currentDisplayId, setCurrentDisplayId] = useState(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handlePlay = () => {
    setView("gameplay");
  };

  const handleStageSelect = useCallback((displayId) => {
    const { worldId, setId } = getLevelInfo(displayId);
    const storedLevel = getLastAccessedLevel(worldId, setId) || 1;
    setCurrentDisplayId(getDisplayId(worldId, setId, storedLevel));
    setView("level");
  }, []);

  const handleLevelNav = (direction) => {
    if (!currentDisplayId) return;

    const { worldId, setId, levelNum } = getLevelInfo(currentDisplayId);
    const worldInfo = WORLD_STRUCTURE[worldId];
    const setInfo = worldInfo?.sets.find((set) => set.id === setId);
    if (!setInfo) return;

    const totalLevels = setInfo.numLevels;
    let newLevel = levelNum;

    if (direction === "next") {
      if (newLevel < totalLevels) {
        newLevel++;
        setCurrentDisplayId(getDisplayId(worldId, setId, newLevel));
        setLastAccessedLevel(worldId, setId, newLevel);
      } else {
        setView("gameplay");
      }
    } else if (direction === "prev") {
      if (newLevel > 1) {
        newLevel--;
        setCurrentDisplayId(getDisplayId(worldId, setId, newLevel));
        setLastAccessedLevel(worldId, setId, newLevel);
      }
    }
  };

  const handleGoBackToGameplay = () => {
    setView("gameplay");
  };

  const handleSetSoundLevel = (level) => {
    saveSoundLevel(level);
    setSoundLevel(level);
  };

  useEffect(() => {
    // Listen for the custom event to navigate to Star World
    const navigateListener = () => {
      // Instead of navigating to a separate Star World, handle it as World 4
      handleStageSelect(WORLD_IDS.TUTORIAL_FOUR);
    };
    window.addEventListener("navigateToStarWorld", navigateListener);

    return () => {
      window.removeEventListener("navigateToStarWorld", navigateListener);
    };
  }, [handleStageSelect]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {view === "main" && (
        <MainMenu
          onPlay={handlePlay}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          soundLevel={soundLevel}
          setSoundLevel={handleSetSoundLevel}
        />
      )}
      {view === "gameplay" && (
        <GameplayMenu
          onBack={() => setView("main")}
          onSetSelect={handleStageSelect}
          soundLevel={soundLevel}
          setSoundLevel={handleSetSoundLevel}
        />
      )}
      {view === "level" && currentDisplayId !== null && (
        <Level
          displayId={currentDisplayId}
          text={getLevelText(currentDisplayId)}
          totalLevels={getTotalLevelsForStage(
            getLevelInfo(currentDisplayId).worldId
          )}
          onNext={() => handleLevelNav("next")}
          onPrev={() => handleLevelNav("prev")}
          isLastLevel={
            getLevelInfo(currentDisplayId).levelNum ===
            getTotalLevelsForStage(getLevelInfo(currentDisplayId).worldId)
          }
          goBack={handleGoBackToGameplay}
          soundLevel={soundLevel}
          setSoundLevel={handleSetSoundLevel}
        />
      )}
    </ThemeProvider>
  );
}
