import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import "../styles/GameplayMenu.css";
import { Star, Triangle } from "./SVGAssets";
import {
  isTutorialSetComplete,
  getLastAccessedLevel,
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
    sets: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
      if (currentGroup.id === "tutorial") {
        currentGroup.sets.forEach((setNum) => {
          if (isTutorialSetComplete(setNum)) {
            newCompletedSets.push(setNum);
          }
        });
      }
      setCompletedSets(newCompletedSets);
    };

    updateProgress();
    window.addEventListener("tutorialProgressUpdate", updateProgress);

    return () => {
      window.removeEventListener("tutorialProgressUpdate", updateProgress);
    };
  }, [currentGroup]);

  const isSetEnabled = (setNumber) => {
    if (setNumber === 1) return true;
    return completedSets.includes(setNumber - 1);
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
    const lastLevel = getLastAccessedLevel(worldNumber);
    onSetSelect(worldNumber, lastLevel);
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
                {currentGroup.id === "tutorial" &&
                  completedSets.includes(setNum) && (
                    <Star
                      className="level-set-star"
                      style={{ fill: getGroupColors().dark }}
                    />
                  )}
                <span className="level-set-number">
                  {currentGroup.prefix}.{setNum}
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
