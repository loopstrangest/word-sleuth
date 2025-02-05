const vowels = "aeiou";

export function checkTutorialSetFourRules(selectedWords) {
  if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
    return [false, false];
  }

  // Rule 1: Every word must include letter 'a'
  const hasLetterA = selectedWords.every((word) =>
    word.toLowerCase().includes("a")
  );

  // Rule 2: Every word must contain exactly two vowels
  const hasTwoVowels = selectedWords.every((word) => {
    const vowelCount = [...word.toLowerCase()].filter((char) =>
      vowels.includes(char)
    ).length;
    return vowelCount === 2;
  });

  return [hasLetterA, hasTwoVowels];
}
