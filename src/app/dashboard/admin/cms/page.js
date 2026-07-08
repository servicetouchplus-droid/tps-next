import { prisma } from '@/lib/prisma';
import CMSListClient from './CMSListClient';

export default async function AdminCMSPage() {
  let products = [];
  let services = [];
  let portfolioItems = [];
  let posts = [];
  let faqs = [];
  let partners = [];
  let teamMembers = [];
  let configs = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });

    services = await prisma.service.findMany({
      orderBy: { title: 'asc' }
    });

    portfolioItems = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });

    posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });

    faqs = await prisma.fAQ.findMany({
      orderBy: { question: 'asc' }
    });

    partners = await prisma.partner.findMany({
      orderBy: { name: 'asc' }
    });

    teamMembers = await prisma.teamMember.findMany({
      orderBy: { name: 'asc' }
    });

    configs = await prisma.siteConfig.findMany({
      where: {
        key: { in: ['cgv', 'about'] }
      }
    });
  } catch (error) {
    console.error("Prisma error in admin CMS page:", error);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Gestion du Contenu (CMS)</h1>
        <p className="text-slate-500 dark:text-slate-400">Gérez l'ensemble des contenus visibles par vos clients : catalogue de produits, services, portfolio, blog, FAQ, partenaires et trombinoscope d'équipe.</p>
      </div>

      <CMSListClient 
        products={products} 
        services={services}
        portfolioItems={portfolioItems} 
        posts={posts}
        faqs={faqs}
        partners={partners}
        teamMembers={teamMembers}
        configs={configs} 
      />
    </div>
  );
}
