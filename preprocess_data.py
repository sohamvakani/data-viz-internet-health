import pandas as pd

# Load both datasets
internet_df = pd.read_csv('data/internet-access.csv')
life_expectancy_df = pd.read_csv('data/life-expectancy.csv')

# Check actual column names
print("Internet columns:", internet_df.columns.tolist())
print("Life Expectancy columns:", life_expectancy_df.columns.tolist())

# Find the most recent year that has data in BOTH datasets
internet_years = set(internet_df['Year'].unique())
life_years = set(life_expectancy_df['Year'].unique())
common_years = sorted(internet_years & life_years)

if common_years:
    most_recent_year = common_years[-2]
    print(f"\nMost recent year with data in both datasets: {most_recent_year}")
else:
    print("No common years found!")
    exit()

# Filter both datasets to the most recent year
# Use the actual column names from your datasets
internet_recent = internet_df[internet_df['Year'] == most_recent_year][['Entity', 'Code', 'Share of the population using the Internet']]
internet_recent.columns = ['Country', 'Code', 'InternetAccess']

life_recent = life_expectancy_df[life_expectancy_df['Year'] == most_recent_year][['Entity', 'Code', 'Life expectancy at birth, totals, period']]
life_recent.columns = ['Country', 'Code', 'LifeExpectancy']

# Merge on Code (more reliable than Entity name)
merged_df = internet_recent.merge(life_recent, on='Code', how='inner')

# Clean up - keep only the columns we need
merged_df = merged_df[['Country_x', 'Code', 'InternetAccess', 'LifeExpectancy']]
merged_df.columns = ['Country', 'Code', 'InternetAccess', 'LifeExpectancy']

# Remove any rows with missing values
merged_df = merged_df.dropna()

# Sort by country name for easier debugging
merged_df = merged_df.sort_values('Country')

print(f"\nMerged dataset shape: {merged_df.shape}")
print(f"Countries in final dataset: {len(merged_df)}")
print(f"\nFirst few rows:")
print(merged_df.head(10))
print(f"\nLast few rows:")
print(merged_df.tail(10))
print(f"\nData summary:")
print(merged_df.describe())

# Save the merged data
merged_df.to_csv('data/merged-data.csv', index=False)
print("\n✓ Saved to data/merged-data.csv")