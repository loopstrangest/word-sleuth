// src/utils/progressUtils.js
import { getData, setData as storeSetData } from "./storage";
import {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
  worldOnePointOneLevels,
} from "../data/worldText";

/**
 * Load the saved data (selected words, rule states, completion) for a given tutorial set.
 * Uses negative worldNumbers for tutorial sets (-1, -2, -3, -4).
 */
export function loadLevelData(worldNumber, levelNumber) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
  };

  // Ensure worldNumber entry exists
  if (!data.worlds[worldNumber]) {
    data.worlds[worldNumber] = {};
  }

  // If this level doesn't have saved data yet, create a default entry
  if (!data.worlds[worldNumber][levelNumber]) {
    data.worlds[worldNumber][levelNumber] = {
      selectedWords: [],
      ruleStates: [],
      completed: false,
    };
  }

  // Persist any new worlds/levels structure
  localStorage.setItem("wordSleuthProgress", JSON.stringify(data));

  return data.worlds[worldNumber][levelNumber];
}

/**
 * Save partial or complete changes to a tutorial set's level data.
 */
export function saveLevelData(worldNumber, levelNumber, newData) {
  const store = getData();
  if (!store.worlds) {
    store.worlds = {};
  }
  if (!store.worlds[worldNumber]) {
    store.worlds[worldNumber] = {};
  }

  const existing = store.worlds[worldNumber][levelNumber] || {
    selectedWords: [],
    ruleStates: [],
    completed: false,
  };

  store.worlds[worldNumber][levelNumber] = {
    ...existing,
    ...newData,
  };

  setData(store);
}

/**
 * Return the user's main data object (creating defaults as needed).
 */
export function getUserProgress() {
  const data = getData();
  if (!data.lastAccessedLevels) {
    data.lastAccessedLevels = {};
  }
  setData(data);
  return data;
}

export function setData(data) {
  storeSetData(data);
}

/**
 * Checks if a set is fully completed.
 * For tutorial sets (1..4): Maps setNumber => negative worldNumber => checks final level's completion.
 * For letter sets (1.1..1.9): Uses the decimal number directly.
 */
export function isTutorialSetComplete(setNumber) {
  // For tutorial sets (integers 1-4)
  if (Number.isInteger(setNumber)) {
    // Convert setNumber (1..4) to negative worldNumber (-1..-4)
    const tutorialWorldNumber = -setNumber;

    // Figure out how many levels are in that set
    let totalLevels = 0;
    switch (setNumber) {
      case 1:
        totalLevels = tutorialSetOneLevels.length;
        break;
      case 2:
        totalLevels = tutorialSetTwoLevels.length;
        break;
      case 3:
        totalLevels = tutorialSetThreeLevels.length;
        break;
      case 4:
        totalLevels = tutorialSetFourLevels.length;
        break;
      default:
        return false;
    }

    // Retrieve stored data
    const store = getData();
    if (!store.worlds || !store.worlds[tutorialWorldNumber]) {
      return false;
    }

    // Check final level's completion
    const finalLevelData = store.worlds[tutorialWorldNumber][totalLevels];
    if (!finalLevelData || !finalLevelData.completed) {
      return false;
    }

    return true;
  }

  // For letter sets (decimals 1.1-1.9)
  else {
    // Get total levels for this set
    let totalLevels = 0;
    switch (setNumber) {
      case 1.1:
        totalLevels = worldOnePointOneLevels.length;
        break;
      default:
        return false;
    }

    // Retrieve stored data
    const store = getData();
    if (!store.worlds || !store.worlds[setNumber]) {
      return false;
    }

    // Check final level's completion
    const finalLevelData = store.worlds[setNumber][totalLevels];
    if (!finalLevelData || !finalLevelData.completed) {
      return false;
    }

    return true;
  }
}

/**
 * Return which level was last accessed in a specific tutorial set. Defaults to 1 if none saved.
 */
export function getLastAccessedLevel(worldNumber) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
  };

  if (
    data.lastAccessedLevels &&
    data.lastAccessedLevels[worldNumber] &&
    typeof data.lastAccessedLevels[worldNumber] === "number"
  ) {
    return data.lastAccessedLevels[worldNumber];
  }
  return 1;
}

/**
 * Updates the last-accessed level for a given tutorial set.
 */
export function setLastAccessedLevel(worldNumber, levelNumber) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
    lastAccessedLevels: {},
  };

  data.lastAccessedLevels[worldNumber] = levelNumber;
  localStorage.setItem("wordSleuthProgress", JSON.stringify(data));
}

/**
 * Returns the current sound level ("off", "low", or "high") from the store.
 */
export function getSoundLevel() {
  // Safely parse the progress store data
  let data = JSON.parse(localStorage.getItem("wordSleuthProgress"));
  // If data is null or not an object, initialize a new one
  if (!data || typeof data !== "object") {
    data = {};
  }
  // Ensure we have valid objects for worlds and globalState
  if (!data.worlds) {
    data.worlds = {};
  }
  if (!data.globalState) {
    data.globalState = {};
  }
  // Return the stored soundLevel or "low" if none is set
  return data.globalState.soundLevel || "low";
}

/**
 * Writes the sound level to the store.
 */
export function setSoundLevel(level) {
  // Safely parse the progress store data
  let data = JSON.parse(localStorage.getItem("wordSleuthProgress"));
  // If data is null or not an object, initialize a new one
  if (!data || typeof data !== "object") {
    data = {};
  }
  // Ensure we have valid objects for worlds and globalState
  if (!data.worlds) {
    data.worlds = {};
  }
  if (!data.globalState) {
    data.globalState = {};
  }
  // Set the new sound level
  data.globalState.soundLevel = level;
  localStorage.setItem("wordSleuthProgress", JSON.stringify(data));
}

export function saveLastVisitedGroup(groupId) {
  localStorage.setItem("lastVisitedGroup", groupId);
}

export function getLastVisitedGroup() {
  return localStorage.getItem("lastVisitedGroup") || "tutorial";
}
