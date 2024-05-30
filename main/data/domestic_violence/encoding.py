import os
import pandas as pd
import chardet  # 인코딩 탐지를 위한 라이브러리

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        result = chardet.detect(file.read(10000))  # 처음 10000바이트만 읽어 인코딩 감지
    return result['encoding']

# 파일 경로 지정
file_path = 'main/data/domestic_violence/시도청별_신고건수.csv'

# 파일 인코딩 감지
encoding = detect_encoding(file_path)
try:
    # 감지된 인코딩으로 파일 읽기
    df = pd.read_csv(file_path, encoding=encoding)
    new_file_path = file_path.replace('.csv', '_utf8.csv')
    df.to_csv(new_file_path, index=False, encoding='utf-8')
    print(f'File converted and saved as {new_file_path}')
except UnicodeDecodeError:
    print(f'Failed to read the file with detected encoding {encoding}. Trying different encodings...')
    try:
        # 다른 인코딩 시도
        df = pd.read_csv(file_path, encoding='utf-8')
        df.to_csv(new_file_path, index=False, encoding='utf-8')
        print(f'File converted with UTF-8 and saved as {new_file_path}')
    except:
        print(f'Failed to read the file with UTF-8 encoding.')
