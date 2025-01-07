const fs = require("fs");
const path = require("path");

// 명령줄 인자에서 입력 파일과 출력 파일 가져오기
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node change.js <inputFile> <outputFile>");
  process.exit(1);
}

const [inputFileName, outputFileName] = args;

// 입력 파일 경로와 출력 파일 경로 생성
const inputFile = path.join(__dirname, inputFileName);
const outputFile = path.join(__dirname, outputFileName);

// 파일 읽기 및 JSON 변환
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // 줄 단위로 데이터 나누기
  const lines = data.split("\n").filter((line) => line.trim() !== "");
  let questions = [];
  let id = 1;

  for (let line of lines) {
    const [question, answer] = line.split(" : ").map((text) => text.trim());
    if (question && answer) {
      // 문제 추가 (원본)
      questions.push({
        id: id++,
        type: "short-answer",
        question: question,
        answers: [answer],
        explanation: "",
      });

      // 문제 추가 (반전)
      questions.push({
        id: id++,
        type: "short-answer",
        question: answer,
        answers: [question],
        explanation: "",
      });
    }
  }

  // JSON 데이터 생성
  const jsonData = {
    quizTitle: "Translation Quiz",
    questions: questions,
  };

  // JSON 파일로 저장
  fs.writeFile(outputFile, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
      return;
    }
    console.log("JSON file has been saved:", outputFile);
  });
});
