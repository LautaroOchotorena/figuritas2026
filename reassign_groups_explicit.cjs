const fs = require('fs');

const groupMapping = {
  mex: 'A', rsa: 'A', kor: 'A', cze: 'A',
  can: 'B', bih: 'B', qat: 'B', sui: 'B',
  bra: 'C', mar: 'C', hai: 'C', sco: 'C',
  usa: 'D', par: 'D', aus: 'D', tur: 'D',
  ger: 'E', cur: 'E', civ: 'E', ecu: 'E',
  ned: 'F', jpn: 'F', swe: 'F', tun: 'F',
  bel: 'G', egy: 'G', irn: 'G', nzl: 'G',
  esp: 'H', cpv: 'H', ksa: 'H', uru: 'H',
  fra: 'I', sen: 'I', irq: 'I', nor: 'I',
  arg: 'J', alg: 'J', aut: 'J', jor: 'J',
  por: 'K', cod: 'K', uzb: 'K', col: 'K',
  eng: 'L', cro: 'L', gha: 'L', pan: 'L'
};

let code = fs.readFileSync('src/data/teams.ts', 'utf8');

const teamMatches = [...code.matchAll(/code:\s*'([^']+)'[\s\S]*?group:\s*'([^']+)'/g)];
const teams = teamMatches.map(m => m[1]).filter(c => c !== 'fwc' && c !== 'cc');

let updatedCode = code;
for (const c of teams) {
  if (groupMapping[c]) {
    const regex = new RegExp(`(code:\\s*'${c}'[\\s\\S]*?group:\\s*')[^']+'`);
    updatedCode = updatedCode.replace(regex, `$1${groupMapping[c]}'`);
  }
}

// Change Coca-Cola flag to 'CC_LOGO'
updatedCode = updatedCode.replace(/(code:\s*'cc'[\s\S]*?flag:\s*)'🥤'/, `$1'CC_LOGO'`);

fs.writeFileSync('src/data/teams.ts', updatedCode);
console.log('Groups updated to explicit values.');
