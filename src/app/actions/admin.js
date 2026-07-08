'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  } catch (e) {
    console.error("Prisma error in checkAdmin action:", e);
  }

  const isDatabaseOffline = !dbUser;
  const isAdmin = dbUser?.primaryRole === 'ADMIN' || (isDatabaseOffline && user.email?.includes('admin'));

  return isAdmin ? (dbUser || { id: user.id, email: user.email, primaryRole: 'ADMIN' }) : null;
}

export async function updateOrderStatusAction(orderId, newStatus) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });

  revalidatePath('/dashboard/admin/orders');
  revalidatePath('/dashboard/admin');
  revalidatePath('/dashboard/client/orders');
  revalidatePath('/dashboard/client');
  return { success: true };
}

export async function updateOrderMockupAction(orderId, mockupUrl) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  await prisma.order.update({
    where: { id: orderId },
    data: { mockupUrl, status: 'BAT' }
  });

  revalidatePath('/dashboard/admin/orders');
  revalidatePath(`/dashboard/admin/orders/${orderId}`);
  revalidatePath(`/dashboard/client/orders/${orderId}`);
  return { success: true };
}

export async function clientBatResponseAction(orderId, approved, comment) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (order?.userId !== user.id) return { error: "Accès refusé." };

  await prisma.order.update({
    where: { id: orderId },
    data: {
      clientComments: comment,
      status: approved ? 'PRODUCTION' : 'MOCKUP'
    }
  });

  revalidatePath(`/dashboard/client/orders/${orderId}`);
  revalidatePath('/dashboard/admin/orders');
  return { success: true };
}

export async function updateUserRoleAction(userId, newRole) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { primaryRole: newRole }
    });
  } catch (e) {
    console.error("Prisma error in updateUserRoleAction:", e);
    return { error: "Erreur lors de la mise à jour du rôle en base de données." };
  }

  revalidatePath('/dashboard/admin/clients');
  return { success: true };
}

export async function updateAdminOrderNotesAction(orderId, notes) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  // Use clientComments field for admin notes for now, or add a separate field
  await prisma.order.update({
    where: { id: orderId },
    data: { notes }
  });

  revalidatePath(`/dashboard/admin/orders/${orderId}`);
  return { success: true };
}

export async function assignProjectManagerAction(orderId, pmId) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { assignedToId: pmId || null }
    });
  } catch (e) {
    console.error("Prisma error in assignProjectManagerAction:", e);
    return { error: "Impossible d'assigner le chef de projet." };
  }

  revalidatePath(`/dashboard/admin/orders/${orderId}`);
  revalidatePath(`/dashboard/admin/orders`);
  return { success: true };
}

export async function updateProductionDetailsAction(orderId, machine, operatorId, operatorNotes) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        machine: machine || null,
        assignedToId: operatorId || null,
        internalNotes: operatorNotes || null
      }
    });
  } catch (e) {
    console.error("Prisma error in updateProductionDetailsAction:", e);
    return { error: "Impossible de mettre à jour l'atelier." };
  }

  revalidatePath(`/dashboard/admin/orders/${orderId}`);
  revalidatePath('/dashboard/admin/atelier');
  return { success: true };
}

export async function toggleUserActiveAction(userId, isActive) {
  const admin = await checkAdmin();
  if (!admin) return { error: "Accès refusé." };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: isActive === true }
    });
    revalidatePath('/dashboard/admin/team');
    return { success: true };
  } catch (e) {
    console.error("Prisma error in toggleUserActiveAction:", e);
    return { error: "Impossible de modifier le statut de l'utilisateur." };
  }
}
