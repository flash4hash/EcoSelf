const fs = require('fs');
const path = require('path');

const files = [
  'client/src/components/Calculator.jsx',
  'client/src/pages/Dashboard.jsx',
  'client/src/pages/Profile.jsx',
  'client/src/pages/ActionHub.jsx',
  'client/src/pages/Community.jsx',
  'client/src/pages/Learn.jsx',
  'client/src/components/Navbar.jsx',
  'client/src/components/ChatBot.jsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/class=(["'{])/g, 'className=$1');
  fs.writeFileSync(fullPath, content);
  console.log('Fixed', file);
});
