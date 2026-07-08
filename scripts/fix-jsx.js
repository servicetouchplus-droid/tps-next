const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../src/app/page.js');

try {
  let content = fs.readFileSync(pageFile, 'utf-8');
  
  // Correction des styles
  content = content.replace(/style="animation-delay:\s*([^"]+)"/g, 'style={{animationDelay: "$1"}}');
  content = content.replace(/style="background:\s*([^"]+)"/g, 'style={{background: "$1"}}');
  content = content.replace(/style="min-height:\s*([^"]+)"/g, 'style={{minHeight: "$1"}}');
  
  // Correction des onclick -> onClick
  content = content.replace(/onclick="([^"]*)"/gi, 'onClick={() => { /* $1 */ }}');
  
  // Remplacer class= restant
  content = content.replace(/ class=/g, ' className=');
  
  fs.writeFileSync(pageFile, content, 'utf-8');
  console.log("Corrections JSX appliquées avec succès !");
} catch(e) {
  console.error("Erreur", e);
}
