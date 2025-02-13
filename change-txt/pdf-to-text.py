import pdfplumber

pdf_path = "dvaaaa.pdf"  # 문제의 PDF 파일 경로
output_txt_path = "output.txt"  # 변환된 텍스트를 저장할 파일

with pdfplumber.open(pdf_path) as pdf:
    with open(output_txt_path, "w", encoding="utf-8") as output_file:
        for page in pdf.pages:
            text = page.extract_text()  # 페이지에서 텍스트 추출
            if text:
                output_file.write(text + "\n")
                output_file.write("=" * 50 + "\n")  # 페이지 구분용
print("텍스트 추출 완료:", output_txt_path)
