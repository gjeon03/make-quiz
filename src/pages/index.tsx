import fs from "fs";
import path from "path";
import { useState } from "react";
import Link from "next/link";

const Home = ({
  quizzes,
  memories,
}: {
  quizzes: string[];
  memories: string[];
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const TEMP_PASSWORD = "9435";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEMP_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀렸습니다!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col gap-5">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Select a Quiz
        </h1>
        <ul className="space-y-4">
          {quizzes.map((quiz) => {
            const quizName = quiz.replace(".json", "").replace(/\//g, "-");
            const isPrivateName = !isNaN(Number(quizName)); // 숫자로 변환 가능하면 private

            return (
              <li key={quiz}>
                {isPrivateName ? (
                  !isAuthorized ? (
                    <form onSubmit={handlePasswordSubmit}>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="submit">Unlock</button>
                    </form>
                  ) : (
                    <Link
                      href={`/quiz/${quiz.replace(".json", "")}`}
                      className="block w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 text-center transition"
                    >
                      {quizName} (Private)
                    </Link>
                  )
                ) : (
                  <Link
                    className="block w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 text-center transition"
                    href={`/quiz/${quiz.replace(".json", "")}`}
                  >
                    {quizName}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Select a Memory Card
        </h1>
        <ul className="space-y-4">
          {memories.map((memory) => (
            <li key={memory}>
              <Link
                className="block w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 text-center transition"
                href={`/memory/${memory.replace(".json", "")}`}
              >
                {memory.replace(".json", "")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const quizDir = path.join(process.cwd(), "data/quiz");
  const files = fs.readdirSync(quizDir);
  const quizzes = files.filter((file) => file.endsWith(".json"));

  const memoryDir = path.join(process.cwd(), "data/memory");
  const memoryFiles = fs.readdirSync(memoryDir);
  const memories = memoryFiles.filter((file) => file.endsWith(".json"));

  return { props: { quizzes, memories } };
}

export default Home;
