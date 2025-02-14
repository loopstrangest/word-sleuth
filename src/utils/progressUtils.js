// src/utils/progressUtils.js
import { getData, setData as storeSetData } from "./storage";
import { WORLD_STRUCTURE } from "../data/worlds/worldStructure";

/**
 * Load the saved data for a given level.
 * @param {number} worldId - The world ID (e.g., 0 for tutorial)
 * @param {number} setId - The set ID within the world
 * @param {number} levelNum - The level number within the set
 */
export function loadLevelData(worldId, setId, levelNum) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
  };

  // Ensure nested structure exists
  if (!data.worlds[worldId]) {
    data.worlds[worldId] = {};
  }
  if (!data.worlds[worldId][setId]) {
    data.worlds[worldId][setId] = {};
  }

  // If this level doesn't have saved data yet, create a default entry
  if (!data.worlds[worldId][setId][levelNum]) {
    data.worlds[worldId][setId][levelNum] = {
      selectedWords: [],
      ruleStates: [],
      completed: false,
    };
  }

  // Persist any new structure
  localStorage.setItem("wordSleuthProgress", JSON.stringify(data));

  return data.worlds[worldId][setId][levelNum];
}

/**
 * Save partial or complete changes to a level's data.
 */
export function saveLevelData(worldId, setId, levelNum, newData) {
  const store = getData();
  if (!store.worlds) {
    store.worlds = {};
  }
  if (!store.worlds[worldId]) {
    store.worlds[worldId] = {};
  }
  if (!store.worlds[worldId][setId]) {
    store.worlds[worldId][setId] = {};
  }

  const existing = store.worlds[worldId][setId][levelNum] || {
    selectedWords: [],
    ruleStates: [],
    completed: false,
  };

  store.worlds[worldId][setId][levelNum] = {
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
 * @param {number} worldId - The world ID (e.g., 0 for tutorial)
 * @param {number} setId - The set ID within the world (e.g., 1 for first set)
 * @returns {boolean} Whether the set is completed
 */
export function isTutorialSetComplete(worldId, setId) {
  // Get total levels for this set from WORLD_STRUCTURE
  const worldInfo = WORLD_STRUCTURE[worldId];
  if (!worldInfo) return false;

  const setInfo = worldInfo.sets.find((set) => set.id === setId);
  if (!setInfo) return false;

  const totalLevels = setInfo.numLevels;

  // Retrieve stored data
  const store = getData();
  if (!store.worlds?.[worldId]?.[setId]) {
    return false;
  }

  // Check final level's completion
  const finalLevelData = store.worlds[worldId][setId][totalLevels];
  if (!finalLevelData?.completed) {
    return false;
  }

  return true;
}

/**
 * Return which level was last accessed in a specific world/set. Defaults to 1 if none saved.
 */
export function getLastAccessedLevel(worldId, setId) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
    lastAccessedLevels: {},
  };

  // Ensure nested structure exists
  if (!data.lastAccessedLevels) {
    data.lastAccessedLevels = {};
  }
  if (!data.lastAccessedLevels[worldId]) {
    data.lastAccessedLevels[worldId] = {};
  }

  return data.lastAccessedLevels[worldId][setId] || 1;
}

/**
 * Updates the last-accessed level for a given world/set.
 */
export function setLastAccessedLevel(worldId, setId, levelNum) {
  const data = JSON.parse(localStorage.getItem("wordSleuthProgress")) || {
    worlds: {},
    lastAccessedLevels: {},
  };

  // Ensure nested structure exists
  if (!data.lastAccessedLevels) {
    data.lastAccessedLevels = {};
  }
  if (!data.lastAccessedLevels[worldId]) {
    data.lastAccessedLevels[worldId] = {};
  }

  data.lastAccessedLevels[worldId][setId] = levelNum;
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

export function saveLastVisitedWorld(worldId) {
  localStorage.setItem("lastVisitedWorld", worldId);
}

export function getLastVisitedWorld() {
  return localStorage.getItem("lastVisitedWorld") || "tutorial";
}
