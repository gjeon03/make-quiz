import path from "path";
import { useEffect, useState } from "react";
import fs from "fs";
import Memories from "@/components/memories";

export interface MemoryQuestion {
  id: number;
  type: "memory-card";
  question: string;
  answers: {
    number: number;
    content: string;
  }[];
  explanation: Record<string, string>;
}

export interface MemoriesCardType {
  memoryTitle: string;
  questions: MemoryQuestion[];
}

interface Props {
  id: string;
}

const MemoryPage = ({ id }: Props) => {
  const [memory, setMemory] = useState<MemoriesCardType | null>(null);
  useEffect(() => {
    fetch(`/api/memory/${id}`)
      .then((res) => res.json())
      .then((data) => setMemory(data));
  }, [id]);

  if (!memory)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <Memories memoryTitle={memory.memoryTitle} questions={memory.questions} />
  );
};

export async function getStaticPaths() {
  const quizDir = path.join(process.cwd(), "data/memory");
  const files = fs.readdirSync(quizDir);
  const paths = files.map((file) => ({
    params: { id: file.replace(".json", "") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const quizPath = path.join(process.cwd(), "data/memory", `${params.id}.json`);
  const quiz = JSON.parse(fs.readFileSync(quizPath, "utf8"));
  return { props: { id: params.id, quiz } };
}

export default MemoryPage;
