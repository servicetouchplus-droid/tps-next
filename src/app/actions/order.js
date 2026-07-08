'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createOrderAction(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const product = formData.get('product');
  const quantity = parseInt(formData.get('quantity')) || 1;
  const notes = formData.get('notes');
  const attachedFileUrl = formData.get('fileUrl'); // Le fameux lien WeTransfer/Drive

  if (!product) {
    return { error: "Veuillez sélectionner un produit." };
  }

  const count = await prisma.order.count({ where: { userId: user.id } });
  const reference = `TPS-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(3, '0')}`;

  try {
    await prisma.order.create({
      data: {
        userId: user.id,
        reference,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        clientNotes: notes,
        items: {
          create: [{
            productName: product,
            quantity,
            unitPrice: 0,
            total: 0,
            notes
          }]
        },
        files: {
          create: attachedFileUrl ? [{
            name: 'Fichier initial client',
            url: attachedFileUrl,
            type: 'SOURCE',
          }] : []
        }
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return { error: "Une erreur est survenue lors de la création de votre demande." };
  }

  redirect('/dashboard/client/orders');
}
