import json
import re

input_file = "output_modified.txt"
output_json = "output.json"

def parse_questions(text):
    questions = []
    question_blocks = re.split(r"QUESTION \d+", text)[1:]
    
    for i, block in enumerate(question_blocks, start=1):
        parts = re.split(r"\n([A-Z])\. ", block)
        if len(parts) < 2:
            continue
        
        question_text = parts[0].strip()
        options = []
        
        for j in range(1, len(parts), 2):
            if j + 1 < len(parts):
                option_text = parts[j] + ". " + parts[j + 1].strip()
                if "Correct Answer:" in option_text:
                    option_text = option_text.split("Correct Answer:")[0].strip()
                options.append(option_text)
        
        correct_answer_match = re.search(r"Correct Answer: ([A-Z]+)", block)
        answers = list(correct_answer_match.group(1)) if correct_answer_match else []
        
        questions.append({
            "id": i,
            "type": "multiple-choice",
            "question": question_text,
            "options": options,
            "answers": answers
        })
    
    return questions

# 파일 읽기
with open(input_file, "r", encoding="utf-8") as file:
    content = file.read()

# 문제 파싱
parsed_questions = parse_questions(content)

# JSON 저장
with open(output_json, "w", encoding="utf-8") as json_file:
    json.dump(parsed_questions, json_file, ensure_ascii=False, indent=4)

print("JSON 변환이 완료되었습니다. 결과는 output.json 파일에 저장되었습니다.")
