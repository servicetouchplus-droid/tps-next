const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("Usage: node html-to-jsx.js <inputFileName> <outputDirPath>");
  process.exit(1);
}

const inputFileName = args[0];
const outputDirPath = args[1];

const inputFile = path.join(__dirname, '../public', inputFileName);
const outputFile = path.join(__dirname, '../', outputDirPath, 'page.js');

try {
  let html = fs.readFileSync(inputFile, 'utf-8');
  
  let content = "";
  
  // Essayer avec <main>
  const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
  let match = html.match(mainRegex);
  
  if (match) {
      content = match[1];
  } else {
      // S'il n'y a pas de <main>, on cherche entre le </header> et le <footer
      // Ou on prend tout le <body> et on enlève header et footer
      const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
      const bodyMatch = html.match(bodyRegex);
      if (bodyMatch) {
          content = bodyMatch[1];
          // Retirer le header s'il existe
          content = content.replace(/<header[\s\S]*?<\/header>/i, '');
          // Retirer le footer s'il existe
          content = content.replace(/<footer[\s\S]*?<\/footer>/i, '');
          // Retirer la modale si elle pose problème ou scripts
          content = content.replace(/<script[\s\S]*?<\/script>/ig, '');
      } else {
          console.error("Aucun body trouvé.");
          process.exit(1);
      }
  }
  
  content = content.replace(/class=/g, 'className=');
  content = content.replace(/for=/g, 'htmlFor=');
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  content = content.replace(/<img([^>]*[^\/])>/gi, '<img$1 />');
  content = content.replace(/<input([^>]*[^\/])>/gi, '<input$1 />');
  content = content.replace(/<br\s*>/gi, '<br />');
  content = content.replace(/<hr([^>]*[^\/])>/gi, '<hr$1 />');
  content = content.replace(/<hr\s*>/gi, '<hr />');

  // Corrections style & onClick
  content = content.replace(/style="([^"]+)"/g, (match, p1) => {
      const styleParts = p1.split(';').filter(s => s.trim());
      const styleObj = {};
      styleParts.forEach(part => {
          let [key, val] = part.split(':').map(s => s.trim());
          if (key && val) {
              key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              styleObj[key] = val;
          }
      });
      return `style={${JSON.stringify(styleObj)}}`;
  });
  
  content = content.replace(/onclick="([^"]*)"/gi, 'onClick={() => { /* $1 */ }}');
  content = content.replace(/onsubmit="([^"]*)"/gi, 'onSubmit={(e) => { e.preventDefault(); /* $1 */ }}');

  // SVG attributes
  const svgAttrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule'];
  svgAttrs.forEach(attr => {
      const camelAttr = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      content = content.replace(new RegExp(attr, 'g'), camelAttr);
  });

  const depth = outputDirPath.split('/').length - 2; 
  const compPath = depth > 0 ? '../'.repeat(depth) + 'components' : './components';

  const jsxFileContent = `
'use client';
import Navbar from '${compPath}/Navbar';
import Footer from '${compPath}/Footer';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Navbar />
      <div id="main-content">
        ${content}
      </div>
      <Footer />
    </>
  );
}
  `;
  
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, jsxFileContent, 'utf-8');
  console.log(`Conversion réussie ! Fichier créé : ${outputFile}`);
  
} catch (error) {
  console.error("Erreur:", error);
}
