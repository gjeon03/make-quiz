import { MemoriesCardType, MemoryQuestion } from "@/pages/memory/[id]";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import type Swiper from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import MemoryCard from "./memory-card";

const Memories: React.FC<MemoriesCardType> = ({ memoryTitle, questions }) => {
  const [testQuestions, setTestQuestions] = useState<MemoryQuestion[]>();
  const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);
  const swiperRef = useRef<Swiper>(null);

  useEffect(() => {
    const storedChecked = JSON.parse(
      localStorage.getItem("checkedQuestions") || "[]"
    );
    setCheckedQuestions(storedChecked);
  }, []);

  const handleCheckboxChange = (id: number) => {
    setCheckedQuestions((prev) => {
      const newChecked = prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id];
      localStorage.setItem("checkedQuestions", JSON.stringify(newChecked));
      return newChecked;
    });
  };

  const handleTest = (option: string) => {
    if (option === "LIST") {
      setTestQuestions(undefined);
    } else if (option === "ALL TEST") {
      const randomQuestions = [...questions].sort(() => Math.random() - 0.5);
      setTestQuestions(randomQuestions);
    } else if (option === "CHECKED TEST") {
      setTestQuestions(
        questions
          .filter((q) => checkedQuestions.includes(q.id))
          .sort(() => Math.random() - 0.5)
      );
    } else if (option === "UNCHECKED TEST") {
      setTestQuestions(
        questions
          .filter((q) => !checkedQuestions.includes(q.id))
          .sort(() => Math.random() - 0.5)
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="w-full flex items-center justify-center relative flex-col">
        <h1 className="text-2xl font-bold text-center mb-6">{memoryTitle}</h1>
        <div className="flex gap-5 w-full">
          {["LIST", "ALL TEST", "CHECKED TEST", "UNCHECKED TEST"].map(
            (option) => (
              <button
                key={option}
                className="w-full border rounded-lg p-2"
                onClick={() => handleTest(option)}
              >
                {option}
              </button>
            )
          )}
        </div>
        {testQuestions ? (
          <div className="mt-4 relative w-full">
            <div className="flex justify-center gap-1 mb-5">
              <button
                className="p-3 bg-gray-400 text-white flex-1 rounded-md"
                onClick={() => {
                  swiperRef.current?.slidePrev();
                }}
              >
                이전
              </button>
              <button
                className="p-3 bg-gray-400 text-white flex-1 rounded-md"
                onClick={() => {
                  swiperRef.current?.slideNext();
                }}
              >
                다음
              </button>
            </div>
            <SwiperComponent
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              spaceBetween={50}
              slidesPerView={1}
            >
              {testQuestions.map((question) => (
                <SwiperSlide
                  key={question.id}
                  className="p-4 border rounded-lg shadow-sm mb-4"
                >
                  <MemoryCard
                    question={question}
                    checkedQuestions={checkedQuestions}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </SwiperSlide>
              ))}
            </SwiperComponent>
          </div>
        ) : (
          <ul className="mt-4">
            {questions.map((question) => (
              <li key={question.id}>
                <div className="flex ">
                  <div className="p-4 flex flex-col items-center gap-5">
                    <span className="text-sm font-bold">[{question.id}]</span>
                    <input
                      type="checkbox"
                      checked={checkedQuestions.includes(question.id)}
                      onChange={() => handleCheckboxChange(question.id)}
                    />
                    <button className="border rounded-md p-2 bg-orange-500 text-white">
                      test
                    </button>
                  </div>
                  <div className="border p-4 rounded-lg mb-4 flex flex-col gap-2">
                    <h2 className="font-bold border-b">{question.question}</h2>
                    {question.answers.map((answer) => (
                      <div
                        key={answer.number}
                        className="flex items-center border-b"
                      >
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
                        <span className="ml-2">{answer.content}</span>
                      </div>
                    ))}
                    <p>
                      {Object.entries(question.explanation).map(
                        ([key, value]) => (
                          <p key={key} className="py-2">
                            <strong>{key}:</strong> {value}
                          </p>
                        )
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Memories;
