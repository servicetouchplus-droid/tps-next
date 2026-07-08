'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Valide le Bon à Tirer (BAT) pour lancer la production
 */
export async function approveBAT(orderId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Non authentifié' };

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id) {
        return { error: 'Commande non trouvée ou non autorisée' };
    }

    if (order.status !== 'BAT') {
        return { error: 'Cette commande n\'est pas en attente de BAT' };
    }

    // Le client valide le BAT, on passe en PRODUCTION
    await prisma.order.update({
        where: { id: orderId },
        data: { 
            status: 'PRODUCTION',
            clientComments: 'BAT Validé' 
        }
    });

    revalidatePath('/dashboard/client');
    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Erreur BAT validation:', error);
    return { error: 'Erreur serveur' };
  }
}

/**
 * Rejette le BAT et demande des modifications
 */
export async function rejectBAT(orderId, comments) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) return { error: 'Non authentifié' };
  
    try {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.userId !== user.id) {
          return { error: 'Commande non trouvée ou non autorisée' };
      }
  
      if (order.status !== 'BAT') {
          return { error: 'Cette commande n\'est pas en attente de BAT' };
      }
  
      // Le client rejette le BAT, on repasse en MOCKUP (Maquette en création)
      await prisma.order.update({
          where: { id: orderId },
          data: { 
              status: 'MOCKUP',
              clientComments: `BAT Rejeté : ${comments}` 
          }
      });
  
      revalidatePath('/dashboard/client');
      revalidatePath('/dashboard/admin');
      return { success: true };
    } catch (error) {
      console.error('Erreur BAT rejet:', error);
      return { error: 'Erreur serveur' };
    }
  }
