import { useState, useMemo, useEffect, useCallback } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import MainMenu from "./components/MainMenu";
import GameplayMenu from "./components/GameplayMenu";
import Level from "./components/Level";
import {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
} from "./data/worldText";
import {
  getLastAccessedLevel,
  setLastAccessedLevel,
  getSoundLevel,
  setSoundLevel as saveSoundLevel,
} from "./utils/progressUtils";
import { WORLD_IDS } from "./utils/rules";
import "./styles/Level.css";

/**
 * Returns the total number of levels for a given stage.
 * This is a pure utility function that doesn't rely on component state.
 */
function getTotalLevelsForStage(stage) {
  switch (stage) {
    case WORLD_IDS.TUTORIAL_ONE:
      return tutorialSetOneLevels.length;
    case WORLD_IDS.TUTORIAL_TWO:
      return tutorialSetTwoLevels.length;
    case WORLD_IDS.TUTORIAL_THREE:
      return tutorialSetThreeLevels.length;
    case WORLD_IDS.TUTORIAL_FOUR:
      return tutorialSetFourLevels.length;
    default:
      return 1;
  }
}

/**
 * Clamps the given level (if invalid) into a valid range for the specified stage.
 * Also a pure utility function with no component-state dependencies.
 */
function clampLevel(stage, level) {
  const total = getTotalLevelsForStage(stage);
  if (!level || typeof level !== "number") level = 1;
  if (level < 1) level = 1;
  if (level > total) level = total;
  return level;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("main"); // 'main', 'gameplay', 'level'
  const [soundLevel, setSoundLevel] = useState(() => getSoundLevel() || "low");
  const [currentStage, setCurrentStage] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);

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

  const handleStageSelect = useCallback((stage) => {
    const storedLevel = getLastAccessedLevel(stage) || 1;
    const clampedLevel = clampLevel(stage, storedLevel);

    setCurrentStage(stage);
    setCurrentLevel(clampedLevel);
    setView("level");
  }, []);

  const handleLevelNav = (direction) => {
    let totalLevels = getTotalLevelsForStage(currentStage);
    let newLevel = currentLevel;

    if (direction === "next") {
      if (newLevel < totalLevels) {
        newLevel++;
        setCurrentLevel(newLevel);
        setLastAccessedLevel(currentStage, newLevel);
      } else {
        setView("gameplay");
      }
    } else if (direction === "prev") {
      if (newLevel > 1) {
        newLevel--;
        setCurrentLevel(newLevel);
        setLastAccessedLevel(currentStage, newLevel);
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
      {view === "level" && currentStage !== null && (
        <Level
          text={
            currentStage === WORLD_IDS.TUTORIAL_ONE
              ? tutorialSetOneLevels[currentLevel - 1]
              : currentStage === WORLD_IDS.TUTORIAL_TWO
              ? tutorialSetTwoLevels[currentLevel - 1]
              : currentStage === WORLD_IDS.TUTORIAL_THREE
              ? tutorialSetThreeLevels[currentLevel - 1]
              : currentStage === WORLD_IDS.TUTORIAL_FOUR
              ? tutorialSetFourLevels[currentLevel - 1]
              : ""
          }
          levelNumber={currentLevel}
          totalLevels={getTotalLevelsForStage(currentStage)}
          onNext={() => handleLevelNav("next")}
          onPrev={() => handleLevelNav("prev")}
          isLastLevel={currentLevel === getTotalLevelsForStage(currentStage)}
          goBack={handleGoBackToGameplay}
          worldNumber={currentStage}
          soundLevel={soundLevel}
          setSoundLevel={handleSetSoundLevel}
        />
      )}
    </ThemeProvider>
  );
}
