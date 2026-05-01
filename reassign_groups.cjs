const fs = require('fs');

let code = fs.readFileSync('src/data/teams.ts', 'utf8');

// Match all group assignments
const teamMatches = [...code.matchAll(/code:\s*'([^']+)'[\s\S]*?group:\s*'([^']+)'/g)];

// Assign explicitly
const newGroups = {
  mex: 'A',
  can: 'B',
  usa: 'D'
};

const teams = teamMatches.map(m => m[1]).filter(c => c !== 'fwc' && c !== 'cc');
// Remove pre-assigned
const unassigned = teams.filter(c => !newGroups[c]);

const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
let groupCounts = {A:1, B:1, D:1};
groups.forEach(g => { if(!groupCounts[g]) groupCounts[g] = 0; });

unassigned.forEach(c => {
  let assignedGroup = groups.find(g => groupCounts[g] < 4);
  newGroups[c] = assignedGroup;
  groupCounts[assignedGroup]++;
});

let updatedCode = code;
for (const c of teams) {
  const regex = new RegExp(`(code:\\s*'${c}'[\\s\\S]*?group:\\s*')[^']+'`);
  updatedCode = updatedCode.replace(regex, `$1${newGroups[c]}'`);
}

fs.writeFileSync('src/data/teams.ts', updatedCode);
console.log('Groups reassigned successfully!');
