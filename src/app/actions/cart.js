'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Récupère le panier de l'utilisateur connecté
 */
export async function getCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Utilisateur non authentifié', items: [] };
  }

  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    return { items };
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return { error: 'Erreur serveur', items: [] };
  }
}

/**
 * Ajoute un produit au panier
 */
export async function addToCart(product, quantity = 1, options = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Vous devez être connecté pour ajouter au panier' };
  }

  try {
    // Vérifier si le produit avec les mêmes options existe déjà
    const existingItem = await prisma.cartItem.findFirst({
      where: { 
        userId: user.id,
        product: product,
        // On pourrait ajouter une vérification plus fine sur les options JSON
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          product,
          quantity,
          options
        }
      });
    }

    revalidatePath('/cart'); // Rafraîchit la route panier
    return { success: true };
  } catch (error) {
    console.error("Erreur ajout panier:", error);
    return { error: 'Impossible d\'ajouter au panier' };
  }
}

/**
 * Supprime un article du panier
 */
export async function removeFromCart(cartItemId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Non authentifié' };

  try {
    await prisma.cartItem.delete({
      where: { 
        id: cartItemId,
        userId: user.id // Sécurité: on vérifie que l'item appartient à l'utilisateur
      }
    });
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { error: 'Erreur lors de la suppression' };
  }
}

/**
 * Met à jour la quantité
 */
export async function updateCartQuantity(cartItemId, newQuantity) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Non authentifié' };
  
  if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
  }

  try {
    // Il faut s'assurer que l'utilisateur est propriétaire (un findFirst est plus sûr avant d'update)
    const item = await prisma.cartItem.findFirst({
        where: { id: cartItemId, userId: user.id }
    });
    
    if (!item) return { error: 'Article introuvable' };

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity }
    });
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { error: 'Erreur lors de la mise à jour' };
  }
}
