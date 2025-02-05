export function checkTutorialSetOneRules(selectedWords) {
  if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
    return [false];
  }

  // Rule: Every selected word must be a palindrome
  const isPalindrome = (word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
  };

  return [selectedWords.every(isPalindrome)];
}
