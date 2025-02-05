export function checkTutorialSetTwoRules(selectedWords) {
  if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
    return [false];
  }

  // Rule: Every selected word must start and end with the same letter
  const hasSameStartEnd = selectedWords.every((word) => {
    const cleaned = word.toLowerCase();
    return cleaned[0] === cleaned[cleaned.length - 1];
  });

  return [hasSameStartEnd];
}
