# How to Add FAQ Content to Sanity

This guide explains how to add new FAQ sections to the Page FAQs in Sanity.

## Quick Steps

1. **Open the file**: src/migrations/faqRevamps.json

2. **Add your FAQ section** following the format below

3. **Run the upload script**: npm run upload-data

## FAQ Content Format

When you have FAQ content, provide it in this format:

Title: [Your FAQ Section Title]

1. [Question 1]

[Answer 1]

2. [Question 2]

[Answer 2]

3. [Question 3]

[Answer 3]

...

## Example

**Input:**

Title: Cloud Fax

1. What is Cloud Fax?

Cloud Fax is a secure, digital fax solution for healthcare practices.

2. How does it work?

It enables clinics to send, receive, and manage patient documents without paper.

**Output:** The FAQ will be automatically formatted and added to faqRevamps.json

## Important Notes

**Hide Category**: All FAQs are set to hideCategory: true by default

**Language**: All FAQs are set to language: "en" by default

**Structure**: Each FAQ section needs:

  - A unique _id (e.g., faq-revamp-your-section-name)

  - A sectionName (the title)

  - A slug (URL-friendly version of the title)

  - One or more categories with questions and answers

## Upload Process

1. Make sure your .env file has these variables:

   ```
   SANITY_STUDIO_PROJECT_ID=your-project-id
   SANITY_API_DATASET=your-dataset
   SANIT_API_EDITOR_TOKEN=your-write-token
   ```

2. Run the upload script:

   ```bash
   npm run upload-data
   ```



3. The script will:

   - Read faqRevamps.json

   - Upload all FAQ sections to Sanity

   - Show progress and summary

## What Gets Uploaded

The script uploads all FAQ sections from faqRevamps.json to your Sanity **Page FAQs** section. Each FAQ section will appear in Sanity Studio under "Page Faqs" with:

Section Name

Slug

FAQ Categories (hidden by default)

Questions and Answers

## Troubleshooting

**Missing keys error**: Make sure all _key properties are included (they're automatically added)

**Upload fails**: Check your environment variables and Sanity token permissions

**Data not appearing**: Make sure to publish the documents in Sanity Studio after upload

## Need Help?

If you need to add FAQs manually or modify the structure, refer to the existing entries in faqRevamps.json as examples.
