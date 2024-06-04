import pandas as pd

# CSV 파일 불러오기
df = pd.read_csv('data2.csv')
print(df)
# 연도별로 데이터를 분리하여 CSV 파일로 저장
years = df['year'].unique()

for year in years:
    df_year = df[df['year'] == year]
    df_year.to_csv(f'treemap_{year}_help_exp_yes.csv', index=False)
