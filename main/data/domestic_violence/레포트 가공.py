import pandas as pd

# 원본 데이터
data = {
    "연도": ["2021", "2022", "2023"],
    "서울": [38826, 40853, 40488],
    "부산": [11912, 12602, 12662],
    "대구": [10841, 11560, 12076],
    "인천": [16808, 16098, 16663],
    "광주": [5125, 5672, 6224],
    "대전": [6265, 6035, 6289],
    "울산": [4578, 5128, 5654],
    "세종": [1484, 1504, 1768],
    "경기남": [52195, 52397, 54303],
    "경기북": [15505, 17666, 17079],
    "강원": [6353, 6477, 6658],
    "충북": [5717, 6040, 6339],
    "충남": [8259, 8186, 8744],
    "전북": [3795, 3816, 3508],
    "전남": [7636, 7717, 7009],
    "경북": [8723, 9185, 9237],
    "경남": [10850, 11120, 12502],
    "제주": [3808, 3553, 3627]
}

# DataFrame 생성
df = pd.DataFrame(data)

# 연도를 column header로 하여 지역별로 행을 재배치
df_melted = df.melt(id_vars=["연도"], var_name="name", value_name="population")

# 'name'으로 그룹화하고 연도별로 인구 데이터를 열로 피벗
df_pivot = df_melted.pivot(index='name', columns='연도', values='population')
df_pivot.columns = [f"{col}_population" for col in df_pivot.columns]

df_pivot.reset_index(inplace=True)
df_pivot



print(df_pivot)

df_pivot.to_csv('main/data/domestic_violence/report_신고건수', index=False)
