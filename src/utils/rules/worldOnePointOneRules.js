// Rule 1: Every selected word has two of the same consonant
function hasDoubleConsonant(word) {
  const consonants = word.toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || [];
  const counts = {};
  for (const c of consonants) {
    counts[c] = (counts[c] || 0) + 1;
  }
  return Object.values(counts).some((count) => count >= 2);
}

// Rule 2: Every selected word has two of the same vowel
function hasDoubleVowel(word) {
  const vowels = word.toLowerCase().match(/[aeiou]/g) || [];
  const counts = {};
  for (const v of vowels) {
    counts[v] = (counts[v] || 0) + 1;
  }
  return Object.values(counts).some((count) => count >= 2);
}

export function checkWorldOnePointOneRules(selectedWords) {
  if (!selectedWords || selectedWords.length < 2) {
    return [false, false];
  }

  const allHaveDoubleConsonant = selectedWords.every(hasDoubleConsonant);
  const allHaveDoubleVowel = selectedWords.every(hasDoubleVowel);

  return [allHaveDoubleConsonant, allHaveDoubleVowel];
}
