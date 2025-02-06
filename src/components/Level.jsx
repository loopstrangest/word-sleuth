import { useState, useEffect, useCallback, Fragment } from "react";
import { Box, Typography } from "@mui/material";
import "../styles/Level.css";
import { Triangle, Star, SubmitButton } from "./SVGAssets";
import TopBar from "./TopBar";
import { checkWorldRules, extractWords, WORLD_IDS } from "../utils/rules";
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

const hintWordsTutorialSetOne = ["level", "racecar", "kayak", "did", "a"];
const hintWordsTutorialSetTwo = ["level", "that", "set's", "sometimes"];
const hintWordsTutorialSetThree = ["level", "required", "center"];
const hintWordsTutorialSetFour = [
  "final",
  "makes",
  "least",
  "means",
  "gamers",
  "valid",
];
const hintWordsWorldOne = [
  "love",
  "together",
  "flower",
  "grace",
  "radiate",
  "prosperity",
];
const hintWordsWorldTwo = [
  "talent",
  "knack",
  "excellence",
  "stairs",
  "high",
  "concern",
];
const hintWordsWorldThree = [
  "me",
  "love",
  "my",
  "ultimate",
  "follow",
  "infinite",
];
const hintWordsWorldFour = ["hey", "hi", "howdy"];
const hintWordsWorldOnePointOne = ["levels", "letters", "appears", "different"];

export default function Level({
  text,
  levelNumber,
  totalLevels,
  onNext,
  onPrev,
  isLastLevel,
  goBack,
  worldNumber,
  soundLevel,
  setSoundLevel,
}) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [ruleStates, setRuleStates] = useState([]);
  const [completed, setCompleted] = useState(false);

  // 1) Determine how many rules
  function getInitialRuleStates(wNum) {
    // If negative => tutorial sets
    switch (wNum) {
      case WORLD_IDS.TUTORIAL_ONE: // -1
      case WORLD_IDS.TUTORIAL_TWO: // -2
        return [false]; // 1 rule
      case WORLD_IDS.TUTORIAL_THREE: // -3
      case WORLD_IDS.TUTORIAL_FOUR: // -4
        return [false, false]; // 2 rules
      default:
        // main worlds
        switch (wNum) {
          case WORLD_IDS.WORLD_ONE_POINT_ONE: // 1.1
            return [false, false]; // 2 rules
          case WORLD_IDS.WORLD_TWO: // 2
            return [false, false];
          case WORLD_IDS.WORLD_THREE: // 3
            return [false, false];
          case WORLD_IDS.WORLD_FOUR: // 4
            return [false, false];
          default:
            return [false, false];
        }
    }
  }

  // 2) Min words required
  function getMinWordsRequired(wNum) {
    if (wNum < 0) {
      // tutorial
      if (wNum === WORLD_IDS.TUTORIAL_FOUR) {
        return 2; // tutorial set 4 => min 2 words
      } else {
        return 1; // sets -1, -2, -3 => min 1 word
      }
    } else {
      // main worlds
      return 2;
    }
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
    setLastAccessedLevel(worldNumber, levelNumber);
    const levelData = loadLevelData(worldNumber, levelNumber) || {};

    // Validate selected words
    const validSelectedWords = (levelData.selectedWords || []).filter(
      (idx) => idx >= 0 && idx < words.length
    );
    setSelectedWords(validSelectedWords);

    // Initialize or load rule states
    const initialRules = getInitialRuleStates(worldNumber);
    const savedRuleStates = levelData.ruleStates || initialRules;

    if (savedRuleStates.length !== initialRules.length) {
      /*console.warn(
        `Mismatch ruleStates length for worldNumber=${worldNumber}. Resetting.`
      );
      */
      setRuleStates(initialRules);
      saveLevelData(worldNumber, levelNumber, {
        ...levelData,
        ruleStates: initialRules,
      });
    } else {
      setRuleStates(savedRuleStates);
    }
    setCompleted(levelData.completed || false);
  }, [worldNumber, levelNumber, words.length]);

  // For color theming, if negative => use red variants
  const colorDark =
    worldNumber < 0
      ? "var(--redDark)"
      : worldNumber === WORLD_IDS.WORLD_TWO
      ? "var(--blueDark)"
      : worldNumber === WORLD_IDS.WORLD_THREE
      ? "var(--greenDark)"
      : worldNumber === WORLD_IDS.WORLD_FOUR
      ? "var(--grayDark)"
      : "var(--purpleDark)";

  const colorLight =
    worldNumber < 0
      ? "var(--redLight)"
      : worldNumber === WORLD_IDS.WORLD_TWO
      ? "var(--blueLight)"
      : worldNumber === WORLD_IDS.WORLD_THREE
      ? "var(--greenLight)"
      : worldNumber === WORLD_IDS.WORLD_FOUR
      ? "var(--grayLight)"
      : "var(--purpleLight)";

  const colorSelect =
    worldNumber < 0
      ? "var(--redSelect)"
      : worldNumber === WORLD_IDS.WORLD_TWO
      ? "var(--blueSelect)"
      : worldNumber === WORLD_IDS.WORLD_THREE
      ? "var(--greenSelect)"
      : worldNumber === WORLD_IDS.WORLD_FOUR
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
      saveLevelData(worldNumber, levelNumber, newData);
    },
    [worldNumber, levelNumber]
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

    const allWords = extractWords(text);
    const ruleResults = checkWorldRules(worldNumber, chosenWords, allWords);
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
    worldNumber,
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

  // Determine hint words
  let hintWords = [];
  if (worldNumber === WORLD_IDS.TUTORIAL_ONE) {
    if (levelNumber === 1) {
      hintWords = [hintWordsTutorialSetOne[0]];
    } else if (levelNumber === 2) {
      hintWords = [hintWordsTutorialSetOne[1]];
    } else if (levelNumber === 3) {
      hintWords = [hintWordsTutorialSetOne[2]];
    } else if (levelNumber === 4) {
      hintWords = [hintWordsTutorialSetOne[3]];
    } else if (levelNumber === 5) {
      hintWords = [hintWordsTutorialSetOne[4]];
    }
  } else if (worldNumber === WORLD_IDS.TUTORIAL_TWO) {
    if (levelNumber === 1) {
      hintWords = [hintWordsTutorialSetTwo[0]];
    } else if (levelNumber === 2) {
      hintWords = [hintWordsTutorialSetTwo[1]];
    } else if (levelNumber === 3) {
      hintWords = [hintWordsTutorialSetTwo[2]];
    } else if (levelNumber === 4) {
      hintWords = [hintWordsTutorialSetTwo[3]];
    }
  } else if (worldNumber === WORLD_IDS.TUTORIAL_THREE) {
    if (levelNumber === 1) {
      hintWords = [hintWordsTutorialSetThree[0]];
    } else if (levelNumber === 2) {
      hintWords = [hintWordsTutorialSetThree[1]];
    } else if (levelNumber === 3) {
      hintWords = [hintWordsTutorialSetThree[2]];
    }
  } else if (worldNumber === WORLD_IDS.TUTORIAL_FOUR) {
    if (levelNumber === 1) {
      hintWords = hintWordsTutorialSetFour.slice(0, 2);
    } else if (levelNumber === 2) {
      hintWords = hintWordsTutorialSetFour.slice(2, 4);
    } else if (levelNumber === 3) {
      hintWords = hintWordsTutorialSetFour.slice(4);
    }
  } else if (worldNumber === WORLD_IDS.WORLD_ONE) {
    switch (levelNumber) {
      case 1:
        hintWords = hintWordsWorldOne.slice(0, 2);
        break;
      case 2:
        hintWords = hintWordsWorldOne.slice(2, 4);
        break;
      case 3:
        hintWords = hintWordsWorldOne.slice(4, 6);
        break;
      default:
        hintWords = [];
    }
  } else if (worldNumber === WORLD_IDS.WORLD_TWO) {
    switch (levelNumber) {
      case 1:
        hintWords = hintWordsWorldTwo.slice(0, 2);
        break;
      case 2:
        hintWords = hintWordsWorldTwo.slice(2, 4);
        break;
      case 3:
        hintWords = hintWordsWorldTwo.slice(4, 6);
        break;
      default:
        hintWords = [];
    }
  } else if (worldNumber === WORLD_IDS.WORLD_THREE) {
    switch (levelNumber) {
      case 1:
        hintWords = hintWordsWorldThree.slice(0, 2);
        break;
      case 2:
        hintWords = hintWordsWorldThree.slice(2, 4);
        break;
      case 3:
        hintWords = hintWordsWorldThree.slice(4, 6);
        break;
      default:
        hintWords = [];
    }
  } else if (worldNumber === WORLD_IDS.WORLD_FOUR) {
    if (levelNumber === 1) {
      hintWords = hintWordsWorldFour;
    }
  } else if (worldNumber === WORLD_IDS.WORLD_ONE_POINT_ONE) {
    if (levelNumber === 1) {
      hintWords = hintWordsWorldOnePointOne.slice(0, 2);
    } else if (levelNumber === 2) {
      hintWords = hintWordsWorldOnePointOne.slice(2, 4);
    }
  }

  // Mapping between tokens and word indices
  let currentWordIndex = 0;
  const minWordsRequired = getMinWordsRequired(worldNumber);
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
      {/* TopBar container in a .level-topbar area */}
      <TopBar
        goBack={handleGoBack}
        soundLevel={soundLevel}
        setSoundLevel={setSoundLevel}
        colorDark={colorDark}
        hideStars={worldNumber < 0}
      />

      {/* Main content */}
      <Box className="level-main-content">
        <Box>
          <Triangle
            className="nav-icon"
            onClick={levelNumber > 1 ? onPrev : undefined}
            style={{
              cursor: levelNumber > 1 ? "pointer" : "default",
              fill: "var(--level-color-dark)",
              stroke: "var(--level-color-dark)",
              opacity: levelNumber > 1 ? 1 : 0,
              pointerEvents: levelNumber > 1 ? "auto" : "none",
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
              ? hintWords.includes(word.toLowerCase())
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
          {isLastLevel && levelNumber === totalLevels && (
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
  text: PropTypes.string.isRequired,
  levelNumber: PropTypes.number.isRequired,
  totalLevels: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  isLastLevel: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  worldNumber: PropTypes.number.isRequired,
  soundLevel: PropTypes.string.isRequired,
  setSoundLevel: PropTypes.func.isRequired,
};
