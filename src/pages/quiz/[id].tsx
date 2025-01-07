import path from "path";
import { useEffect, useState } from "react";
import fs from "fs";
import QuizComponent from "@/components/quiz-component";

export interface Quiz {
  quizTitle: string;
  questions: Question[];
}

export interface Question {
  id: number;
  type: "multiple-choice" | "short-answer" | "true-false";
  question: string;
  options?: string[]; // 객관식/참거짓 문제에서 사용
  answers: (number | string)[]; // 객관식은 인덱스 번호, 주관식은 문자열
  explanation: string;
}

interface Props {
  id: string;
}

const QuizPage = ({ id }: Props) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, [id]);

  if (!quiz)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <QuizComponent quizTitle={quiz.quizTitle} questions={quiz.questions} />
  );
};

export async function getStaticPaths() {
  const quizDir = path.join(process.cwd(), "data/quiz");
  const files = fs.readdirSync(quizDir);
  const paths = files.map((file) => ({
    params: { id: file.replace(".json", "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const quizPath = path.join(process.cwd(), "data/quiz", `${params.id}.json`);
  const quiz = JSON.parse(fs.readFileSync(quizPath, "utf8"));
  return { props: { id: params.id, quiz } };
}

export default QuizPage;
