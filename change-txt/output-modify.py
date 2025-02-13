input_file = "output.txt"
output_file = "output_modified.txt"

# 파일 읽기
with open(input_file, "r", encoding="utf-8") as file:
    content = file.read()

# 문자열 치환
modified_content = content.replace("(cid:1791)", "세")

# 변경된 내용 저장
with open(output_file, "w", encoding="utf-8") as file:
    file.write(modified_content)

print("변환이 완료되었습니다. 결과는 output_modified.txt 파일에 저장되었습니다.")