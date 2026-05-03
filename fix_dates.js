const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./web/src');
files.filter(f => f.endsWith('.tsx')).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('toLocaleDateString(undefined')) {
    fs.writeFileSync(file, content.replace(/toLocaleDateString\(undefined/g, 'toLocaleDateString("en-US"'));
    console.log('Updated ' + file);
  }
});
