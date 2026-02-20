#code to run through both excel files and find the countries that exist in both and have data for 2023 
#find total number of unique countries each dataset 

import pandas as pd 

#Loading both datasets 
internet_df = pd.read_csv('data/internet-access.csv')
life_expectancy_df = pd.read_csv('data/life-expectancy.csv')

#Get unique countries in each dataset 
internet_countries = internet_df['Entity'].unique()
life_expectancy_countries = life_expectancy_df['Entity'].unique()

print(f"Internet access - unique countries: {len(internet_countries)}")
print(f"Life Expectancy - Unique contries :{len(life_expectancy_countries)}")

