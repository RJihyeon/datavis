import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('main/data/domestic_violence/2022_report.csv')

# 기소율 계산
df["기소율"] = ((df["기소_구속"] + df["기소_불구속"]) / df["검거건수"] * 100).round(1)

# 수정된 데이터프레임을 새로운 CSV 파일로 저장
df.to_csv('main/data/domestic_violence/2022_report.csv', index=False)

# 결과 출력
print(df)
