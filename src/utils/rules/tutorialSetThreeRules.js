export function checkTutorialSetThreeRules(selectedWords) {
  if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
    return [false, false];
  }

  // Rule 1: Second letter is 'e'
  const hasSecondE = selectedWords.every((word) => {
    return word.length >= 2 && word[1].toLowerCase() === "e";
  });

  // Rule 2: Second to last letter is 'e'
  const hasSecondLastE = selectedWords.every((word) => {
    return word.length >= 2 && word[word.length - 2].toLowerCase() === "e";
  });

  return [hasSecondE, hasSecondLastE];
}
