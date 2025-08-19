import { createClient } from 'next-sanity'
import fs from 'fs';  // If you're using Node.js to read the image files
import dotenv from 'dotenv';
dotenv.config()



const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID , // Replace with your Sanity project ID
    dataset: process.env.SANITY_API_DATASET,   // Replace with your dataset name
    apiVersion: "2023-06-21",
    useCdn: "false",      // Disable CDN for write operations
    token: process.env.SANIT_API_EDITOR_TOKEN
  });

// Function to upload an icon
async function uploadIcon(iconPath) {
  const iconFile = fs.readFileSync(iconPath);  // Read the icon file (this example assumes Node.js)
  const iconAsset = await client.assets.upload('image', iconFile, {
    filename: 'point.svg',  // Replace with actual file name and type if needed
  });
  return iconAsset._id;  // Return the icon asset ID
}


(async () => {
    await uploadIcon("/home/gopi/osdental-website/public/badcross.png")
    await uploadIcon("/home/gopi/osdental-website/public/exclamation.png")
    await uploadIcon("/home/gopi/osdental-website/public/goodtick.png")
})()
