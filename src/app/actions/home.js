'use server';

import { prisma } from '@/lib/prisma';

// MOCK DATA FALLBACKS
const MOCK_SERVICES = [
  { id: '1', title: 'Impression Digitale', description: 'Flyers, affiches, cartes de visite, bâches — qualité haute définition avec finitions premium.', iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.82l-.24-2.4a3 3 0 013-3h5.04a3 3 0 013 3l-.24 2.4m-10.56 0h11.04m-11.04 0v3.6A1.8 1.8 0 005.16 20h13.68a1.8 1.8 0 001.8-1.8v-3.6M8.28 8.4V4.8A1.8 1.8 0 0110.08 3h3.84a1.8 1.8 0 011.8 1.8V8.4M15 16.5h.008v.008H15v-.008zm-3 0h.008v.008H12v-.008zm-3 0h.008v.008H9v-.008z"/></svg>', colorHint: 'orange', orderIndex: 1 },
  { id: '2', title: 'Confection Textile', description: 'T-shirts, polos, casquettes personnalisés par sérigraphie, broderie ou transfert numérique.', iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8.25V6a2 2 0 012-2h3.5a1.5 1.5 0 011.5 1.5V6a1 1 0 002 0v-.5A1.5 1.5 0 0114.5 4H18a2 2 0 012 2v2.25m-16 0L5.5 12h2.25l.75 8h7l.75-8h2.25L20 8.25m-16 0h16"/></svg>', colorHint: 'purple', orderIndex: 2 },
  { id: '3', title: 'Packaging Premium', description: 'Boîtes, sacs, étiquettes et emballages sur mesure pour valoriser vos produits.', iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>', colorHint: 'green', orderIndex: 3 },
  { id: '4', title: 'Objets Publicitaires', description: 'Mugs, stylos, clés USB, goodies personnalisés pour vos événements et campagnes.', iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a3 3 0 113 3h-3zm0 0H9a3 3 0 113-3v3zm-7 3h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V11z"/></svg>', colorHint: 'pink', orderIndex: 4 }
];

const MOCK_REALISATIONS = [
  { id: '1', title: 'Packaging Cosmétique', clientName: 'Maison Karité', description: 'Design et impression de boîtes premiums avec dorure à chaud.', imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&h=400&fit=crop', category: 'packaging' },
  { id: '2', title: 'Branding Événementiel', clientName: 'Festival Abidjan', description: 'Production de 500 T-shirts sérigraphiés et 200 casquettes brodées.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop', category: 'textile' },
  { id: '3', title: 'Campagne Affichage', clientName: 'Bank of Africa', description: 'Impression de 50 bâches grand format (4x3m) pour campagne.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=400&fit=crop', category: 'impression' },
  { id: '4', title: 'Goodies d\'Entreprise', clientName: 'Orange CI', description: 'Personnalisation de 1000 clés USB et mugs.', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=400&fit=crop', category: 'publicitaire' }
];

const MOCK_POSTS = [
  { id: '1', title: 'Comment préparer son fichier pour l\'impression grand format ?', slug: 'preparer-fichier-grand-format', excerpt: 'Découvrez les règles d\'or pour éviter la pixellisation et obtenir un rendu parfait.', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop', category: 'Astuces Techniques' },
  { id: '2', title: 'Sérigraphie vs Flocage : Que choisir pour vos T-shirts ?', slug: 'serigraphie-vs-flocage', excerpt: 'Chaque technique a ses avantages. Voici comment faire le meilleur choix pour votre projet.', imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=500&fit=crop', category: 'Guide Textile' },
  { id: '3', title: 'L\'importance du packaging dans la perception de marque', slug: 'importance-packaging', excerpt: 'Un bon produit dans un mauvais emballage perd de sa valeur. Découvrez comment le packaging booste vos ventes.', imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=500&fit=crop', category: 'Marketing' }
];

export async function getPremiumServices() {
  try {
    const services = await prisma.service.findMany({ orderBy: { orderIndex: 'asc' }, take: 4 });
    return services.length ? services : MOCK_SERVICES;
  } catch (error) {
    console.warn('Prisma failing (expected if dummy env), using mock Services');
    return MOCK_SERVICES;
  }
}

export async function getRealisations(category = 'all') {
  try {
    const where = category === 'all' ? {} : { category };
    const realisations = await prisma.portfolio.findMany({ where, orderBy: { createdAt: 'desc' }, take: 8 });
    return realisations.length ? realisations : MOCK_REALISATIONS.filter(r => category === 'all' || r.category === category);
  } catch (error) {
    console.warn('Prisma failing (expected if dummy env), using mock Realisations');
    return MOCK_REALISATIONS.filter(r => category === 'all' || r.category === category);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 });
    return posts.length ? posts : MOCK_POSTS;
  } catch (error) {
    console.warn('Prisma failing (expected if dummy env), using mock Posts');
    return MOCK_POSTS;
  }
}
