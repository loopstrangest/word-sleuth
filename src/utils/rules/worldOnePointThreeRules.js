const hasAllVowelsOnceTotal = (selectedWords) => {
  // Join all selected words and count vowels
  const combined = selectedWords.join("");
  const vowelCounts = {
    a: 0,
    e: 0,
    i: 0,
    o: 0,
    u: 0,
  };

  // Count each vowel
  for (const char of combined.toLowerCase()) {
    if (Object.hasOwn(vowelCounts, char)) {
      vowelCounts[char]++;
    }
  }

  // Check that each vowel appears exactly once
  return Object.values(vowelCounts).every((count) => count === 1);
};

const hasNoRepeatedLetters = (selectedWords) => {
  // Join all selected words and convert to lowercase
  const combined = selectedWords.join("").toLowerCase();

  // Create an empty Set to track letters we've seen
  const seenLetters = new Set();

  // Check each character - if we've seen it before, it's a repeat
  for (const char of combined) {
    if (seenLetters.has(char)) {
      return false; // Found a repeat
    }
    seenLetters.add(char);
  }
  return true; // No repeats found
};

export const checkWorldOnePointThreeRules = (selectedWords) => {
  // Return false if no words are selected
  if (!selectedWords || selectedWords.length === 0) {
    return false;
  }

  return [
    hasAllVowelsOnceTotal(selectedWords),
    hasNoRepeatedLetters(selectedWords),
  ];
};
