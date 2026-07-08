'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  return dbUser?.primaryRole === 'ADMIN';
}

// ==========================================
// PRODUCTS CATALOG & SERVICES
// ==========================================

export async function updateProductBasePriceAction(productId, data) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        basePrice: parseFloat(data.basePrice) || 0,
        leadTimeDays: parseInt(data.leadTimeDays, 10) || 3,
        imageUrl: data.imageUrl || null,
        minQuantity: parseInt(data.minQuantity, 10) || 1,
        unit: data.unit || "unité",
        isFeatured: !!data.isFeatured,
        isActive: !!data.isActive
      }
    });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    return { error: "Impossible de modifier les détails du produit." };
  }
}

export async function saveServiceAction(id, title, description, iconSvg, colorHint) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (id) {
      await prisma.service.update({
        where: { id },
        data: { title, description, iconSvg, colorHint }
      });
    } else {
      await prisma.service.create({
        data: { title, slug, description, iconSvg, colorHint, isPremium: true }
      });
    }
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde service:", error);
    return { error: "Impossible d'enregistrer le service." };
  }
}

export async function deleteServiceAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression service:", error);
    return { error: "Impossible de supprimer le service." };
  }
}

// ==========================================
// PORTFOLIO / GALERIE
// ==========================================

export async function addPortfolioItemAction(formData) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  const title = formData.get('title');
  const clientName = formData.get('clientName');
  const description = formData.get('description');
  const imageUrl = formData.get('imageUrl');
  const category = formData.get('category') || 'impression';

  if (!title || !imageUrl) {
    return { error: "Le titre et le lien de l'image sont obligatoires." };
  }

  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.portfolio.create({
      data: {
        title,
        slug,
        clientName,
        description,
        imageUrl,
        category,
        isPublished: true
      }
    });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/realisations');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur ajout portfolio:", error);
    return { error: "Impossible d'ajouter la réalisation." };
  }
}

export async function deletePortfolioItemAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.portfolio.delete({
      where: { id }
    });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/realisations');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression portfolio:", error);
    return { error: "Impossible de supprimer la réalisation." };
  }
}

// ==========================================
// BLOG POSTS
// ==========================================

export async function saveBlogAction(id, title, summary, content, imageUrl, published) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (id) {
      await prisma.post.update({
        where: { id },
        data: { title, summary, content, imageUrl, published: published === true }
      });
    } else {
      await prisma.post.create({
        data: { title, slug, summary, content, imageUrl, published: published === true, category: 'Actualités' }
      });
    }
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde article de blog:", error);
    return { error: "Impossible d'enregistrer l'article de blog." };
  }
}

export async function deleteBlogAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression blog:", error);
    return { error: "Impossible de supprimer l'article de blog." };
  }
}

// ==========================================
// FAQ
// ==========================================

export async function saveFaqAction(id, question, answer, category) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    if (id) {
      await prisma.fAQ.update({
        where: { id },
        data: { question, answer, category }
      });
    } else {
      await prisma.fAQ.create({
        data: { question, answer, category: category || 'Général' }
      });
    }
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde FAQ:", error);
    return { error: "Impossible d'enregistrer la FAQ." };
  }
}

export async function deleteFaqAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression FAQ:", error);
    return { error: "Impossible de supprimer la FAQ." };
  }
}

// ==========================================
// PARTNERS
// ==========================================

export async function savePartnerAction(id, name, logoUrl, websiteUrl) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    if (id) {
      await prisma.partner.update({
        where: { id },
        data: { name, logoUrl, websiteUrl }
      });
    } else {
      await prisma.partner.create({
        data: { name, logoUrl, websiteUrl }
      });
    }
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde partenaire:", error);
    return { error: "Impossible d'enregistrer le partenaire." };
  }
}

export async function deletePartnerAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.partner.delete({ where: { id } });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression partenaire:", error);
    return { error: "Impossible de supprimer le partenaire." };
  }
}

// ==========================================
// TEAM MEMBERS
// ==========================================

export async function saveTeamMemberAction(id, name, role, imageUrl, bio) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    if (id) {
      await prisma.teamMember.update({
        where: { id },
        data: { name, role, imageUrl, bio }
      });
    } else {
      await prisma.teamMember.create({
        data: { name, role, imageUrl, bio }
      });
    }
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde membre équipe:", error);
    return { error: "Impossible d'enregistrer le membre de l'équipe." };
  }
}

export async function deleteTeamMemberAction(id) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression membre équipe:", error);
    return { error: "Impossible de supprimer le membre de l'équipe." };
  }
}

// ==========================================
// STATIC PAGES / CONFIG
// ==========================================

export async function updateStaticPageAction(key, value) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: 'richtext', group: 'general' }
    });
    revalidatePath('/dashboard/admin/cms');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour page statique:", error);
    return { error: "Impossible de modifier le contenu." };
  }
}
