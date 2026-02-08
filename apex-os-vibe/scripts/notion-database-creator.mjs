#!/usr/bin/env node
/**
 * APEX OS - Notion Database Creator
 * 
 * Automatically creates the "Source Code - Content Library" database
 * with all required properties via Notion API
 */

import { Client } from '@notionhq/client';
import { writeFileSync } from 'fs';

const NOTION_TOKEN = process.argv[2];

if (!NOTION_TOKEN || !NOTION_TOKEN.startsWith('secret_')) {
  console.error('Error: Invalid Notion token');
  console.error('Usage: node notion-database-creator.mjs <notion-token>');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

async function createContentLibraryDatabase() {
  try {
    console.log('Creating Notion database...');
    
    // First, we need to create the database in the user's workspace
    // Note: We need a parent page ID. Let's search for the workspace
    const searchResults = await notion.search({
      filter: { property: 'object', value: 'page' },
      page_size: 1
    });

    if (searchResults.results.length === 0) {
      console.error('Error: No pages found in workspace');
      console.error('Please create at least one page in Notion first');
      process.exit(1);
    }

    // Use the first page as parent
    const parentPageId = searchResults.results[0].id;

    console.log(`Using parent page: ${parentPageId}`);
    console.log('Creating database...');

    const database = await notion.databases.create({
      parent: { 
        type: 'page_id',
        page_id: parentPageId 
      },
      icon: {
        type: 'emoji',
        emoji: '📚'
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Source Code - Content Library'
          }
        }
      ],
      properties: {
        'Title': {
          title: {}
        },
        'Source': {
          select: {
            options: [
              { name: 'VentureBeat', color: 'blue' },
              { name: 'Hacker News', color: 'orange' },
              { name: 'MarkTechPost', color: 'green' },
              { name: 'OpenAI', color: 'purple' },
              { name: 'YouTube', color: 'red' },
              { name: 'Other', color: 'gray' }
            ]
          }
        },
        'Source URL': {
          url: {}
        },
        'Content Type': {
          select: {
            options: [
              { name: 'How-To Guide', color: 'blue' },
              { name: 'Play Guide', color: 'green' },
              { name: 'Why This Works', color: 'purple' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Review Needed', color: 'yellow' },
              { name: 'Approved', color: 'green' },
              { name: 'Published', color: 'blue' },
              { name: 'Archived', color: 'gray' }
            ]
          }
        },
        'Tags': {
          multi_select: {
            options: [
              { name: 'AI', color: 'purple' },
              { name: 'Cloud', color: 'blue' },
              { name: 'Security', color: 'red' },
              { name: 'Web Dev', color: 'green' },
              { name: 'DevOps', color: 'orange' },
              { name: 'Career', color: 'pink' },
              { name: 'Open Source', color: 'gray' },
              { name: 'LLMs', color: 'purple' },
              { name: 'Infrastructure', color: 'blue' },
              { name: 'Frontend', color: 'green' },
              { name: 'Backend', color: 'yellow' }
            ]
          }
        },
        'Date Ingested': {
          date: {}
        },
        'Quality Score': {
          number: {
            format: 'number'
          }
        }
      }
    });

    console.log('✓ Database created successfully!');
    console.log(`  Database ID: ${database.id}`);
    console.log(`  URL: https://notion.so/${database.id.replace(/-/g, '')}`);

    // Save database ID to temp file for shell script
    writeFileSync('.notion-db-id.tmp', database.id);

    // Also print to stdout for script capture
    console.log(`\nDATABASE_ID=${database.id}`);

    return database.id;

  } catch (error) {
    console.error('Error creating database:', error);
    
    if (error.code === 'unauthorized') {
      console.error('\nThe integration token is invalid or has been revoked.');
      console.error('Please create a new integration at: https://www.notion.so/my-integrations');
    } else if (error.code === 'restricted_resource') {
      console.error('\nThe integration does not have access to the workspace.');
      console.error('Please share a page with your integration first.');
    } else {
      console.error('\nError details:', error.message);
    }
    
    process.exit(1);
  }
}

// Run
createContentLibraryDatabase()
  .then(() => {
    console.log('\n✓ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
