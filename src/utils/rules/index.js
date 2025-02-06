import { checkTutorialSetOneRules } from "./tutorialSetOneRules";
import { checkTutorialSetTwoRules } from "./tutorialSetTwoRules";
import { checkTutorialSetThreeRules } from "./tutorialSetThreeRules";
import { checkTutorialSetFourRules } from "./tutorialSetFourRules";
import { checkWorldOnePointOneRules } from "./worldOnePointOneRules";

// Tutorial sets: -4 to -1
export const WORLD_IDS = {
  TUTORIAL_ONE: -1,
  TUTORIAL_TWO: -2,
  TUTORIAL_THREE: -3,
  TUTORIAL_FOUR: -4,
  WORLD_ONE_POINT_ONE: 1.1,
};

/**
 * Check the rules for a given tutorial set number.
 * @param {number} worldNumber The negative world ID (-1 to -4)
 * @param {string[]} selectedWords The player's selected words
 * @returns {boolean[]} Array representing the status of each rule
 */
export function checkWorldRules(worldNumber, selectedWords) {
  switch (worldNumber) {
    case WORLD_IDS.TUTORIAL_ONE:
      return checkTutorialSetOneRules(selectedWords);
    case WORLD_IDS.TUTORIAL_TWO:
      return checkTutorialSetTwoRules(selectedWords);
    case WORLD_IDS.TUTORIAL_THREE:
      return checkTutorialSetThreeRules(selectedWords);
    case WORLD_IDS.TUTORIAL_FOUR:
      return checkTutorialSetFourRules(selectedWords);
    case WORLD_IDS.WORLD_ONE_POINT_ONE:
      return checkWorldOnePointOneRules(selectedWords);
    default:
      console.warn(`No rule logic found for worldNumber=${worldNumber}`);
      return [false];
  }
}

/**
 * Extract words from text by matching word boundaries (letters, underscores, apostrophes, or hyphens).
 * e.g. "don't" => ["don't"]
 */
export function extractWords(text) {
  return text.match(/\b\w+(?:['-]\w+)*\b/g) || [];
}
