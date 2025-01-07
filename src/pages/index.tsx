import fs from "fs";
import path from "path";
import Link from "next/link";

const Home = ({ quizzes }: { quizzes: string[] }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Select a Quiz
        </h1>
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz}>
              <Link
                href={`/quiz/${quiz.replace(".json", "")}`}
                className="block w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 text-center transition"
              >
                {quiz.replace(".json", "")}
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
  return { props: { quizzes } };
}

export default Home;
