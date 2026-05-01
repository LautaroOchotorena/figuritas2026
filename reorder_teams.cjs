const fs = require('fs');

const orderedCodes = [
  'mex', 'rsa', 'kor', 'cze',
  'can', 'bih', 'qat', 'sui',
  'bra', 'mar', 'hai', 'sco',
  'usa', 'par', 'aus', 'tur',
  'ger', 'cur', 'civ', 'ecu',
  'ned', 'jpn', 'swe', 'tun',
  'bel', 'egy', 'irn', 'nzl',
  'esp', 'cpv', 'ksa', 'uru',
  'fra', 'sen', 'irq', 'nor',
  'arg', 'alg', 'aut', 'jor',
  'por', 'cod', 'uzb', 'col',
  'eng', 'cro', 'gha', 'pan',
  'fwc', 'cc'
];

let code = fs.readFileSync('src/data/teams.ts', 'utf8');

// The array starts at `export const TEAMS: Team[] = [`
// and ends at `];\n\n// ============================================================================`
const startRegex = /export const TEAMS: Team\[\] = \[\n/;
const matchStart = code.match(startRegex);
const startIndex = matchStart.index + matchStart[0].length;

const endMarker = '];\n\n// ============================================================================';
const endIndex = code.indexOf(endMarker);

const arrayContent = code.slice(startIndex, endIndex);

// We need to extract each team block.
// A team block is typically { code: ..., name: ..., ... }, possibly with comments.
const blocks = [];
let currentBlock = '';
let inBlock = false;
let braceCount = 0;

for (let i = 0; i < arrayContent.length; i++) {
  const char = arrayContent[i];
  if (char === '{') {
    if (braceCount === 0) inBlock = true;
    braceCount++;
  }
  if (inBlock) {
    currentBlock += char;
  }
  if (char === '}') {
    braceCount--;
    if (braceCount === 0) {
      inBlock = false;
      // Extract code to identify
      const codeMatch = currentBlock.match(/code:\s*'([^']+)'/);
      if (codeMatch) {
        blocks.push({
          code: codeMatch[1],
          text: currentBlock
        });
      }
      currentBlock = '';
    }
  }
}

// Reorder blocks
const newBlocksText = orderedCodes.map(code => {
  const b = blocks.find(x => x.code === code);
  return '  ' + b.text + ',';
}).join('\n');

const updatedCode = code.slice(0, startIndex) + newBlocksText + '\n' + code.slice(endIndex);

fs.writeFileSync('src/data/teams.ts', updatedCode);
console.log('Teams reordered.');
