import { createClient } from '@sanity/client';
import fs from 'fs/promises';

const SANITY_CONFIG = {
  projectId: 'k5e2zsor',
  dataset: 'production',
  apiVersion: '2023-03-25',
  token: 'skT6pvHE7rWYOlYx4i3EnAOQVacZ9Y0otyflQuyP9YmEOcRH1kAeanKR7LWUzbHeQYjNbGWX9Z309Ilm7gs1awYFJb1UVxdX1B9sTx1SHvIuIg8KmRpPTRYuzifev2LgFjLi4AGgyUtyKWQXZmA61J2jHvFt0fwfxwSnDcxgowcQXEqPJCtW', // Replace with your token
  useCdn: false,
};

const INPUT_FILE_PATH = 'sanity-story-guide-from-posts-export.ndjson';

const client = createClient(SANITY_CONFIG);

function prepareDocument(doc) {
  // Always set the correct type to 'story'
  return {
    ...doc,
    _type: 'story', // Change to your schema name
    _id: undefined, // Remove _id so Sanity generates a new one
    _rev: undefined, // Remove _rev to avoid revision errors
  };
}

async function importStories() {
  const ndjson = await fs.readFile(INPUT_FILE_PATH, 'utf-8');
  const lines = ndjson.trim().split('\n');
  let success = 0, failed = 0;

  for (const [i, line] of lines.entries()) {
    if (!line.trim()) continue;
    let doc;
    try {
      doc = JSON.parse(line);
    } catch (err) {
      console.error(`Line ${i + 1}: Invalid JSON`);
      failed++;
      continue;
    }

    const toImport = prepareDocument(doc);
    try {
      const created = await client.create(toImport);
      console.log(`Created: ${created._id}`);
      success++;
    } catch (err) {
      console.error(`Failed to create document:`, err.message);
      failed++;
    }
  }
  console.log(`Done. Success: ${success}, Failed: ${failed}`);
}

importStories().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});