import { createClient } from 'next-sanity'
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config()


const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID , // Replace with your Sanity project ID
  dataset: process.env.SANITY_API_DATASET,   // Replace with your dataset name
  apiVersion: "2023-06-21",
  useCdn: "false",      // Disable CDN for write operations
  token: process.env.SANIT_API_EDITOR_TOKEN
});


const uploadData = async () => {
  const data = JSON.parse(readFileSync('/home/gopi/osdental-website/src/migrations/comparison.json', 'utf8'));
  for (const item of data) {
    try {
      const res = await client.createOrReplace(item);

    } catch (error) {
      // Upload failed silently
    }
  }
};


(async () => {
  await uploadData();
})() 
  
