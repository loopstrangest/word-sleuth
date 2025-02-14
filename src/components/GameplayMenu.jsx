import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import "../styles/GameplayMenu.css";
import { Star, Triangle } from "./SVGAssets";
import {
  isTutorialSetComplete,
  saveLastVisitedWorld,
  getLastVisitedWorld,
} from "../utils/progressUtils";
import {
  isLevelSetUnlocked,
  isWorldCompleted,
} from "../data/worlds/worldStructure";
import PropTypes from "prop-types";

const WORLDS = {
  TUTORIAL: {
    id: "tutorial",
    image: "/src/assets/images/worldTitleBoxes/tutorial.png",
    worldId: 0,
    sets: [
      { id: 1, displayId: "0.1" },
      { id: 2, displayId: "0.2" },
      { id: 3, displayId: "0.3" },
      { id: 4, displayId: "0.4" },
    ],
  },
  LETTERS: {
    id: "letters",
    image: "/src/assets/images/worldTitleBoxes/letters.png",
    worldId: 1,
    sets: [
      { id: 1, displayId: "1.1" },
      { id: 2, displayId: "1.2" },
      { id: 3, displayId: "1.3" },
      { id: 4, displayId: "1.4" },
      { id: 5, displayId: "1.5" },
      { id: 6, displayId: "1.6" },
      { id: 7, displayId: "1.7" },
      { id: 8, displayId: "1.8" },
      { id: 9, displayId: "1.9" },
    ],
  },
};

export default function GameplayMenu({
  onBack,
  onSetSelect,
  soundLevel,
  setSoundLevel,
}) {
  const [currentWorld, setCurrentWorld] = useState(() => {
    const lastWorld = getLastVisitedWorld();
    return lastWorld === WORLDS.LETTERS.id ? WORLDS.LETTERS : WORLDS.TUTORIAL;
  });
  const [completedSets, setCompletedSets] = useState([]);

  useEffect(() => {
    const updateProgress = () => {
      const newCompletedSets = [];

      // Check completion for all sets
      currentWorld.sets.forEach((set) => {
        if (isTutorialSetComplete(currentWorld.worldId, set.id)) {
          newCompletedSets.push(set.displayId);
        }
      });

      setCompletedSets(newCompletedSets);
    };

    updateProgress();
    // Listen for both tutorial and regular progress updates
    window.addEventListener("tutorialProgressUpdate", updateProgress);
    window.addEventListener("progressUpdate", updateProgress);

    return () => {
      window.removeEventListener("tutorialProgressUpdate", updateProgress);
      window.removeEventListener("progressUpdate", updateProgress);
    };
  }, [currentWorld]);

  const isSetEnabled = (setDisplayId) => {
    const set = currentWorld.sets.find((s) => s.displayId === setDisplayId);
    return isLevelSetUnlocked(currentWorld.worldId, set.id);
  };

  const isWorldComplete = () => {
    return isWorldCompleted(currentWorld.worldId);
  };

  const handleNextWorld = () => {
    if (currentWorld.id === WORLDS.TUTORIAL.id && isWorldComplete()) {
      setCurrentWorld(WORLDS.LETTERS);
      saveLastVisitedWorld(WORLDS.LETTERS.id);
    }
  };

  const handlePrevWorld = () => {
    if (currentWorld.id === WORLDS.LETTERS.id) {
      setCurrentWorld(WORLDS.TUTORIAL);
      saveLastVisitedWorld(WORLDS.TUTORIAL.id);
    }
  };

  function handleSetClick(setDisplayId) {
    if (!isSetEnabled(setDisplayId)) return;
    onSetSelect(setDisplayId);
  }

  const getWorldColors = () => {
    return currentWorld.id === "letters"
      ? {
          dark: "var(--purpleDark)",
          light: "var(--purpleLight)",
          select: "var(--purpleSelect)",
        }
      : {
          dark: "var(--redDark)",
          light: "var(--redLight)",
          select: "var(--redSelect)",
        };
  };

  return (
    <Box className="gameplay-menu-root">
      <TopBar
        goBack={onBack}
        soundLevel={soundLevel}
        setSoundLevel={setSoundLevel}
        colorDark="var(--menuDark)"
      />

      <Box className="gameplay-content">
        <Box className="world-title-container">
          <Triangle
            className="navigation-button left"
            onClick={
              currentWorld.id === WORLDS.LETTERS.id
                ? handlePrevWorld
                : undefined
            }
            style={{
              pointerEvents:
                currentWorld.id === WORLDS.LETTERS.id ? "auto" : "none",
              opacity: currentWorld.id === WORLDS.LETTERS.id ? 1 : 0,
              fill: getWorldColors().dark,
              stroke: getWorldColors().dark,
            }}
          />

          <Box
            className="world-title-box"
            style={{ backgroundColor: getWorldColors().dark }}
          >
            <img
              src={currentWorld.image}
              alt={currentWorld.id}
              className="title-image"
            />
          </Box>

          <Triangle
            className="navigation-button right"
            onClick={
              currentWorld.id === WORLDS.TUTORIAL.id && isWorldComplete()
                ? handleNextWorld
                : undefined
            }
            style={{
              pointerEvents:
                currentWorld.id === WORLDS.TUTORIAL.id && isWorldComplete()
                  ? "auto"
                  : "none",
              opacity:
                currentWorld.id === WORLDS.TUTORIAL.id && isWorldComplete()
                  ? 1
                  : 0,
              fill: getWorldColors().dark,
              stroke: getWorldColors().dark,
            }}
          />
        </Box>

        <Box
          className={`level-sets-container ${currentWorld.id}`}
          style={{
            "--set-color-dark": getWorldColors().dark,
            "--set-color-light": getWorldColors().light,
            "--set-color-select": getWorldColors().select,
          }}
        >
          {currentWorld.sets.map((set) => {
            const enabled = isSetEnabled(set.displayId);
            return (
              <Box
                key={set.displayId}
                className={`level-set-box ${enabled ? "enabled" : "disabled"}`}
                onClick={() => handleSetClick(set.displayId)}
                style={{
                  backgroundColor: getWorldColors().light,
                  borderColor: getWorldColors().dark,
                  color: getWorldColors().dark,
                }}
              >
                {completedSets.includes(set.displayId) && (
                  <Star
                    className="level-set-star"
                    style={{ fill: getWorldColors().dark }}
                  />
                )}
                <span className="level-set-number">{set.displayId}</span>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

GameplayMenu.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSetSelect: PropTypes.func.isRequired,
  soundLevel: PropTypes.string.isRequired,
  setSoundLevel: PropTypes.func.isRequired,
};
