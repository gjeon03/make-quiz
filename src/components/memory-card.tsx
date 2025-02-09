import { MemoryQuestion } from "@/pages/memory/[id]";
import { useState } from "react";

interface MemoryCardProps {
  question: MemoryQuestion;
  checkedQuestions: number[];
  handleCheckboxChange: (id: number) => void;
}

const MemoryCard = ({
  question,
  checkedQuestions,
  handleCheckboxChange,
}: MemoryCardProps) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isExplanation, setIsExplanation] = useState(false);

  const handleReset = () => {
    setIsAnswered(false);
    setIsExplanation(false);
  };

  return (
    <div className="flex flex-col gap-5 min-h-96 ">
      <p className="text-lg font-medium">
        {`[${question.id}] ${question.question}`}
        <button className="border rounded-md text-sm p-1" onClick={handleReset}>
          RESET
        </button>
        <input
          type="checkbox"
          className="ml-2"
          checked={checkedQuestions.includes(question.id)}
          onChange={() => handleCheckboxChange(question.id)}
        />
      </p>
      {isAnswered ? (
        question.answers.map((answer) => (
          <div key={answer.number} className="flex items-center border-b">
            <span>
              {answer.number === 1
                ? "A"
                : answer.number === 2
                ? "B"
                : answer.number === 3
                ? "C"
                : answer.number === 4
                ? "D"
                : answer.number === 5
                ? "E"
                : "F"}
            </span>
            <span className="ml-2 py-2">{answer.content}</span>
          </div>
        ))
      ) : (
        <button
          className="flex items-center justify-center bg-orange-300 rounded-md p-4"
          onClick={() => setIsAnswered(true)}
        >
          Show Answer
        </button>
      )}
      {isExplanation ? (
        Object.entries(question.explanation).map(([key, value]) => (
          <p key={key} className="py-2">
            <strong>{key}:</strong> {value}
          </p>
        ))
      ) : (
        <button
          className="flex items-center justify-center bg-green-500 rounded-md p-4"
          onClick={() => setIsExplanation(true)}
        >
          Show Explanation
        </button>
      )}
    </div>
  );
};

export default MemoryCard;
