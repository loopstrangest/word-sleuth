import {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
} from "./worlds/worldZeroText";

import {
  worldOnePointOneLevels,
  worldOnePointTwoLevels,
  worldOnePointThreeLevels,
  worldOnePointSixLevels,
  worldOnePointNineLevels,
} from "./worlds/worldOneText";

import { worldTwoLevels } from "./worlds/worldTwoText";
import { worldThreeLevels } from "./worlds/worldThreeText";
import { worldFourLevels } from "./worlds/worldFourText";
import { worldFiveLevels } from "./worlds/worldFiveText";
import { worldSixLevels } from "./worlds/worldSixText";
import { worldSevenLevels } from "./worlds/worldSevenText";
import { worldEightLevels } from "./worlds/worldEightText";
import { worldNineLevels } from "./worlds/worldNineText";

// Re-export all levels
export {
  tutorialSetOneLevels,
  tutorialSetTwoLevels,
  tutorialSetThreeLevels,
  tutorialSetFourLevels,
  worldOnePointOneLevels,
  worldOnePointTwoLevels,
  worldOnePointThreeLevels,
  worldOnePointSixLevels,
  worldOnePointNineLevels,
  worldTwoLevels,
  worldThreeLevels,
  worldFourLevels,
  worldFiveLevels,
  worldSixLevels,
  worldSevenLevels,
  worldEightLevels,
  worldNineLevels,
};

// Export a mapping of world IDs to their level data
export const WORLD_DATA = {
  0.1: tutorialSetOneLevels,
  0.2: tutorialSetTwoLevels,
  0.3: tutorialSetThreeLevels,
  0.4: tutorialSetFourLevels,
  1.1: worldOnePointOneLevels,
  1.2: worldOnePointTwoLevels,
  1.3: worldOnePointThreeLevels,
  1.6: worldOnePointSixLevels,
  1.9: worldOnePointNineLevels,
  2: worldTwoLevels,
  3: worldThreeLevels,
  4: worldFourLevels,
  5: worldFiveLevels,
  6: worldSixLevels,
  7: worldSevenLevels,
  8: worldEightLevels,
  9: worldNineLevels,
};
