const fs = require('fs');
const path = require('path');

const walk = (dir) => { 
  let results = []; 
  const list = fs.readdirSync(dir); 
  list.forEach(file => { 
    file = path.join(dir, file); 
    const stat = fs.statSync(file); 
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file)); 
    } else if (file.endsWith('.jsx')) { 
      results.push(file); 
    } 
  }); 
  return results; 
}; 
const files = walk(path.join(__dirname, 'client/src/components')).concat(walk(path.join(__dirname, 'client/src/pages')));
files.forEach(file => { 
  let content = fs.readFileSync(file, 'utf8'); 
  content = content.replace(/class=(["'{])/g, 'className=$1'); 
  fs.writeFileSync(file, content); 
  console.log('Fixed', file); 
});
