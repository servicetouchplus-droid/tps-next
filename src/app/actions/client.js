'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/* =========================================================
   ADDRESSES
   ========================================================= */

export async function addAddressAction(formData) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  const label = formData.get('label');
  const address = formData.get('address');
  const city = formData.get('city') || 'Abidjan';
  const phone = formData.get('phone') || null;
  const isDefault = formData.get('isDefault') === 'true';

  if (!label || !address) return { error: 'Libellé et adresse requis.' };

  // If this is default, unset others
  if (isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  await prisma.userAddress.create({
    data: { userId: user.id, label, address, city, phone, isDefault },
  });

  revalidatePath('/dashboard/client/profile');
  return { success: true };
}

export async function deleteAddressAction(addressId) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  const addr = await prisma.userAddress.findUnique({ where: { id: addressId } });
  if (!addr || addr.userId !== user.id) return { error: 'Accès refusé.' };

  await prisma.userAddress.delete({ where: { id: addressId } });

  revalidatePath('/dashboard/client/profile');
  return { success: true };
}

export async function setDefaultAddressAction(addressId) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  // Unset all
  await prisma.userAddress.updateMany({
    where: { userId: user.id },
    data: { isDefault: false },
  });
  // Set this one
  await prisma.userAddress.update({
    where: { id: addressId },
    data: { isDefault: true },
  });

  revalidatePath('/dashboard/client/profile');
  return { success: true };
}

/* =========================================================
   REPRINT / CLONE ORDER
   ========================================================= */

export async function reprintOrderAction(sourceOrderId) {
  const user = await getAuthUser();
  if (!user) return { error: 'Non authentifié.' };

  const source = await prisma.order.findUnique({
    where: { id: sourceOrderId },
    include: { items: true, files: true },
  });

  if (!source || source.userId !== user.id) return { error: 'Accès refusé.' };

  // Generate new reference
  const count = await prisma.order.count({ where: { userId: user.id } });
  const newRef = `TPS-REPRINT-${String(count + 1).padStart(4, '0')}`;

  const newOrder = await prisma.order.create({
    data: {
      reference: newRef,
      userId: user.id,
      status: 'PENDING',
      priority: source.priority,
      subtotal: 0,
      total: 0,
      clientNotes: `Réimpression de ${source.reference || sourceOrderId.substring(0, 8).toUpperCase()}`,
      shippingAddress: source.shippingAddress,
      shippingCity: source.shippingCity,
      // Items cloned
      items: {
        create: source.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: 0, // Will be re-quoted
          total: 0,
          selectedFormat: item.selectedFormat,
          selectedFinish: item.selectedFinish,
          selectedMaterial: item.selectedMaterial,
          selectedSize: item.selectedSize,
          options: item.options,
          notes: item.notes,
          ...(item.productId ? { productId: item.productId } : {}),
        })),
      },
    },
  });

  revalidatePath('/dashboard/client/orders');
  redirect(`/dashboard/client/orders/${newOrder.id}`);
}
