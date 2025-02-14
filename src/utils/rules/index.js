import { checkTutorialSetOneRules } from "./tutorialSetOneRules";
import { checkTutorialSetTwoRules } from "./tutorialSetTwoRules";
import { checkTutorialSetThreeRules } from "./tutorialSetThreeRules";
import { checkTutorialSetFourRules } from "./tutorialSetFourRules";
import { checkWorldOnePointOneRules } from "./worldOnePointOneRules";
import { checkWorldOnePointTwoRules } from "./worldOnePointTwoRules";
import { checkWorldOnePointThreeRules } from "./worldOnePointThreeRules";

// World IDs for easy reference
export const WORLD_IDS = {
  WORLD_ONE_POINT_ONE: 1.1,
  WORLD_ONE_POINT_TWO: 1.2,
  WORLD_ONE_POINT_THREE: 1.3,
};

/**
 * Check the rules for a given world and level.
 * @param {number} worldId - The world ID (e.g., 0 for tutorial)
 * @param {number} setId - The set ID within the world (e.g., 1 for first set)
 * @param {string[]} selectedWords - The player's selected words
 * @returns {boolean[]} Array representing the status of each rule
 */
export function checkWorldRules(worldId, setId, selectedWords) {
  // Ensure selectedWords is an array of strings
  if (!Array.isArray(selectedWords)) {
    console.error("selectedWords must be an array");
    return [false];
  }

  // Tutorial world (0)
  if (worldId === 0) {
    switch (setId) {
      case 1:
        return checkTutorialSetOneRules(selectedWords);
      case 2:
        return checkTutorialSetTwoRules(selectedWords);
      case 3:
        return checkTutorialSetThreeRules(selectedWords);
      case 4:
        return checkTutorialSetFourRules(selectedWords);
      default:
        console.warn(`No rule logic found for tutorial set ${setId}`);
        return [false];
    }
  }

  // Main worlds (1-9)
  if (worldId === 1) {
    switch (setId) {
      case 1:
        return checkWorldOnePointOneRules(selectedWords);
      case 2:
        return checkWorldOnePointTwoRules(selectedWords);
      case 3:
        return checkWorldOnePointThreeRules(selectedWords);
      default:
        console.warn(`No rule logic found for World ${worldId} set ${setId}`);
        return [false];
    }
  }

  console.warn(`No rule logic found for worldId=${worldId}`);
  return [false];
}

/**
 * Extract words from text by matching word boundaries (letters, underscores, apostrophes, or hyphens).
 * e.g. "don't" => ["don't"]
 */
export function extractWords(text) {
  return text.match(/\b\w+(?:['-]\w+)*\b/g) || [];
}
