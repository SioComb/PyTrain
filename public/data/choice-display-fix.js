(() => {
  const data = window.PYTRAIN_REBALANCED_DATA;
  if (!data) return;

  function makeWhitespaceVisible(question) {
    const choices = Array.isArray(question.choices) ? question.choices : [];
    const hasSignificantEdgeWhitespace = choices.some(
      (choice) => typeof choice === "string" && choice !== choice.trim()
    );

    if (!hasSignificantEdgeWhitespace) return question;

    return {
      ...question,
      choices: choices.map((choice) =>
        typeof choice === "string" ? JSON.stringify(choice) : choice
      ),
    };
  }

  window.PYTRAIN_REBALANCED_DATA = {
    basic: data.basic.map(makeWhitespaceVisible),
    practical: data.practical.map(makeWhitespaceVisible),
  };
})();
