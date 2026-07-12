'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const MOCK_BEST_SELLERS = [
  {
    id: 'mock-1',
    category: 'Textile',
    name: 'T-shirts Personnalisés',
    priceText: 'dès 2 500 F',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    badge: '🔥 Best seller',
    badgeColor: 'purple',
    targetUrl: '/dashboard/client/new',
    orderIndex: 1
  },
  {
    id: 'mock-2',
    category: 'Carterie',
    name: 'Flyers & Dépliants',
    priceText: 'dès 150 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&h=300&fit=crop',
    badge: '−30%',
    badgeColor: 'red',
    targetUrl: '/dashboard/client/new',
    orderIndex: 2
  },
  {
    id: 'mock-3',
    category: 'Carterie',
    name: 'Cartes de Visite',
    priceText: 'dès 200 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1612838320302-4b3b3996e666?w=400&h=300&fit=crop',
    badge: '⭐ Top',
    badgeColor: 'purple',
    targetUrl: '/dashboard/client/new',
    orderIndex: 3
  },
  {
    id: 'mock-4',
    category: 'Grand Format',
    name: 'Kakémonos / Roll-up',
    priceText: 'dès 25 000 F',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
    badge: null,
    badgeColor: null,
    targetUrl: '/dashboard/client/new',
    orderIndex: 4
  },
  {
    id: 'mock-5',
    category: 'Textile',
    name: 'Casquettes Brodées',
    priceText: 'dès 2 000 F',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop',
    badge: null,
    badgeColor: null,
    targetUrl: '/dashboard/client/new',
    orderIndex: 5
  },
  {
    id: 'mock-6',
    category: 'Packaging',
    name: 'Packaging Carton',
    priceText: 'dès 800 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
    badge: '✦ Sur mesure',
    badgeColor: 'orange',
    targetUrl: '/dashboard/client/new',
    orderIndex: 6
  },
  {
    id: 'mock-7',
    category: 'Goodies',
    name: 'Mugs Personnalisés',
    priceText: 'dès 2 500 F',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop',
    badge: '🔥 Populaire',
    badgeColor: 'purple',
    targetUrl: '/dashboard/client/new',
    orderIndex: 7
  },
  {
    id: 'mock-8',
    category: 'Grand Format',
    name: 'Bâches & Banderoles',
    priceText: 'dès 15 000 F',
    imageUrl: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?w=400&h=300&fit=crop',
    badge: '✦ Bâche',
    badgeColor: 'orange',
    targetUrl: '/dashboard/client/new',
    orderIndex: 8
  },
  {
    id: 'mock-9',
    category: 'Goodies',
    name: 'Stylos Publicitaires',
    priceText: 'dès 150 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1585336139057-3c50f31be15d?w=400&h=300&fit=crop',
    badge: null,
    badgeColor: null,
    targetUrl: '/dashboard/client/new',
    orderIndex: 9
  },
  {
    id: 'mock-10',
    category: 'Textile',
    name: 'Polos d\'Entreprise',
    priceText: 'dès 5 500 F',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=300&fit=crop',
    badge: null,
    badgeColor: null,
    targetUrl: '/dashboard/client/new',
    orderIndex: 10
  },
  {
    id: 'mock-11',
    category: 'Carterie',
    name: 'Autocollants Découpés',
    priceText: 'dès 50 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1572375995301-4018d3eed5aa?w=400&h=300&fit=crop',
    badge: null,
    badgeColor: null,
    targetUrl: '/dashboard/client/new',
    orderIndex: 11
  },
  {
    id: 'mock-12',
    category: 'Carterie',
    name: 'Calendriers de Bureau',
    priceText: 'dès 2 500 F/u',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
    badge: 'Nouveau',
    badgeColor: 'red',
    targetUrl: '/dashboard/client/new',
    orderIndex: 12
  }
];

export async function getBestSellers() {
  try {
    const items = await prisma.bestSeller.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });
    return items.length > 0 ? items : MOCK_BEST_SELLERS;
  } catch (error) {
    console.warn('Prisma error in getBestSellers:', error.message);
    return MOCK_BEST_SELLERS;
  }
}

export async function getAllBestSellers() {
  try {
    const items = await prisma.bestSeller.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return items;
  } catch (error) {
    console.warn('Prisma error in getAllBestSellers:', error.message);
    return [];
  }
}

export async function createBestSeller(data) {
  try {
    const item = await prisma.bestSeller.create({ data });
    revalidatePath('/');
    revalidatePath('/dashboard/admin/cms/bestsellers');
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateBestSeller(id, data) {
  try {
    const item = await prisma.bestSeller.update({
      where: { id },
      data
    });
    revalidatePath('/');
    revalidatePath('/dashboard/admin/cms/bestsellers');
    return { success: true, item };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteBestSeller(id) {
  try {
    await prisma.bestSeller.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/dashboard/admin/cms/bestsellers');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
