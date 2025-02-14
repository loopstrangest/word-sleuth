import { useState, useEffect, useCallback, Fragment } from "react";
import { Box, Typography } from "@mui/material";
import "../styles/Level.css";
import { Triangle, Star, SubmitButton } from "./SVGAssets";
import TopBar from "./TopBar";
import { checkWorldRules, extractWords } from "../utils/rules";
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

  // ... rest of the component code until handleSubmit ...

  const handleSubmit = useCallback(() => {
    const chosenWords = selectedWords
      .map((i) => words[i])
      .filter((w) => typeof w === "string" && w.length > 0);

    const allWords = extractWords(text);
    const ruleResults = checkWorldRules(worldId, setId, chosenWords, allWords);
    const totalRules = ruleResults.filter(Boolean).length;

    // ... rest of handleSubmit unchanged ...
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

  // ... rest of the component code until hint words ...

  // For hint words, get them from setInfo
  const hintWords = setInfo?.hintWords?.[levelNum - 1]?.flat() || [];

  // ... rest of the component unchanged ...
}
