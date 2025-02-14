import { useState, useEffect, useCallback, Fragment } from "react";
import { Box, Typography } from "@mui/material";
import "../styles/Level.css";
import { Triangle, Star, SubmitButton } from "./SVGAssets";
import TopBar from "./TopBar";
import { checkWorldRules } from "../utils/rules";
import {
  loadLevelData,
  saveLevelData,
  setLastAccessedLevel,
} from "../utils/progressUtils";
import failSound from "../assets/audio/failure.mp3";
import partialSound from "../assets/audio/partial.mp3";
import successSound from "../assets/audio/success.mp3";
import bigSuccessSound from "../assets/audio/bigSuccess.mp3";
import PropTypes from "prop-types";
import { dispatchEventCompat } from "../utils/dispatchEventCompat";
import { getLevelInfo } from "../data/worlds/worldStructure";
import {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
} from "../data/worlds/worldZeroText.js";
import {
  worldOnePointOneLevels,
  worldOnePointTwoLevels,
  worldOnePointThreeLevels,
} from "../data/worlds/worldOneText.js";

// Helper to get the correct level set data
function getLevelSetData(worldId, setId) {
  if (worldId === 0) {
    switch (setId) {
      case 1:
        return tutorialSetOneLevels;
      case 2:
        return tutorialSetTwoLevels;
      case 3:
        return tutorialSetThreeLevels;
      case 4:
        return tutorialSetFourLevels;
      default:
        return null;
    }
  } else if (worldId === 1) {
    switch (setId) {
      case 1:
        return worldOnePointOneLevels;
      case 2:
        return worldOnePointTwoLevels;
      case 3:
        return worldOnePointThreeLevels;
      default:
        return null;
    }
  }
  return null;
}

export default function Level({
  displayId,
  text,
  totalLevels,
  onNext,
  onPrev,
  isLastLevel,
  goBack,
  soundLevel,
  setSoundLevel,
}) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [ruleStates, setRuleStates] = useState([]);
  const [completed, setCompleted] = useState(false);

  // Get level info from the display ID
  const { worldId, setId, levelNum, setInfo } = getLevelInfo(displayId);

  // 1) Determine how many rules
  function getInitialRuleStates() {
    return Array(setInfo.rules.length).fill(false);
  }

  // 2) Min words required comes directly from set info
  function getMinWordsRequired() {
    return setInfo.minWordsRequired;
  }

  // Split text tokens ignoring punctuation
  const tokensWithPunc = text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((token) => {
      const match = token.match(
        /^([^A-Za-z]*)?([A-Za-z]+(?:[-'][A-Za-z]+)*'?)([^A-Za-z]*)?$/
      );
      if (match) {
        return {
          leftPunc: match[1] || "",
          word: match[2],
          rightPunc: match[3] || "",
        };
      } else {
        // If it doesn't contain letters, treat the entire token as punctuation
        return { leftPunc: "", word: null, rightPunc: token };
      }
    });

  const words = tokensWithPunc.map((tk) => tk.word).filter((w) => w !== null);

  // On mount or changes
  useEffect(() => {
    setLastAccessedLevel(worldId, setId, levelNum);
    const levelData = loadLevelData(worldId, setId, levelNum) || {};

    // Validate selected words
    const validSelectedWords = (levelData.selectedWords || []).filter(
      (idx) => idx >= 0 && idx < words.length
    );
    setSelectedWords(validSelectedWords);

    // Initialize or load rule states
    const initialRules = getInitialRuleStates();
    const savedRuleStates = levelData.ruleStates || initialRules;

    if (savedRuleStates.length !== initialRules.length) {
      setRuleStates(initialRules);
      saveLevelData(worldId, setId, levelNum, {
        ...levelData,
        ruleStates: initialRules,
      });
    } else {
      setRuleStates(savedRuleStates);
    }
    setCompleted(levelData.completed || false);
  }, [worldId, setId, levelNum, words.length]);

  // For color theming
  const colorDark =
    worldId === 0 // Tutorial world
      ? "var(--redDark)"
      : worldId === 2
      ? "var(--blueDark)"
      : worldId === 3
      ? "var(--greenDark)"
      : worldId === 4
      ? "var(--grayDark)"
      : "var(--purpleDark)";

  const colorLight =
    worldId === 0 // Tutorial world
      ? "var(--redLight)"
      : worldId === 2
      ? "var(--blueLight)"
      : worldId === 3
      ? "var(--greenLight)"
      : worldId === 4
      ? "var(--grayLight)"
      : "var(--purpleLight)";

  const colorSelect =
    worldId === 0 // Tutorial world
      ? "var(--redSelect)"
      : worldId === 2
      ? "var(--blueSelect)"
      : worldId === 3
      ? "var(--greenSelect)"
      : worldId === 4
      ? "var(--graySelect)"
      : "var(--purpleSelect)";

  const bgColor = colorLight;

  const updateLevelData = useCallback(
    (changes) => {
      const newData = {};
      if (changes.selectedWords !== undefined) {
        newData.selectedWords = changes.selectedWords;
      }
      if (changes.ruleStates !== undefined) {
        newData.ruleStates = changes.ruleStates;
      }
      if (changes.completed !== undefined) {
        newData.completed = changes.completed;
      }
      saveLevelData(worldId, setId, levelNum, newData);
    },
    [worldId, setId, levelNum]
  );

  // Volume helper
  function getVolume(level) {
    if (level === "off") return 0;
    switch (level) {
      case "low":
        return 0.5;
      case "high":
        return 1.0;
      default:
        return 0; // Default to muted if unknown state
    }
  }

  const handleSubmit = useCallback(() => {
    const chosenWords = selectedWords
      .map((i) => words[i])
      .filter((w) => typeof w === "string" && w.length > 0);

    const ruleResults = checkWorldRules(worldId, setId, chosenWords);
    const totalRules = ruleResults.filter(Boolean).length;

    // If soundLevel is "off", skip audio playback entirely.
    // Otherwise, set volume and play as needed.
    if (soundLevel !== "off") {
      const volume = getVolume(soundLevel);

      // Create audio objects
      const audioFail = new Audio(failSound);
      const audioPartial = new Audio(partialSound);
      const audioSuccess = new Audio(successSound);
      const audioBigSuccess = new Audio(bigSuccessSound);

      // Set volumes
      audioFail.volume = volume;
      audioPartial.volume = volume;
      audioSuccess.volume = volume;
      audioBigSuccess.volume = volume;

      // Evaluate success or partial
      if (isLastLevel && totalRules === ruleStates.length) {
        audioBigSuccess.play().catch(() => {});
      } else if (totalRules === 0) {
        audioFail.play().catch(() => {});
      } else if (totalRules < ruleStates.length) {
        audioPartial.play().catch(() => {});
      } else {
        audioSuccess.play().catch(() => {});
      }
    }

    // Update rule states
    let newRuleStates;
    if (isLastLevel) {
      if (totalRules === ruleStates.length) {
        newRuleStates = Array(ruleStates.length).fill(true);
        setCompleted(true);
        updateLevelData({ completed: true });
      } else {
        newRuleStates = Array(ruleStates.length).fill(false);
      }
      setRuleStates(newRuleStates);
      updateLevelData({ ruleStates: newRuleStates });
    } else {
      newRuleStates = ruleResults.slice(0, ruleStates.length);
      setRuleStates(newRuleStates);
      updateLevelData({ ruleStates: newRuleStates });
      if (totalRules === ruleStates.length) {
        setCompleted(true);
        updateLevelData({ completed: true });
      }
    }

    dispatchEventCompat("progressUpdate");
  }, [
    selectedWords,
    ruleStates,
    isLastLevel,
    soundLevel,
    worldId,
    setId,
    words,
    text,
    updateLevelData,
  ]);

  const toggleWord = (idx) => {
    if (idx < 0 || idx >= words.length) {
      console.error(`Invalid word index: ${idx}`);
      return;
    }
    let newSelected;
    if (selectedWords.includes(idx)) {
      newSelected = selectedWords.filter((i) => i !== idx);
    } else {
      newSelected = [...selectedWords, idx];
    }
    setSelectedWords(newSelected);
    updateLevelData({ selectedWords: newSelected });
    dispatchEventCompat("progressUpdate");
  };

  // For hint words, use levelNum - 1 directly as the index
  const levelSet = getLevelSetData(worldId, setId);
  const hintWords = levelSet?.hintWords?.[levelNum - 1]?.flat() || [];

  // Mapping between tokens and word indices
  let currentWordIndex = 0;
  const minWordsRequired = getMinWordsRequired();
  const isSubmitEnabled = selectedWords.length >= minWordsRequired;

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Space" && isSubmitEnabled) {
        event.preventDefault(); // Prevent page scroll
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSubmitEnabled, handleSubmit]); // Re-attach listener when submit state changes

  useEffect(() => {
    dispatchEventCompat("tutorialProgressUpdate");
  }, []);

  return (
    <Box
      className="root-level"
      style={{
        backgroundColor: bgColor,
        "--level-color-dark": colorDark,
        "--level-color-light": colorLight,
        "--level-color-select": colorSelect,
      }}
    >
      <TopBar
        goBack={handleGoBack}
        soundLevel={soundLevel}
        setSoundLevel={setSoundLevel}
        colorDark={colorDark}
        displayId={displayId} // Pass the full display ID to show in top bar
      />

      {/* Main content */}
      <Box className="level-main-content">
        <Box>
          <Triangle
            className="nav-icon"
            onClick={levelNum > 1 ? onPrev : undefined}
            style={{
              cursor: levelNum > 1 ? "pointer" : "default",
              fill: "var(--level-color-dark)",
              stroke: "var(--level-color-dark)",
              opacity: levelNum > 1 ? 1 : 0,
              pointerEvents: levelNum > 1 ? "auto" : "none",
            }}
          />
        </Box>

        <Typography variant="h5" className="level-text">
          {tokensWithPunc.map(({ leftPunc, word, rightPunc }, i) => {
            let isSelected = false;
            let wordIdx = null;

            if (word !== null) {
              wordIdx = currentWordIndex;
              isSelected = selectedWords.includes(wordIdx);
              currentWordIndex++;
            }

            const isHint = word
              ? hintWords.some(
                  (hint) => hint.toLowerCase() === word.toLowerCase()
                )
              : false;

            const classes = ["word"];
            if (isSelected) classes.push("word-selected");
            if (isHint) classes.push("word-hint");

            return (
              <Fragment key={i}>
                {leftPunc && <span className="punctuation">{leftPunc}</span>}
                {word !== null && (
                  <span
                    onClick={() => toggleWord(wordIdx)}
                    className={classes.join(" ")}
                  >
                    {word}
                  </span>
                )}
                <span className="punctuation">{rightPunc}</span>{" "}
              </Fragment>
            );
          })}
        </Typography>

        <Box>
          {!isLastLevel && (
            <Triangle
              className="nav-icon"
              onClick={onNext}
              style={{
                cursor: "pointer",
                fill: completed ? "var(--level-color-dark)" : "none",
                stroke: "var(--level-color-dark)",
                transform: "rotate(180deg)",
              }}
            />
          )}
          {isLastLevel && levelNum === totalLevels && (
            <Star
              className="nav-icon"
              style={{
                cursor: completed ? "pointer" : "default",
                fill: completed ? "var(--level-color-dark)" : "none",
                stroke: "var(--level-color-dark)",
                transform: "scaleX(-1)",
                pointerEvents: completed ? "auto" : "none",
              }}
              onClick={completed ? goBack : undefined}
            />
          )}
        </Box>
      </Box>

      {/* Footer content */}
      <Box className="level-footer-content">
        <Box
          className="submit-button"
          sx={
            isSubmitEnabled
              ? {
                  opacity: 1,
                  cursor: "pointer",
                }
              : {
                  opacity: 0.33,
                  cursor: "default",
                }
          }
        >
          <SubmitButton
            onClick={isSubmitEnabled ? handleSubmit : undefined}
            style={{
              fill: "var(--level-color-dark)",
              cursor: isSubmitEnabled ? "pointer" : "default",
              width: "75px",
              marginBottom: "8px",
            }}
          />
        </Box>

        {/* If NOT the last level, we show rule circles */}
        {!isLastLevel && ruleStates && (
          <Box className="level-rule-circles">
            {ruleStates.map((r, i) => (
              <span
                key={i}
                className={`level-circle ${r ? "level-circle-filled" : ""}`}
                style={{
                  borderColor: "var(--level-color-dark)",
                }}
              />
            ))}
          </Box>
        )}

        {/* If the last level, we show a single ellipse */}
        {isLastLevel && ruleStates && (
          <Box>
            <Box
              className={`level-ellipse ${
                ruleStates.every(Boolean) ? "level-ellipse-filled" : ""
              }`}
              style={{
                borderColor: "var(--level-color-dark)",
                backgroundColor: ruleStates.every(Boolean)
                  ? "var(--level-color-dark)"
                  : "transparent",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

Level.propTypes = {
  displayId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  totalLevels: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  isLastLevel: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  soundLevel: PropTypes.string.isRequired,
  setSoundLevel: PropTypes.func.isRequired,
};
