import pandas as pd
import PyPDF2
import json
import sys

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# Extract text from PDFs
print("=" * 80)
print("EXTRACTING MASTER PROMPT PDF")
print("=" * 80)
try:
    with open('_MASTER PROMPT(CROP ADVISORY).pdf', 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"\nNumber of pages: {len(pdf_reader.pages)}")
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            text += f"\n--- Page {i+1} ---\n{page_text}"
        
        # Save to file
        with open('master_prompt_extracted.txt', 'w', encoding='utf-8') as out:
            out.write(text)
        print("✓ Extracted and saved to master_prompt_extracted.txt")
except Exception as e:
    print(f"Error reading Master Prompt PDF: {e}")

print("\n" + "=" * 80)
print("EXTRACTING PRD PDF")
print("=" * 80)
try:
    with open('📋 AI-Enabled Precision Fertilizer Advisory System PRD.pdf', 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"\nNumber of pages: {len(pdf_reader.pages)}")
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            text += f"\n--- Page {i+1} ---\n{page_text}"
        
        # Save to file
        with open('prd_extracted.txt', 'w', encoding='utf-8') as out:
            out.write(text)
        print("✓ Extracted and saved to prd_extracted.txt")
except Exception as e:
    print(f"Error reading PRD PDF: {e}")

# Save dataset summaries
print("\n" + "=" * 80)
print("SAVING DATASET SUMMARIES")
print("=" * 80)

try:
    df_soil = pd.read_excel('ntr-soil.xls')
    with open('ntr_soil_summary.txt', 'w', encoding='utf-8') as f:
        f.write("NTR SOIL DATA SUMMARY\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Shape: {df_soil.shape}\n\n")
        f.write(f"Columns: {list(df_soil.columns)}\n\n")
        f.write(f"Sample data:\n{df_soil.head(10).to_string()}\n\n")
        f.write(f"Unique values per column:\n")
        for col in df_soil.columns:
            f.write(f"\n{col}: {df_soil[col].nunique()} unique values\n")
            f.write(f"Sample values: {df_soil[col].unique()[:5].tolist()}\n")
    print("✓ Saved NTR soil summary")
except Exception as e:
    print(f"Error: {e}")

try:
    df_mandals = pd.read_excel('NTR-7 mandals e panta and SHC sample data.xlsx')
    with open('mandals_summary.txt', 'w', encoding='utf-8') as f:
        f.write("NTR-7 MANDALS E PANTA AND SHC SAMPLE DATA SUMMARY\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Shape: {df_mandals.shape}\n\n")
        f.write(f"Columns: {list(df_mandals.columns)}\n\n")
        f.write(f"Sample data:\n{df_mandals.head(10).to_string()}\n\n")
        f.write(f"Unique values per column:\n")
        for col in df_mandals.columns:
            f.write(f"\n{col}: {df_mandals[col].nunique()} unique values\n")
            if df_mandals[col].nunique() < 20:
                f.write(f"All values: {df_mandals[col].unique().tolist()}\n")
            else:
                f.write(f"Sample values: {df_mandals[col].unique()[:10].tolist()}\n")
    print("✓ Saved Mandals data summary")
except Exception as e:
    print(f"Error: {e}")

print("\n✓ All extractions complete!")
