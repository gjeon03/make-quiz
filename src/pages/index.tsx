import fs from "fs";
import path from "path";
import Link from "next/link";

const Home = ({ quizzes }: { quizzes: string[] }) => {
  return (
    <div>
      <h1>Select a Quiz</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz}>
            <Link href={`/quiz/${quiz.replace(".json", "")}`}>
              {quiz.replace(".json", "")}
            </Link>
          </li>
        ))}
      </ul>
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
