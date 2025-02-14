// Rule 1: Every selected word must contain at least one of [a, b, c]
function hasAnyOfABC(word) {
  const lowercased = word.toLowerCase();
  return ["a", "b", "c"].some((letter) => lowercased.includes(letter));
}

// Rule 2: Every selected word must contain at least one of [x, y, z]
function hasAnyOfXYZ(word) {
  const lowercased = word.toLowerCase();
  return ["x", "y", "z"].some((letter) => lowercased.includes(letter));
}

export function checkWorldOnePointTwoRules(selectedWords) {
  if (!selectedWords || selectedWords.length < 2) {
    return [false, false];
  }

  const allHaveABC = selectedWords.every(hasAnyOfABC);
  const allHaveXYZ = selectedWords.every(hasAnyOfXYZ);

  return [allHaveABC, allHaveXYZ];
}
