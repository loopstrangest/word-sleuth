import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import "../styles/GameplayMenu.css";
import { Star, Triangle } from "./SVGAssets";
import {
  isTutorialSetComplete,
  saveLastVisitedGroup,
  getLastVisitedGroup,
} from "../utils/progressUtils";
import PropTypes from "prop-types";

const GROUPS = {
  TUTORIAL: {
    id: "tutorial",
    image: "/src/assets/images/groupTitleBoxes/tutorial.png",
    sets: [1, 2, 3, 4],
    prefix: "0",
  },
  LETTERS: {
    id: "letters",
    image: "/src/assets/images/groupTitleBoxes/letters.png",
    sets: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9],
    prefix: "1",
  },
};

export default function GameplayMenu({
  onBack,
  onSetSelect,
  soundLevel,
  setSoundLevel,
}) {
  const [currentGroup, setCurrentGroup] = useState(() => {
    const lastGroup = getLastVisitedGroup();
    return lastGroup === GROUPS.LETTERS.id ? GROUPS.LETTERS : GROUPS.TUTORIAL;
  });
  const [completedSets, setCompletedSets] = useState([]);

  useEffect(() => {
    const updateProgress = () => {
      const newCompletedSets = [];
      // Check completion for both tutorial and letter sets
      currentGroup.sets.forEach((setNum) => {
        if (isTutorialSetComplete(setNum)) {
          newCompletedSets.push(setNum);
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
  }, [currentGroup]);

  const isSetEnabled = (setNumber) => {
    if (currentGroup.id === "tutorial") {
      // For tutorial sets, use integer comparison
      if (setNumber === 1) return true;
      return completedSets.includes(setNumber - 1);
    } else {
      // For letter sets, enable 1.1 by default, then require previous decimal to be completed
      if (setNumber === 1.1) return true;
      const prevSet = Math.round((setNumber - 0.1) * 10) / 10; // Handle floating point precision
      return completedSets.includes(prevSet);
    }
  };

  const isGroupComplete = () => {
    return completedSets.length === currentGroup.sets.length;
  };

  const handleNextGroup = () => {
    if (currentGroup.id === GROUPS.TUTORIAL.id && isGroupComplete()) {
      setCurrentGroup(GROUPS.LETTERS);
      saveLastVisitedGroup(GROUPS.LETTERS.id);
    }
  };

  const handlePrevGroup = () => {
    if (currentGroup.id === GROUPS.LETTERS.id) {
      setCurrentGroup(GROUPS.TUTORIAL);
      saveLastVisitedGroup(GROUPS.TUTORIAL.id);
    }
  };

  function handleSetClick(setNumber) {
    if (!isSetEnabled(setNumber)) return;
    const worldNumber = currentGroup.id === "tutorial" ? -setNumber : setNumber;
    onSetSelect(worldNumber);
  }

  const getGroupColors = () => {
    return currentGroup.id === "letters"
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
        hideStars={true}
        colorDark="var(--menuDark)"
      />

      <Box className="gameplay-content">
        <Box className="group-title-container">
          <Triangle
            className="navigation-button left"
            onClick={
              currentGroup.id === GROUPS.LETTERS.id
                ? handlePrevGroup
                : undefined
            }
            style={{
              pointerEvents:
                currentGroup.id === GROUPS.LETTERS.id ? "auto" : "none",
              opacity: currentGroup.id === GROUPS.LETTERS.id ? 1 : 0,
              fill: getGroupColors().dark,
              stroke: getGroupColors().dark,
            }}
          />

          <Box
            className="group-title-box"
            style={{ backgroundColor: getGroupColors().dark }}
          >
            <img
              src={currentGroup.image}
              alt={currentGroup.id}
              className="title-image"
            />
          </Box>

          <Triangle
            className="navigation-button right"
            onClick={
              currentGroup.id === GROUPS.TUTORIAL.id && isGroupComplete()
                ? handleNextGroup
                : undefined
            }
            style={{
              pointerEvents:
                currentGroup.id === GROUPS.TUTORIAL.id && isGroupComplete()
                  ? "auto"
                  : "none",
              opacity:
                currentGroup.id === GROUPS.TUTORIAL.id && isGroupComplete()
                  ? 1
                  : 0,
              fill: getGroupColors().dark,
              stroke: getGroupColors().dark,
            }}
          />
        </Box>

        <Box
          className={`level-sets-container ${currentGroup.id}`}
          style={{
            "--set-color-dark": getGroupColors().dark,
            "--set-color-light": getGroupColors().light,
            "--set-color-select": getGroupColors().select,
          }}
        >
          {currentGroup.sets.map((setNum) => {
            const enabled = isSetEnabled(setNum);
            return (
              <Box
                key={setNum}
                className={`level-set-box ${enabled ? "enabled" : "disabled"}`}
                onClick={() => handleSetClick(setNum)}
                style={{
                  backgroundColor: getGroupColors().light,
                  borderColor: getGroupColors().dark,
                  color: getGroupColors().dark,
                }}
              >
                {completedSets.includes(setNum) && (
                  <Star
                    className="level-set-star"
                    style={{ fill: getGroupColors().dark }}
                  />
                )}
                <span className="level-set-number">
                  {currentGroup.id === "tutorial"
                    ? `${currentGroup.prefix}.${setNum}`
                    : setNum}
                </span>
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
