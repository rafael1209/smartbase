const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of muirtl-orq8zk in index.html
let pos = 0;
console.log("Searching for muirtl-orq8zk in index.html:");
while ((pos = html.indexOf('muirtl-orq8zk', pos)) !== -1) {
    const start = Math.max(0, pos - 150);
    const end = Math.min(html.length, pos + 150);
    console.log(`- Match at pos ${pos}: ${html.substring(start, end).replace(/\s+/g, ' ')}`);
    pos += 'muirtl-orq8zk'.length;
}
