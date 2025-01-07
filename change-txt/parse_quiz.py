import re
import json

def parse_quiz_text(text):
    questions = []
    current_id = 0

    # Split by "QUESTION" and iterate through each block
    question_blocks = text.split("QUESTION")[1:]  # "QUESTION"을 기준으로 나눔

    for block in question_blocks:
        # Extract question number
        match = re.match(r'\s*(\d+)\s*', block)
        if not match:
            continue

        # Split block into question and answer sections
        parts = block.split("Correct Answer:")
        if len(parts) != 2:
            continue

        question_text = parts[0].strip()  # Question and options section
        correct_answer = parts[1].strip().split("\n")[0]  # Correct answer section

        # Ensure correct_answer is a single letter (e.g., "A")
        correct_answer = correct_answer[0].strip()

        # Extract options using regex
        options = []
        option_matches = re.finditer(r'([A-Z])\.(.*?)(?=(?:[A-Z]\.|Correct Answer:|$))', question_text, re.DOTALL)
        for match in option_matches:
            options.append(match.group(2).strip())

        # Remove option markers from question text
        main_question = re.sub(r'([A-Z])\.(.*?)(?=(?:[A-Z]\.|Correct Answer:|$))', '', question_text, flags=re.DOTALL)

        # Remove leading question number from the main question
        main_question = re.sub(r'^\d+\s+', '', main_question.strip(), flags=re.MULTILINE)

        # Combine multi-line question into a single line
        main_question = " ".join(line.strip() for line in main_question.split("\n") if line.strip())

        # Convert correct answer letter to index
        correct_index = ord(correct_answer) - ord('A')

        # Add the parsed question to the questions list
        questions.append({
            "id": current_id + 1,
            "type": "multiple-choice",
            "question": main_question,
            "options": options,
            "answers": [correct_index],
            "explanation": "See explanation in course materials."
        })

        current_id += 1

    return {
        "quizTitle": "AWS Certified Developer - Associate Practice Test",
        "questions": questions
    }

# 파일에서 텍스트 읽기
with open("output.txt", "r", encoding="utf-8") as f:
    your_text = f.read()

# JSON 데이터 생성
quiz_json = parse_quiz_text(your_text)

# JSON 파일로 저장
with open("quiz.json", "w", encoding="utf-8") as f:
    json.dump(quiz_json, f, indent=2, ensure_ascii=False)

print("JSON 파일이 저장되었습니다: quiz.json")
