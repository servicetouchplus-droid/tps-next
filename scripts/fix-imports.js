const fs = require('fs');
const path = require('path');

const folders = ['about', 'blog', 'contact', 'realisations', 'services'];
const basePath = path.join(__dirname, '../src/app');

folders.forEach(folder => {
    const filePath = path.join(basePath, folder, 'page.js');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        // Remplacer l'import défectueux
        content = content.replace(/import Navbar from '.\/components\/Navbar';/g, "import Navbar from '../components/Navbar';");
        content = content.replace(/import Footer from '.\/components\/Footer';/g, "import Footer from '../components/Footer';");
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Corrigé : ${filePath}`);
    } else {
        console.log(`Fichier non trouvé : ${filePath}`);
    }
});
