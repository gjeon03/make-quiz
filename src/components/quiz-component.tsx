import React, { JSX, useState } from "react";

interface Question {
  id: number;
  type: "multiple-choice" | "short-answer" | "true-false";
  question: string;
  options?: string[];
  answers: (number | string)[];
  explanation: string;
}

interface Quiz {
  quizTitle: string;
  questions: Question[];
}

interface UserAnswers {
  [key: number]: (number | string)[];
}

interface MultiSelections {
  [key: number]: Set<number>;
}

const QuizComponent: React.FC<Quiz> = ({ quizTitle, questions }) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [multiSelections, setMultiSelections] = useState<MultiSelections>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionsResult, setQuestionsResult] = useState<Question[]>(questions);

  const handleSingleChoice = (questionId: number, value: string): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [parseInt(value)],
    }));
  };

  const handleMultiChoice = (questionId: number, optionIndex: number): void => {
    setMultiSelections((prev) => {
      const current = prev[questionId] || new Set<number>();
      const updated = new Set(current);

      if (updated.has(optionIndex)) {
        updated.delete(optionIndex);
      } else {
        updated.add(optionIndex);
      }

      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: Array.from(updated),
      }));

      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  const handleShortAnswer = (questionId: number, value: string): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [value.trim().toLowerCase()],
    }));
  };

  const calculateScore = (): number => {
    let correct = 0;
    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id] || [];

      if (question.type === "short-answer") {
        const normalizedUserAnswer =
          typeof userAnswer[0] === "number"
            ? userAnswer[0].toString().toLowerCase()
            : userAnswer[0]?.toLowerCase();
        const normalizedCorrectAnswers = question.answers.map((a) =>
          String(a).toLowerCase()
        );
        if (normalizedCorrectAnswers.includes(normalizedUserAnswer)) {
          correct++;
        }
      } else {
        const isCorrect =
          question.answers.length === userAnswer.length &&
          question.answers.every((a) => userAnswer.includes(a));
        if (isCorrect) correct++;
      }
    });
    return correct;
  };

  const handleSubmit = (): void => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const normalizeAnswer = (answer: string | number): string => {
    return typeof answer === "number"
      ? answer.toString().toLowerCase()
      : answer.toLowerCase();
  };

  const isCorrectAnswer = (
    question: Question,
    userAnswer: (string | number)[] | undefined
  ): boolean => {
    if (!userAnswer?.length) return false;

    if (question.type === "short-answer") {
      const normalizedUserAnswer = normalizeAnswer(userAnswer[0]);
      return question.answers.some(
        (ans) => normalizeAnswer(ans) === normalizedUserAnswer
      );
    }

    return (
      question.answers.length === userAnswer.length &&
      question.answers.every((a) => userAnswer.includes(a))
    );
  };

  const renderQuestion = (question: Question): JSX.Element | null => {
    const userAnswer = userAnswers[question.id] || [];

    switch (question.type) {
      case "multiple-choice":
        if (question.answers.length > 1 && question.options) {
          return (
            <div className="flex flex-col gap-2">
              {question.options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={multiSelections[question.id]?.has(idx)}
                    onChange={() => handleMultiChoice(question.id, idx)}
                    disabled={showResults}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          );
        } else if (question.options) {
          return (
            <div className="flex flex-col gap-2">
              {question.options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={idx}
                    onChange={(e) =>
                      handleSingleChoice(question.id, e.target.value)
                    }
                    checked={userAnswer[0] === idx}
                    disabled={showResults}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          );
        }
        return null;

      case "true-false":
        return (
          <div className="flex flex-col gap-2">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={idx}
                  onChange={(e) =>
                    handleSingleChoice(question.id, e.target.value)
                  }
                  checked={userAnswer[0] === idx}
                  disabled={showResults}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "short-answer":
        return (
          <input
            type="text"
            onChange={(e) => handleShortAnswer(question.id, e.target.value)}
            disabled={showResults}
            className="w-full p-2 border rounded"
            placeholder="답변을 입력하세요..."
          />
        );

      default:
        return null;
    }
  };

  const handleQuestionMix = (key: string) => {
    if (key === "Random 1") {
      const randomQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);

      setQuestionsResult(randomQuestions);
    } else if (key === "Random 5") {
      const randomQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setQuestionsResult(randomQuestions);
    } else if (key === "Random 10") {
      const randomQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      setQuestionsResult(randomQuestions);
    } else if (key === "Mix All") {
      setQuestionsResult(questions.sort(() => Math.random() - 0.5));
    }
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="w-full flex items-center justify-center relative flex-col">
        <h1 className="text-2xl font-bold text-center mb-6">{quizTitle}</h1>
        <div className="flex gap-5 w-full">
          {["Random 1", "Random 5", "Random 10", "Mix All"].map(
            (key, index) => (
              <button
                key={index}
                className="w-full border rounded-lg p-2"
                onClick={() => handleQuestionMix(key)}
              >
                {key}
              </button>
            )
          )}
        </div>
      </div>

      {questionsResult.map((question) => (
        <div key={question.id} className="p-4 border rounded-lg shadow-sm mb-4">
          <p className="text-lg font-medium mb-4">{question.question}</p>
          {renderQuestion(question)}

          {showResults && (
            <div
              className={`mt-4 p-4 rounded ${
                isCorrectAnswer(question, userAnswers[question.id])
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <p className="font-medium">
                {isCorrectAnswer(question, userAnswers[question.id])
                  ? "정답입니다! 🎉"
                  : "틀렸습니다 ❌"}
              </p>
              <p className="mt-2">
                <strong>정답:</strong>{" "}
                {question.answers
                  .map((answer) =>
                    typeof answer === "number" ? answer + 1 : answer
                  )
                  .join(", ")}
              </p>
              <p className="mt-2">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {!showResults && (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          제출하기
        </button>
      )}

      {showResults && (
        <div className="text-center">
          <p className="text-xl font-bold">
            최종 점수: {score} / {questionsResult.length}(
            {((score / questionsResult.length) * 100).toFixed(1)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
