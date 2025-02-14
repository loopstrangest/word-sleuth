export function checkTutorialSetOneRules(selectedWords) {
  if (!Array.isArray(selectedWords) || selectedWords.length === 0) {
    return [false];
  }

  // Rule: Every selected word must be a palindrome
  const isPalindrome = (word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    const reversed = cleaned.split("").reverse().join("");
    console.log(
      `Checking palindrome: word=${word}, cleaned=${cleaned}, reversed=${reversed}, isPalindrome=${
        cleaned === reversed
      }`
    );
    return cleaned === reversed;
  };

  const result = [selectedWords.every(isPalindrome)];
  console.log(
    `Tutorial Set One Rules check: words=${selectedWords}, result=${result}`
  );
  return result;
}
