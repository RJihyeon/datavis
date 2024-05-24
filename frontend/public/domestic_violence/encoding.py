import os
import pandas as pd
import chardet  # 인코딩 탐지를 위한 라이브러리

def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        result = chardet.detect(file.read())
    return result['encoding']

directory_path = '.'

for filename in os.listdir(directory_path):
    if filename.endswith('.csv'):
        file_path = os.path.join(directory_path, filename)
        
        # 파일 인코딩 감지
        encoding = detect_encoding(file_path)
        try:
            # 감지된 인코딩으로 파일 읽기
            df = pd.read_csv(file_path, encoding=encoding)
            new_file_path = os.path.join(directory_path, filename.replace('.csv', '_utf8.csv'))
            df.to_csv(new_file_path, index=False, encoding='utf-8')
            print(f'File {filename} converted and saved as {new_file_path}')
        except UnicodeDecodeError:
            print(f'Failed to read {filename} with detected encoding {encoding}. Trying different encodings...')
            try:
                # 다른 인코딩 시도
                df = pd.read_csv(file_path, encoding='utf-8')
                df.to_csv(new_file_path, index=False, encoding='utf-8')
                print(f'File {filename} converted with UTF-8 and saved as {new_file_path}')
            except:
                print(f'Failed to read {filename} with UTF-8 encoding.')
