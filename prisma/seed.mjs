/**
 * Touch+ SaaS — Database Seed Script
 * Initializes roles, permissions, default site config, and sample catalog data.
 * Run with: node prisma/seed.mjs
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually since Prisma CLI uses .env
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          const key = trimmed.substring(0, idx).trim();
          const value = trimmed.substring(idx + 1).trim();
          if (!process.env[key]) process.env[key] = value;
        }
      }
    }
  } catch (e) {
    console.log('No .env.local found, using .env');
  }
}
loadEnv();

const dbUrl = process.env.SEED_DATABASE_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: { db: { url: dbUrl } }
});

// =============================================================
// PERMISSIONS DEFINITION
// =============================================================
const PERMISSIONS = [
  // Orders
  { module: 'orders', action: 'read',   label: 'Voir les commandes',        description: 'Accès en lecture à toutes les commandes' },
  { module: 'orders', action: 'write',  label: 'Créer/modifier commandes',  description: 'Créer et modifier les commandes' },
  { module: 'orders', action: 'delete', label: 'Supprimer commandes',       description: 'Supprimer des commandes' },
  { module: 'orders', action: 'manage', label: 'Gérer la production',       description: 'Changer les statuts, assigner les opérateurs' },

  // Quotes
  { module: 'quotes', action: 'read',   label: 'Voir les devis',            description: 'Accès en lecture aux devis' },
  { module: 'quotes', action: 'write',  label: 'Créer/modifier devis',      description: 'Créer et envoyer des devis aux clients' },
  { module: 'quotes', action: 'delete', label: 'Supprimer devis',           description: 'Supprimer des devis' },
  { module: 'quotes', action: 'manage', label: 'Gérer les devis',           description: 'Convertir devis en commandes, changer statuts' },

  // Users
  { module: 'users',  action: 'read',   label: 'Voir les utilisateurs',     description: 'Accès à la liste des utilisateurs' },
  { module: 'users',  action: 'write',  label: 'Modifier utilisateurs',     description: 'Modifier les profils et infos utilisateurs' },
  { module: 'users',  action: 'delete', label: 'Supprimer utilisateurs',    description: 'Désactiver ou supprimer des comptes' },
  { module: 'users',  action: 'manage', label: 'Gérer les rôles',           description: 'Attribuer et modifier les rôles utilisateurs' },

  // CMS
  { module: 'cms',    action: 'read',   label: 'Voir le contenu CMS',       description: 'Voir les articles, services, portfolio' },
  { module: 'cms',    action: 'write',  label: 'Éditer le contenu CMS',     description: 'Créer et modifier le contenu du site' },
  { module: 'cms',    action: 'delete', label: 'Supprimer contenu CMS',     description: 'Supprimer des articles, portfolio' },
  { module: 'cms',    action: 'manage', label: 'Gérer tout le CMS',         description: 'Accès complet au CMS (blog, équipe, FAQ, paramètres)' },

  // Catalog
  { module: 'catalog', action: 'read',  label: 'Voir le catalogue',         description: 'Voir les produits et catégories' },
  { module: 'catalog', action: 'write', label: 'Modifier le catalogue',     description: 'Créer et modifier produits et catégories' },
  { module: 'catalog', action: 'manage',label: 'Gérer le catalogue',        description: 'Gestion complète du catalogue produits' },

  // Analytics
  { module: 'analytics', action: 'read', label: 'Voir les statistiques',   description: 'Accès aux tableaux de bord analytiques' },
  { module: 'analytics', action: 'manage', label: 'Gérer les rapports',    description: 'Exporter et configurer les rapports' },

  // Settings
  { module: 'settings', action: 'read',   label: 'Voir les paramètres',    description: 'Voir la configuration de la plateforme' },
  { module: 'settings', action: 'manage', label: 'Gérer les paramètres',   description: 'Modifier la configuration complète de la plateforme' },

  // Production (specific to production staff)
  { module: 'production', action: 'read',   label: 'Voir la file production', description: 'Voir les tâches de production assignées' },
  { module: 'production', action: 'manage', label: 'Gérer la production',     description: 'Mettre à jour l\'avancement des impressions' },

  // Audit
  { module: 'audit', action: 'read', label: 'Voir le journal d\'audit',    description: 'Accès au journal des actions utilisateurs' },
];

// =============================================================
// ROLES DEFINITION WITH PERMISSIONS
// =============================================================
const ROLES = [
  {
    name: 'ADMIN',
    label: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme.',
    color: '#6366f1',
    isSystem: true,
    permissions: 'ALL', // All permissions
  },
  {
    name: 'COMMERCIAL',
    label: 'Commercial',
    description: 'Gestion des devis, commandes et portefeuille clients.',
    color: '#10b981',
    isSystem: true,
    permissions: [
      'orders:read', 'orders:write', 'orders:manage',
      'quotes:read', 'quotes:write', 'quotes:manage', 'quotes:delete',
      'users:read',
      'catalog:read',
      'analytics:read',
    ],
  },
  {
    name: 'PRODUCTION',
    label: 'Opérateur Production',
    description: 'Gestion de la file de production, mise à jour des statuts d\'impression.',
    color: '#f59e0b',
    isSystem: true,
    permissions: [
      'orders:read', 'orders:manage',
      'production:read', 'production:manage',
      'catalog:read',
    ],
  },
  {
    name: 'EDITOR',
    label: 'Rédacteur / Content Manager',
    description: 'Gestion du contenu éditorial du site (blog, portfolio, équipe).',
    color: '#8b5cf6',
    isSystem: true,
    permissions: [
      'cms:read', 'cms:write', 'cms:delete',
    ],
  },
  {
    name: 'CLIENT',
    label: 'Client',
    description: 'Accès à l\'espace client : commandes, suivi, profil.',
    color: '#64748b',
    isSystem: true,
    permissions: [], // Clients have no backend permissions, access managed by UI
  },
];

// =============================================================
// DEFAULT SITE CONFIG
// =============================================================
const SITE_CONFIG = [
  // General
  { key: 'site_name',        value: 'Touch+ Services',                    type: 'text',    group: 'general', label: 'Nom du site' },
  { key: 'site_tagline',     value: 'Impression & Communication Visuelle', type: 'text',    group: 'general', label: 'Slogan' },
  { key: 'site_url',         value: 'https://touchplus.ci',               type: 'url',     group: 'general', label: 'URL du site' },
  { key: 'contact_email',    value: 'contact@touchplus.ci',               type: 'text',    group: 'contact', label: 'Email de contact' },
  { key: 'contact_phone',    value: '+225 07 00 00 00 00',                type: 'text',    group: 'contact', label: 'Téléphone' },
  { key: 'contact_address',  value: 'Abidjan, Côte d\'Ivoire',            type: 'text',    group: 'contact', label: 'Adresse' },
  { key: 'contact_whatsapp', value: '',                                   type: 'text',    group: 'contact', label: 'WhatsApp' },

  // Branding
  { key: 'logo_url',         value: '',                                   type: 'url',     group: 'branding', label: 'URL du logo' },
  { key: 'favicon_url',      value: '',                                   type: 'url',     group: 'branding', label: 'URL du favicon' },
  { key: 'color_primary',    value: '#f97316',                            type: 'color',   group: 'branding', label: 'Couleur principale' },
  { key: 'color_secondary',  value: '#fbbf24',                            type: 'color',   group: 'branding', label: 'Couleur secondaire' },

  // SEO
  { key: 'seo_title',        value: 'Touch+ Services – Impression Professionnelle Abidjan', type: 'text', group: 'seo', label: 'Titre SEO global' },
  { key: 'seo_description',  value: 'Imprimerie professionnelle à Abidjan. Grand format, textile, packaging, cartes de visite.', type: 'text', group: 'seo', label: 'Description SEO' },
  { key: 'og_image_url',     value: '',                                   type: 'url',     group: 'seo', label: 'Image OG par défaut' },

  // Social
  { key: 'social_facebook',  value: '',                                   type: 'url',     group: 'social', label: 'Facebook' },
  { key: 'social_instagram', value: '',                                   type: 'url',     group: 'social', label: 'Instagram' },
  { key: 'social_linkedin',  value: '',                                   type: 'url',     group: 'social', label: 'LinkedIn' },
  { key: 'social_twitter',   value: '',                                   type: 'url',     group: 'social', label: 'Twitter / X' },

  // Email
  { key: 'email_from_name',  value: 'Touch+ Services',                   type: 'text',    group: 'email', label: 'Nom expéditeur email' },
  { key: 'email_from_addr',  value: 'noreply@touchplus.ci',              type: 'text',    group: 'email', label: 'Adresse expéditeur email' },
  { key: 'email_footer',     value: 'Touch+ Services | Abidjan, Côte d\'Ivoire', type: 'text', group: 'email', label: 'Pied de page des emails' },
];

// =============================================================
// DEFAULT PRODUCT CATEGORIES & PRODUCTS
// =============================================================
const PRODUCT_CATEGORIES = [
  { name: 'Grand Format',   slug: 'grand-format',   description: 'Bâches, roll-up, kakémonos, banderoles', orderIndex: 0 },
  { name: 'Carterie',       slug: 'carterie',       description: 'Cartes de visite, flyers, affiches, catalogues', orderIndex: 1 },
  { name: 'Textile',        slug: 'textile',        description: 'T-shirts, polos, casquettes, sacs personnalisés', orderIndex: 2 },
  { name: 'Packaging',      slug: 'packaging',      description: 'Boîtes, sacs, étiquettes, packaging sur-mesure', orderIndex: 3 },
  { name: 'Goodies',        slug: 'goodies',        description: 'Stylos, mugs, porte-clés, objets publicitaires', orderIndex: 4 },
  { name: 'Signalétique',   slug: 'signaletique',   description: 'Enseignes, plaques, panneaux directionnels', orderIndex: 5 },
];

const SAMPLE_PRODUCTS = [
  {
    categorySlug: 'grand-format',
    name: 'Bâche publicitaire',
    slug: 'bache-publicitaire',
    description: 'Impression haute résolution sur bâche PVC 440g/m²',
    basePrice: 3500,
    unit: 'm²',
    minQuantity: 1,
    leadTimeDays: 3,
    formats: [
      { label: '1x2m', code: '1x2', priceModifier: 0 },
      { label: '2x3m', code: '2x3', priceModifier: 0 },
      { label: '3x4m', code: '3x4', priceModifier: 0 },
      { label: 'Sur mesure', code: 'custom', priceModifier: 500 },
    ],
    finishes: [
      { label: 'Ourlets + oeillets', code: 'ourlets', priceModifier: 0 },
      { label: 'Ourlets seuls', code: 'ourlets-only', priceModifier: -300 },
    ],
    isFeatured: true,
  },
  {
    categorySlug: 'carterie',
    name: 'Cartes de visite',
    slug: 'cartes-de-visite',
    description: 'Impression recto/verso sur papier couché mat ou brillant',
    basePrice: 15000,
    unit: 'lot 500',
    minQuantity: 1,
    leadTimeDays: 2,
    formats: [
      { label: '85x55mm (Standard)', code: 'standard', priceModifier: 0 },
      { label: '90x50mm', code: '90x50', priceModifier: 0 },
    ],
    materials: [
      { label: '350g Mat', code: '350g-mat', priceModifier: 0 },
      { label: '350g Brillant', code: '350g-brillant', priceModifier: 0 },
      { label: '400g Soft Touch', code: '400g-soft', priceModifier: 5000 },
    ],
    isFeatured: true,
  },
  {
    categorySlug: 'textile',
    name: 'T-shirt personnalisé',
    slug: 'tshirt-personnalise',
    description: 'Impression numérique ou sérigraphie sur t-shirt 100% coton',
    basePrice: 3500,
    unit: 'pièce',
    minQuantity: 10,
    leadTimeDays: 5,
    sizes: [
      { label: 'S', code: 's', priceModifier: 0 },
      { label: 'M', code: 'm', priceModifier: 0 },
      { label: 'L', code: 'l', priceModifier: 0 },
      { label: 'XL', code: 'xl', priceModifier: 0 },
      { label: 'XXL', code: 'xxl', priceModifier: 500 },
    ],
    materials: [
      { label: '150g Coton', code: '150g', priceModifier: 0 },
      { label: '180g Coton Premium', code: '180g', priceModifier: 1000 },
    ],
    isFeatured: true,
  },
];

// =============================================================
// SEED FUNCTION
// =============================================================
async function main() {
  console.log('🌱 Starting Touch+ database seed...\n');

  // 1. Seed Permissions
  console.log('📋 Creating permissions...');
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { module_action: { module: perm.module, action: perm.action } },
      update: { label: perm.label, description: perm.description },
      create: perm,
    });
  }
  const allPermissions = await prisma.permission.findMany();
  console.log(`  ✓ ${allPermissions.length} permissions created`);

  // 2. Seed Roles
  console.log('\n👥 Creating roles...');
  for (const roleDef of ROLES) {
    const { permissions: permKeys, ...roleData } = roleDef;

    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { label: roleData.label, description: roleData.description, color: roleData.color },
      create: roleData,
    });

    // Assign permissions
    let permsToAssign = [];
    if (permKeys === 'ALL') {
      permsToAssign = allPermissions;
    } else {
      permsToAssign = allPermissions.filter(p => permKeys.includes(`${p.module}:${p.action}`));
    }

    // Clear existing and re-assign
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    for (const perm of permsToAssign) {
      await prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: perm.id },
      });
    }
    console.log(`  ✓ Role "${roleData.name}" — ${permsToAssign.length} permissions`);
  }

  // 3. Ensure existing admin user has ADMIN role
  console.log('\n🔐 Syncing admin users...');
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const existingAdmins = await prisma.user.findMany({ where: { primaryRole: 'ADMIN' } });
  for (const admin of existingAdmins) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id },
    });
    console.log(`  ✓ Admin role assigned to: ${admin.email}`);
  }

  // Sync all other users with CLIENT role
  const clientRole = await prisma.role.findUnique({ where: { name: 'CLIENT' } });
  const clientUsers = await prisma.user.findMany({ where: { primaryRole: { not: 'ADMIN' } } });
  for (const user of clientUsers) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: clientRole.id } },
      update: {},
      create: { userId: user.id, roleId: clientRole.id },
    });
  }
  console.log(`  ✓ CLIENT role assigned to ${clientUsers.length} user(s)`);

  // 4. Seed Site Config
  console.log('\n⚙️  Seeding site configuration...');
  for (const config of SITE_CONFIG) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log(`  ✓ ${SITE_CONFIG.length} config entries created`);

  // 5. Seed Product Categories
  console.log('\n📦 Seeding product catalog...');
  for (const cat of PRODUCT_CATEGORIES) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`  ✓ ${PRODUCT_CATEGORIES.length} categories created`);

  for (const prod of SAMPLE_PRODUCTS) {
    const { categorySlug, ...productData } = prod;
    const category = await prisma.productCategory.findUnique({ where: { slug: categorySlug } });
    if (category) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: { name: productData.name, description: productData.description, isFeatured: productData.isFeatured },
        create: { ...productData, categoryId: category.id },
      });
    }
  }
  console.log(`  ✓ ${SAMPLE_PRODUCTS.length} sample products created`);

  console.log('\n✅ Seed completed successfully!');
  console.log('📌 You can now access the admin dashboard at /dashboard/admin\n');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
