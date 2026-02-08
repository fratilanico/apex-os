#!/usr/bin/env ts-node
/**
 * APEX OS - Guide Generation Test Script
 * 
 * Tests the complete guide generation pipeline locally
 */

import { generateGuides } from '../lib/guide-generator/vertex-ai-generator';
import { publishToNotion } from '../lib/guide-generator/notion-publisher';

const TEST_CONTENT = {
  title: "GPT-5 Released with Revolutionary Multimodal Capabilities",
  content: `
    OpenAI today announced GPT-5, the next generation of their language model
    with groundbreaking multimodal capabilities. The new model can seamlessly
    process text, images, audio, and video in a unified architecture.
    
    Key features include:
    - 10x faster inference than GPT-4
    - Native video understanding and generation
    - Real-time voice conversations with emotion detection
    - Advanced reasoning capabilities for complex problem-solving
    
    Developers can access GPT-5 through the OpenAI API starting today.
    Pricing starts at $0.01 per 1,000 tokens.
    
    Early benchmarks show GPT-5 outperforms GPT-4 on:
    - Coding tasks (95% success rate vs 78%)
    - Mathematical reasoning (92% vs 73%)
    - Creative writing (human evaluators preferred GPT-5 84% of the time)
    
    The model introduces a new "chain of thought" visualization feature
    that shows its reasoning process in real-time, making it easier for
    developers to understand and debug AI-powered applications.
  `,
  source: "OpenAI",
  url: "https://openai.com/blog/gpt-5",
  publishedAt: new Date().toISOString(),
  contentType: "news" as const
};

async function testGuideGeneration() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  GUIDE GENERATION TEST                                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Generate guides
    console.log('[1/3] Generating guides with Vertex AI...');
    const guides = await generateGuides(TEST_CONTENT);
    
    console.log('\n✓ Generated 3 guides:');
    console.log(`  - How-To Guide: ${guides.howTo.substring(0, 50)}...`);
    console.log(`  - Play Guide: ${guides.playGuide.substring(0, 50)}...`);
    console.log(`  - Why This Works: ${guides.whyThisWorks.substring(0, 50)}...`);
    console.log(`  - Tags: ${guides.suggestedTags.join(', ')}`);

    // Step 2: Publish to Notion
    console.log('\n[2/3] Publishing to Notion...');
    const pages = await publishToNotion(TEST_CONTENT, guides);
    
    console.log('\n✓ Published to Notion:');
    pages.forEach((page, idx) => {
      console.log(`  ${idx + 1}. ${page.url}`);
    });

    // Step 3: Success
    console.log('\n[3/3] Test complete!\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  ✓ ALL TESTS PASSED                                      ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    return true;

  } catch (error) {
    console.error('\n✗ Test failed:', error);
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  ✗ TEST FAILED - Check configuration                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('\nStack trace:', error.stack);
    }
    
    return false;
  }
}

// Run test
testGuideGeneration()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
