import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // API 경로의 id 파라미터 가져오기
  const memoryPath = path.join(process.cwd(), "data/memory", `${id}.json`); // 파일 경로 설정

  // 파일 존재 여부 확인
  if (!fs.existsSync(memoryPath)) {
    res.status(404).json({ error: "memory not found" });
    return;
  }

  // JSON 파일 읽기
  try {
    const memory = JSON.parse(fs.readFileSync(memoryPath, "utf8"));
    res.status(200).json(memory); // 클라이언트에 JSON 데이터 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Failed to load quiz data" });
  }
}
