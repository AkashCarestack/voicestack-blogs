# Migration Scripts for Pages and FAQs

This directory contains scripts and data files for uploading page and FAQ data to Sanity.

## Files

- `upload-pages-and-faqs.js` - Main script to upload pages, FAQs, and FAQ Revamps
- `pages.json` - Example page data
- `faqs.json` - Example FAQ data
- `faqRevamps.json` - Example FAQ Revamp (Page FAQs) data

## Setup

1. Make sure you have the required environment variables set in your `.env` file:
   ```
   SANITY_STUDIO_PROJECT_ID=your-project-id
   SANITY_API_DATASET=your-dataset
   SANIT_API_EDITOR_TOKEN=your-write-token
   ```

   Or use the Next.js environment variables:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=your-dataset
   SANITY_API_WRITE_TOKEN=your-write-token
   ```

## Usage

### Option 1: Run the script directly

```bash
node src/migrations/upload-pages-and-faqs.js
```

This will automatically look for and upload:
- `pages.json` - Page documents
- `faqs.json` - FAQ documents
- `faqRevamps.json` - FAQ Revamp documents

### Option 2: Import and use in your own script

```javascript
import { uploadPages, uploadFaqs, uploadFaqRevamps } from './src/migrations/upload-pages-and-faqs.js'

// Upload pages
await uploadPages('pages.json')

// Upload FAQs
await uploadFaqs('faqs.json')

// Upload FAQ Revamps
await uploadFaqRevamps('faqRevamps.json')
```

## Data Structure

### Page Document (`page`)

```json
{
  "_id": "unique-page-id",
  "_type": "page",
  "title": "Page Title",
  "slug": {
    "_type": "slug",
    "current": "page-slug"
  },
  "content": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Your content here"
        }
      ]
    }
  ],
  "language": "en"
}
```

### FAQ Document (`faq`)

```json
{
  "_id": "unique-faq-id",
  "_type": "faq",
  "question": "Your question?",
  "answer": "Your answer",
  "order": 1,
  "language": "en"
}
```

### FAQ Revamp Document (`faqRevamp`)

```json
{
  "_id": "unique-faq-revamp-id",
  "_type": "faqRevamp",
  "sectionName": "Section Name",
  "slug": {
    "_type": "slug",
    "current": "section-slug"
  },
  "faqCategories": [
    {
      "_type": "faqCategory",
      "_key": "unique-key",
      "categoryName": "Category Name",
      "questions": [
        {
          "_type": "faqItem",
          "_key": "unique-key",
          "question": "Question?",
          "answer": [
            {
              "_type": "block",
              "style": "normal",
              "children": [
                {
                  "_type": "span",
                  "text": "Answer text"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "hideCategory": false,
  "language": "en"
}
```

## Notes

- The script uses `createOrReplace`, so if a document with the same `_id` exists, it will be replaced
- All documents are uploaded as drafts by default
- Make sure to publish documents in Sanity Studio if you want them to be visible on your site
- The script will skip files that don't exist (no error thrown)
- Each upload operation is logged to the console

## Troubleshooting

1. **Missing environment variables**: Make sure all required environment variables are set
2. **Permission errors**: Ensure your write token has the correct permissions
3. **Invalid data structure**: Check that your JSON files match the expected schema
4. **Network errors**: Check your internet connection and Sanity project status

