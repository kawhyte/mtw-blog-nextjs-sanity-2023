import { createClient } from '@sanity/client';
import { log } from 'console';
import fs from 'fs/promises'; // Using promises for async/await

// --- Configuration ---
// Use the same environment variables as your Sanity CLI config if possible
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'k5e2zsor'; // Updated
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'; // Updated
const SANITY_API_VERSION = '2023-08-01'; // Use a recent API version

log(SANITY_PROJECT_ID);
    
// Optional: If your dataset is private, you'll need a token with read access.
// It's recommended to set this via an environment variable.
const SANITY_READ_TOKEN = process.env.SANITY_READ_TOKEN || null;

// Specify the document types you want to export.
// Example: ['post', 'author', 'category', 'story']
// We are looking for 'post' documents that represent stories/guides
const DOCUMENT_TYPE_TO_QUERY = 'post'; // This should be 'post'
const STORY_GUIDE_FILTER_FIELD = 'linkType'; // CONFIRM: This is the field in your 'post.ts' schema that marks a post as a story/guide.
const STORY_GUIDE_FILTER_VALUE = 'story'; // CONFIRM: This is the value of the above field for story/guide posts.

// Output file name
const OUTPUT_FILE = 'sanity-story-guide-from-posts-export.ndjson';
// --- End Configuration ---

async function exportSanityData() {
  if (SANITY_PROJECT_ID === 'your-project-id') {
    console.error(
      'Error: Please configure your SANITY_PROJECT_ID in the script or via the SANITY_PROJECT_ID environment variable.'
    );
    process.exit(1);
  }

  const clientConfig = {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false, // `false` for fresh data, `true` for cached (faster) data if acceptable
  };

  if (SANITY_READ_TOKEN) {
    clientConfig.token = SANITY_READ_TOKEN;
    // When using a token, useCdn is often set to false to ensure fresh data,
    // especially if the token grants access to private datasets or unpublished content.
    clientConfig.useCdn = false;
  }

  const client = createClient(clientConfig);

  try {
    console.log(
      `Connecting to Sanity project '${SANITY_PROJECT_ID}' dataset '${SANITY_DATASET}'...`
    );

    // Construct the query to fetch 'post' documents that are stories/guides
    const query = `*[_type == $docType && ${STORY_GUIDE_FILTER_FIELD} == $filterValue]`;
    const params = {
      docType: DOCUMENT_TYPE_TO_QUERY,
      filterValue: STORY_GUIDE_FILTER_VALUE,
    };

    console.log(
      `Fetching '${DOCUMENT_TYPE_TO_QUERY}' documents where '${STORY_GUIDE_FILTER_FIELD}' is '${STORY_GUIDE_FILTER_VALUE}'...`
    );
    const documents = await client.fetch(query, params);

    if (!documents || documents.length === 0) {
      console.log('No documents found for the specified types.');
      return;
    }

    console.log(`Fetched ${documents.length} documents.`);

    // Format as newline-delimited JSON (NDJSON)
    const ndjsonData = documents.map((doc) => JSON.stringify(doc)).join('\n');

    await fs.writeFile(OUTPUT_FILE, ndjsonData);
    console.log(`Successfully exported data to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error exporting data from Sanity:', error.message);
    process.exit(1);
  }
}

exportSanityData();