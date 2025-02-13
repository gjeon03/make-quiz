import React, { JSX, useEffect, useState } from "react";

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
  const [favorite, setFavorite] = useState<number[]>([]);
  const [selected, setSelected] = useState<string>("Default");

  const handleSingleChoice = (questionId: number, value: string): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [parseInt(value)],
    }));
  };

  // const handleMultiChoice = (questionId: number, optionIndex: number): void => {
  //   setMultiSelections((prev) => {
  //     const current = prev[questionId] || new Set<number>();
  //     const updated = new Set(current);

  //     if (updated.has(optionIndex)) {
  //       updated.delete(optionIndex);
  //     } else {
  //       updated.add(optionIndex);
  //     }

  //     setUserAnswers((prevAnswers) => ({
  //       ...prevAnswers,
  //       [questionId]: Array.from(updated),
  //     }));

  //     return {
  //       ...prev,
  //       [questionId]: updated,
  //     };
  //   });
  // };

  const handleMultiChoice = (questionId: number, optionIndex: number): void => {
    setMultiSelections((prev) => {
      const updatedSelections = { ...prev };
      const currentSelections = new Set(updatedSelections[questionId] || []);

      if (currentSelections.has(optionIndex)) {
        currentSelections.delete(optionIndex);
      } else {
        currentSelections.add(optionIndex);
      }

      updatedSelections[questionId] = currentSelections;

      // 선택된 옵션을 배열로 변환하여 userAnswers 업데이트
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: Array.from(currentSelections),
      }));

      return updatedSelections;
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
        // 객관식 문제 처리
        const answerMapping: Record<string, number> = {
          A: 0,
          B: 1,
          C: 2,
          D: 3,
          E: 4,
          F: 5,
          G: 6,
          H: 7,
          I: 8,
          J: 9,
        };

        // 정답을 숫자로 변환
        const correctAnswers = question.answers.map((a) =>
          typeof a === "string" ? answerMapping[a] ?? -1 : a
        );

        // 유저 답안을 숫자로 변환
        const userAnswerNumbers = userAnswer.map((ua) =>
          typeof ua === "string" ? answerMapping[ua] ?? -1 : ua
        );

        // 정답 체크
        const isCorrect =
          correctAnswers.length === userAnswerNumbers.length &&
          correctAnswers.every((a) => userAnswerNumbers.includes(a));

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

    // 정답을 숫자로 변환하는 매핑
    const answerMapping: Record<string, number> = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
    };

    // 단답형 처리 (기존 로직 유지)
    if (question.type === "short-answer") {
      const normalizedUserAnswer = normalizeAnswer(userAnswer[0]);
      return question.answers.some(
        (ans) => normalizeAnswer(ans) === normalizedUserAnswer
      );
    }

    // 정답과 유저 답안을 숫자로 변환
    const correctAnswers = question.answers.map((a) =>
      typeof a === "string" ? answerMapping[a] ?? -1 : a
    );

    const userAnswerNumbers = userAnswer.map((ua) =>
      typeof ua === "string" ? answerMapping[ua] ?? -1 : ua
    );

    // 모든 정답이 포함되고 길이가 동일해야 함
    return (
      correctAnswers.length === userAnswerNumbers.length &&
      correctAnswers.every((a) => userAnswerNumbers.includes(a))
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
                    checked={(multiSelections[question.id] ?? new Set()).has(
                      idx
                    )}
                    onChange={() => handleMultiChoice(question.id, idx)}
                    disabled={showResults}
                  />
                  <p className="break-words whitespace-pre-wrap">
                    {option.replace(/={2,}/g, "")}
                  </p>
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
                  <span className="flex-wrap text-wrap">
                    {option.replace(/={2,}/g, "")}
                  </span>
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
                <span className="flex-wrap text-wrap">
                  {option.replace(/={2,}/g, "")}
                </span>
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
    setSelected(key);
    handleReset();
    if (key === "Default") {
      setQuestionsResult(questions);
    } else if (key === "Favorite") {
      const favoriteQuestions = questions.filter((question) =>
        favorite.includes(question.id)
      );

      setQuestionsResult(favoriteQuestions);
    } else if (key === "Random 1") {
      const randomQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);

      setQuestionsResult(randomQuestions);
    } else if (key === "Random 5") {
      const randomQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setQuestionsResult(randomQuestions);
    } else if (key === "Random 10") {
      const randomQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      setQuestionsResult(randomQuestions);
    } else if (key === "Mix All") {
      setQuestionsResult(questions.sort(() => Math.random() - 0.5));
    } else if (key === "1-50") {
      setQuestionsResult(questions.slice(0, 50));
    } else if (key === "51-100") {
      setQuestionsResult(questions.slice(50, 100));
    } else if (key === "101-150") {
      setQuestionsResult(questions.slice(100, 150));
    } else if (key === "151-200") {
      setQuestionsResult(questions.slice(150, 200));
    } else if (key === "201-250") {
      setQuestionsResult(questions.slice(200, 250));
    } else if (key === "251-300") {
      setQuestionsResult(questions.slice(250, 300));
    } else if (key === "301-350") {
      setQuestionsResult(questions.slice(300, 350));
    } else if (key === "351-400") {
      setQuestionsResult(questions.slice(350, 400));
    } else if (key === "401-450") {
      setQuestionsResult(questions.slice(400, 450));
    } else if (key === "451-500") {
      setQuestionsResult(questions.slice(450, 500));
    } else if (key === "501-550") {
      setQuestionsResult(questions.slice(500, 550));
    }
    setShowResults(false);
  };

  const handleReset = () => {
    setShowResults(false);
    setScore(0);
    setUserAnswers({});
    setMultiSelections({});
  };

  useEffect(() => {
    const favorite = localStorage.getItem("favorite");
    const favoriteArray = favorite ? JSON.parse(favorite) : [];
    setFavorite(favoriteArray);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-28 ">
      <div className="w-full flex items-center justify-center relative flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-center mb-6">{quizTitle}</h1>
        <div className="flex gap-5 w-full flex-wrap">
          <button
            className="w-full border rounded-lg p-2"
            onClick={handleReset}
          >
            Answer Reset
          </button>

          <div className="w-full">
            <select
              className="w-full border rounded-lg p-2 text-black"
              onChange={(e) => handleQuestionMix(e.target.value)}
              value={selected}
            >
              <option value="Default">Default</option>
              <option value="Favorite">Favorite</option>
              <option value="Mix All">Mix All</option>
              <option value="Random 1">Random 1</option>
              <option value="Random 5">Random 5</option>
              <option value="Random 10">Random 10</option>
              <option value="1-50">1-50</option>
              <option value="51-100">51-100</option>
              <option value="101-150">101-150</option>
              <option value="151-200">151-200</option>
              <option value="201-250">201-250</option>
              <option value="251-300">251-300</option>
              <option value="301-350">301-350</option>
              <option value="351-400">351-400</option>
              <option value="401-450">401-450</option>
              <option value="451-500">451-500</option>
              <option value="501-550">501-550</option>
            </select>
          </div>
        </div>
      </div>

      {questionsResult.map((question) => (
        <div
          key={question.id}
          className="p-4 border rounded-lg shadow-sm mb-4 overflow-x-auto text-sm sm:text-lg"
        >
          <p className="text-sm sm:text-lg font-medium mb-4">
            {`[${question.id}] ${question.question
              .replace(/={2,}/g, "")
              .trim()}`}
            <label className="ml-4 text-sm inline-flex items-center">
              <input
                type="checkbox"
                className="ml-4"
                checked={favorite.includes(question.id)}
                onChange={() => {
                  // localStorage에 즐겨찾기 저장
                  const favorite = localStorage.getItem("favorite");
                  const favoriteArray = favorite ? JSON.parse(favorite) : [];

                  if (favoriteArray.includes(question.id)) {
                    const index = favoriteArray.indexOf(question.id);
                    favoriteArray.splice(index, 1);
                  } else {
                    favoriteArray.push(question.id);
                  }

                  localStorage.setItem(
                    "favorite",
                    JSON.stringify(favoriteArray)
                  );

                  setFavorite(favoriteArray);

                  // 즐겨찾기 목록에서 제거
                  if (selected === "Favorite") {
                    const favoriteQuestions = questions.filter((question) =>
                      favoriteArray.includes(question.id)
                    );

                    setQuestionsResult(favoriteQuestions);
                  }
                }}
              />
              <span>즐겨찾기</span>
            </label>
            {/* <button
              className={`ml-4 border rounded-md p-1 text-sm text-center ${
                favorite.includes(question.id) ? "bg-purple-900" : ""
              }`}
              onClick={() => {
                // localStorage에 즐겨찾기 저장
                const favorite = localStorage.getItem("favorite");
                const favoriteArray = favorite ? JSON.parse(favorite) : [];

                if (favoriteArray.includes(question.id)) {
                  const index = favoriteArray.indexOf(question.id);
                  favoriteArray.splice(index, 1);
                } else {
                  favoriteArray.push(question.id);
                }

                localStorage.setItem("favorite", JSON.stringify(favoriteArray));

                setFavorite(favoriteArray);
              }}
            >
              ⭐️
            </button> */}
          </p>
          {renderQuestion(question)}

          {showResults && (
            <div
              className={`mt-4 p-4 rounded ${
                isCorrectAnswer(question, userAnswers[question.id])
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <p className="font-medium text-black">
                {isCorrectAnswer(question, userAnswers[question.id])
                  ? "정답입니다! 🎉"
                  : "틀렸습니다 ❌"}
              </p>
              <p className="mt-2 text-black">
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
        <div className="fixed bottom-0 left-0 w-full p-4 bg-black border-t">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            제출하기
          </button>
        </div>
      )}

      {showResults && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-black border-t text-center">
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
