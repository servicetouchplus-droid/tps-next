const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // 1. Seed Services
  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Impression Digitale',
        description: 'Flyers, affiches, cartes de visite, bâches — qualité haute définition avec finitions premium.',
        iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.82l-.24-2.4a3 3 0 013-3h5.04a3 3 0 013 3l-.24 2.4m-10.56 0h11.04m-11.04 0v3.6A1.8 1.8 0 005.16 20h13.68a1.8 1.8 0 001.8-1.8v-3.6M8.28 8.4V4.8A1.8 1.8 0 0110.08 3h3.84a1.8 1.8 0 011.8 1.8V8.4M15 16.5h.008v.008H15v-.008zm-3 0h.008v.008H12v-.008zm-3 0h.008v.008H9v-.008z"/></svg>',
        colorHint: 'orange',
        orderIndex: 1
      },
      {
        title: 'Confection Textile',
        description: 'T-shirts, polos, casquettes personnalisés par sérigraphie, broderie ou transfert numérique.',
        iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8.25V6a2 2 0 012-2h3.5a1.5 1.5 0 011.5 1.5V6a1 1 0 002 0v-.5A1.5 1.5 0 0114.5 4H18a2 2 0 012 2v2.25m-16 0L5.5 12h2.25l.75 8h7l.75-8h2.25L20 8.25m-16 0h16"/></svg>',
        colorHint: 'purple',
        orderIndex: 2
      },
      {
        title: 'Packaging Premium',
        description: 'Boîtes, sacs, étiquettes et emballages sur mesure pour valoriser vos produits.',
        iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
        colorHint: 'green',
        orderIndex: 3
      },
      {
        title: 'Objets Publicitaires',
        description: 'Mugs, stylos, clés USB, goodies personnalisés pour vos événements et campagnes.',
        iconSvg: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a3 3 0 113 3h-3zm0 0H9a3 3 0 113-3v3zm-7 3h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V11z"/></svg>',
        colorHint: 'pink',
        orderIndex: 4
      }
    ]
  });

  // 2. Seed Portfolio (Réalisations)
  await prisma.portfolio.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Packaging Cosmétique',
        clientName: 'Maison Karité',
        description: 'Design et impression de boîtes premiums avec dorure à chaud pour une marque de cosmétique locale.',
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&h=400&fit=crop',
        category: 'packaging'
      },
      {
        title: 'Branding Événementiel',
        clientName: 'Festival Abidjan',
        description: 'Production de 500 T-shirts sérigraphiés et 200 casquettes brodées pour le staff.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop',
        category: 'textile'
      },
      {
        title: 'Campagne Affichage',
        clientName: 'Bank of Africa',
        description: 'Impression de 50 bâches grand format (4x3m) pour une campagne nationale.',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=400&fit=crop',
        category: 'impression'
      },
      {
        title: 'Goodies d\'Entreprise',
        clientName: 'Orange CI',
        description: 'Personnalisation de 1000 clés USB et mugs pour la fin d\'année.',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=400&fit=crop',
        category: 'publicitaire'
      }
    ]
  });

  // 3. Seed Blog Posts
  await prisma.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Comment préparer son fichier pour l\'impression grand format ?',
        slug: 'preparer-fichier-impression-grand-format',
        excerpt: 'Découvrez les règles d\'or pour éviter la pixellisation et obtenir un rendu parfait sur vos bâches et roll-ups.',
        content: '<p>Pour réussir une impression grand format, la résolution est la clé. Contrairement aux petits formats qui exigent du 300 DPI, un grand format peut souvent se contenter de 100 à 150 DPI à taille réelle, car il est vu de plus loin.</p><p>N\'oubliez pas vos fonds perdus et privilégiez toujours le mode colorimétrique CMJN !</p>',
        imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop',
        category: 'Astuces Techniques',
        author: 'Jean Kouamé'
      },
      {
        title: 'Sérigraphie vs Flocage : Que choisir pour vos T-shirts ?',
        slug: 'serigraphie-vs-flocage-que-choisir',
        excerpt: 'Chaque technique d\'impression textile a ses avantages. Voici comment faire le meilleur choix pour votre projet.',
        content: '<p>La sérigraphie est idéale pour les grandes quantités et garantit une durabilité exceptionnelle. L\'encre pénètre directement la fibre. Le flocage (ou transfert), quant à lui, est parfait pour les petites séries ou les numéros sportifs, bien que l\'aspect soit plus "plastique".</p>',
        imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=500&fit=crop',
        category: 'Guide Textile',
        author: 'Aïssata Diop'
      },
      {
        title: 'L\'importance du packaging dans la perception de votre marque',
        slug: 'importance-packaging-perception-marque',
        excerpt: 'Un bon produit dans un mauvais emballage perd de sa valeur. Découvrez comment le packaging booste vos ventes.',
        content: '<p>L\'unboxing est devenu une véritable expérience. Un emballage soigné (dorure, vernis sélectif, carton rigide) envoie un signal fort au consommateur : il achète un produit premium. Pensez au parcours de déballage de votre client avant même de concevoir l\'objet.</p>',
        imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=500&fit=crop',
        category: 'Marketing',
        author: 'Marie Yéo'
      }
    ]
  });

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
