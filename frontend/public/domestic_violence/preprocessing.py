import os
import pandas as pd

# CSV 파일이 저장된 폴더
folder_path = 'domestic_violence/시도청별_신고건수.csv'

# 폴더 내의 모든 파일을 순회
for filename in os.listdir(folder_path):
    if filename.endswith('.csv'):
        # CSV 파일 경로
        file_path = os.path.join(folder_path, filename)
        
        # CSV 파일 불러오기
        df = pd.read_csv(file_path)
        
        # 데이터 내의 '-'를 '0'으로 대체, 문자열 포함 모든 컬럼 처리
        df = df.applymap(lambda x: '0' if x == '-' else x)
        
        # 파일을 원래 위치에 다시 저장
        df.to_csv(file_path, index=False)

print("모든 파일이 업데이트 되었습니다.")
