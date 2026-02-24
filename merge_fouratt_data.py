import pandas as pd

# Load all three datasets
internet_df = pd.read_csv('data/internet-access.csv')
life_expectancy_df = pd.read_csv('data/life-expectancy.csv')
healthcare_df = pd.read_csv('data/healthcare-expenditure-per-capita.csv')
infant_mortality_df = pd.read_csv('data/infant-mortality.csv')

# Filter to 2022
year = 2022

internet_2022 = internet_df[internet_df['Year'] == year][['Entity', 'Code', 'Share of the population using the Internet']].copy()
internet_2022.columns = ['Country', 'Code', 'Internet']

life_2022 = life_expectancy_df[life_expectancy_df['Year'] == year][['Entity', 'Code', 'Life expectancy at birth, totals, period']].copy()
life_2022.columns = ['Country', 'Code', 'LifeExpectancy']

healthcare_2022 = healthcare_df[healthcare_df['Year'] == year][['Entity', 'Code', 'Current health expenditure per capita, PPP (current international $)']].copy()
healthcare_2022.columns = ['Country', 'Code', 'HealthcareSpending']

infant_2022 = infant_mortality_df[infant_mortality_df['Year'] == year][['Entity', 'Code', 'Infant mortality rate']].copy()
infant_2022.columns = ['Country', 'Code', 'InfantMortality']

# Merge on Code, but drop duplicate Country columns
merged = internet_2022.merge(life_2022[['Code', 'LifeExpectancy']], on='Code', how='inner')
merged = merged.merge(healthcare_2022[['Code', 'HealthcareSpending']], on='Code', how='inner')
merged = merged.merge(infant_2022[['Code', 'InfantMortality']], on='Code', how='inner')

# Remove rows with missing values
merged = merged.dropna()

# Sort by country
merged = merged.sort_values('Country')

print(f"Merged dataset shape: {merged.shape}")
print(f"Countries: {len(merged)}")
print(f"\nFirst few rows:")
print(merged.head(10))
print(f"\nData summary:")
print(merged.describe())

# Save
merged.to_csv('data/merged-data.csv', index=False)
print("\n✓ Saved to data/merged-data.csv")