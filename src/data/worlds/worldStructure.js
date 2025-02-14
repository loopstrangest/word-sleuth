import { isTutorialSetComplete } from "../../utils/progressUtils";

// World structure defining the hierarchy
export const WORLD_STRUCTURE = {
  // Tutorial World (0)
  0: {
    name: "Tutorial",
    sets: [
      {
        id: 1, // Internal ID for the set
        displayId: "0.1", // How it's displayed in UI
        numLevels: 5,
        rules: ["palindrome"],
        minWordsRequired: 1,
      },
      {
        id: 2,
        displayId: "0.2",
        numLevels: 5,
        rules: ["sameStartEnd"],
        minWordsRequired: 1,
      },
      {
        id: 3,
        displayId: "0.3",
        numLevels: 5,
        rules: ["secondLetterE", "secondLastLetterE"],
        minWordsRequired: 1,
      },
      {
        id: 4,
        displayId: "0.4",
        numLevels: 5,
        rules: ["hasLetterA", "twoVowels"],
        minWordsRequired: 2,
      },
    ],
  },
  // Letters World (1)
  1: {
    name: "Letters",
    sets: [
      {
        id: 1,
        displayId: "1.1",
        numLevels: 7,
        rules: ["doubleConsonant", "doubleVowel"],
        minWordsRequired: 2,
      },
      {
        id: 2,
        displayId: "1.2",
        numLevels: 7,
        rules: ["hasABC", "hasXYZ"],
        minWordsRequired: 2,
      },
      {
        id: 3,
        displayId: "1.3",
        numLevels: 7,
        rules: ["allVowelsOnce", "noRepeatedLetters"],
        minWordsRequired: 2,
      },
      // ... other sets for world 1
    ],
  },
  // ... other worlds 2-10
};

/**
 * Get the internal structure for a level based on its display ID (e.g. "0.1.3")
 * @param {string} displayId - The display ID in format "world.set.level" (e.g. "0.1.3")
 * @returns {{ worldId: number, setId: number, levelNum: number, setInfo: object }}
 */
export function getLevelInfo(displayId) {
  const [worldId, setId, levelNum] = displayId.split(".").map(Number);
  const worldInfo = WORLD_STRUCTURE[worldId];
  const setInfo = worldInfo?.sets.find((set) => set.id === setId);

  return {
    worldId,
    setId,
    levelNum,
    setInfo,
  };
}

/**
 * Convert internal IDs to display format
 * @param {number} worldId - The world number
 * @param {number} setId - The set number within the world
 * @param {number} levelNum - The level number within the set
 * @returns {string} Display ID in format "world.set.level" (e.g. "0.1.3")
 */
export function getDisplayId(worldId, setId, levelNum) {
  return `${worldId}.${setId}${levelNum ? `.${levelNum}` : ""}`;
}

/**
 * Check if a world is completed and can advance to the next world
 * @param {number} worldId - The world ID to check
 * @returns {boolean} Whether the world is completed
 */
export function isWorldCompleted(worldId) {
  const worldInfo = WORLD_STRUCTURE[worldId];
  if (!worldInfo) return false;

  // Get all completed sets for this world
  const completedSets = worldInfo.sets.filter((set) =>
    isTutorialSetComplete(worldId, set.id)
  ).length;

  // Tutorial world (0) requires all four sets
  if (worldId === 0) {
    return completedSets === 4;
  }

  // Other worlds require 5 out of 9 sets
  return completedSets >= 5;
}

/**
 * Check if a level set is unlocked
 * @param {number} worldId - The world ID (e.g., 0 for tutorial)
 * @param {number} setId - The set ID within the world (e.g., 1 for first set)
 * @returns {boolean} Whether the set is unlocked
 */
export function isLevelSetUnlocked(worldId, setId) {
  const worldInfo = WORLD_STRUCTURE[worldId];
  if (!worldInfo) return false;

  // First set of each world is always unlocked
  if (setId === 1) return true;

  // For tutorial world, sets must be completed in order
  if (worldId === 0) {
    return isTutorialSetComplete(worldId, setId - 1);
  }

  // For other worlds, first set must be completed to unlock others
  return isTutorialSetComplete(worldId, 1);
}

/**
 * Get all available level sets for a world
 */
export function getAvailableSets(worldId) {
  const worldInfo = WORLD_STRUCTURE[worldId];
  if (!worldInfo) return [];

  return worldInfo.sets
    .filter((set) => isLevelSetUnlocked(worldId, set.id))
    .map((set) => set.displayId);
}
