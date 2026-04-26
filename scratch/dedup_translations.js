const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/translations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// For each language block, remove truly duplicate keys (keep first occurrence)
// Split into language blocks, deduplicate keys in each, then rejoin
// Strategy: find each lang block and deduplicate lines with key: value pattern

function deduplicateBlock(block) {
  const lines = block.split('\n');
  const seen = new Set();
  const result = [];
  for (const line of lines) {
    const match = line.match(/^\s+(\w+):/);
    if (match) {
      const key = match[1];
      if (seen.has(key)) {
        // Skip duplicate - this is the second occurrence
        continue;
      }
      seen.add(key);
    }
    result.push(line);
  }
  return result.join('\n');
}

// Split by language object boundaries  
// We'll do a simple approach: find all duplicate lines in each block and remove
const langs = ['EN', 'HI', 'TE', 'ES', 'FR'];
for (const lang of langs) {
  // Find start and end of each language block
  const startPattern = new RegExp('  ' + lang + ': \\{');
  const startIdx = content.indexOf('  ' + lang + ': {');
  if (startIdx === -1) continue;
  
  // Find the matching closing brace
  let braceCount = 0;
  let i = startIdx;
  let inBlock = false;
  let endIdx = -1;
  
  while (i < content.length) {
    if (content[i] === '{') {
      braceCount++;
      inBlock = true;
    } else if (content[i] === '}') {
      braceCount--;
      if (inBlock && braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
    i++;
  }
  
  if (endIdx === -1) continue;
  
  const blockContent = content.slice(startIdx, endIdx);
  const deduped = deduplicateBlock(blockContent);
  content = content.slice(0, startIdx) + deduped + content.slice(endIdx);
}

fs.writeFileSync(filePath, content);
console.log('Deduplication complete.');
