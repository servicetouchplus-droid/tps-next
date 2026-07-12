'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createQuoteAction(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const product = formData.get('product');
  const quantity = parseInt(formData.get('quantity')) || 1;
  const notes = formData.get('notes');
  const fileUrl = formData.get('fileUrl');
  const filePassword = formData.get('filePassword');
  const linkDuration = formData.get('linkDuration');

  if (!product) {
    return { error: "Veuillez sélectionner un produit." };
  }

  let expiresAt = null;
  if (linkDuration) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(linkDuration, 10));
  }

  try {
    const count = await prisma.quote.count({ where: { userId: user.id } });
    const reference = `DEVIS-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(3, '0')}`;

    await prisma.quote.create({
      data: {
        userId: user.id,
        reference,
        status: 'SENT',
        notes: notes,
        total: 0,
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
          create: fileUrl ? [{
            name: 'Lien initial client',
            url: fileUrl,
            password: filePassword || null,
            status: 'ACTIVE',
            expiresAt
          }] : []
        }
      }
    });
  } catch (error) {
    console.error("Erreur création devis:", error);
    return { error: "Impossible de créer votre demande de devis." };
  }

  revalidatePath('/dashboard/client/quotes');
  redirect('/dashboard/client/quotes');
}

export async function convertQuoteToOrderAction(quoteId, finalPrice, machineName, projectManagerId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  // Check if admin
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.primaryRole !== 'ADMIN') return { error: "Accès refusé." };

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true, files: true }
    });

    if (!quote) return { error: "Devis introuvable." };
    if (quote.status === 'CONVERTED') return { error: "Ce devis a déjà été converti." };

    const count = await prisma.order.count({ where: { userId: quote.userId } });
    const orderRef = `TPS-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(3, '0')}`;

    const subtotal = parseFloat(finalPrice) || 0;
    const total = subtotal;

    // Create Order
    await prisma.order.create({
      data: {
        reference: orderRef,
        userId: quote.userId,
        quoteId: quote.id,
        status: 'PAID', // Start as Paid once validated/converted or PENDING
        paymentStatus: 'PAID',
        subtotal,
        total,
        machine: machineName || null,
        assignedToId: projectManagerId || null,
        clientNotes: quote.notes,
        items: {
          create: quote.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: subtotal / (item.quantity || 1),
            total: subtotal,
            selectedFormat: item.selectedFormat,
            selectedFinish: item.selectedFinish,
            selectedMaterial: item.selectedMaterial,
            selectedSize: item.selectedSize,
            options: item.options,
            notes: item.notes
          }))
        },
        files: {
          create: quote.files.map(file => ({
            name: file.name,
            url: file.url,
            password: file.password,
            type: 'SOURCE',
            status: 'APPROVED',
            expiresAt: file.expiresAt
          }))
        }
      }
    });

    // Update Quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED', total }
    });

    revalidatePath('/dashboard/admin/quotes');
    revalidatePath('/dashboard/admin/orders');
    revalidatePath('/dashboard/client/orders');
    return { success: true };
  } catch (error) {
    console.error("Erreur de conversion devis -> commande:", error);
    return { error: "Une erreur est survenue lors de la conversion." };
  }
}

export async function clientAcceptQuoteAction(quoteId) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  try {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, userId: user.id },
      include: { items: true, files: true }
    });

    if (!quote) return { error: "Devis introuvable." };
    if (quote.status === 'CONVERTED') return { error: "Ce devis a déjà été converti." };
    if (quote.total <= 0) return { error: "Ce devis n'a pas encore été chiffré par l'administrateur." };

    const count = await prisma.order.count({ where: { userId: user.id } });
    const orderRef = `TPS-${Date.now().toString().slice(-6)}-${String(count + 1).padStart(3, '0')}`;

    const total = quote.total;

    // Create Order in PENDING status so the client can pay/validate it
    await prisma.order.create({
      data: {
        reference: orderRef,
        userId: user.id,
        quoteId: quote.id,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        subtotal: total,
        total: total,
        clientNotes: quote.notes,
        items: {
          create: quote.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: total / (item.quantity || 1),
            total: total,
            selectedFormat: item.selectedFormat,
            selectedFinish: item.selectedFinish,
            selectedMaterial: item.selectedMaterial,
            selectedSize: item.selectedSize,
            options: item.options,
            notes: item.notes
          }))
        },
        files: {
          create: quote.files.map(file => ({
            name: file.name,
            url: file.url,
            password: file.password,
            type: 'SOURCE',
            status: 'APPROVED',
            expiresAt: file.expiresAt
          }))
        }
      }
    });

    // Update Quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED' }
    });

    revalidatePath('/dashboard/client/quotes');
    revalidatePath('/dashboard/client/orders');
    revalidatePath('/dashboard/admin/quotes');
    revalidatePath('/dashboard/admin/orders');

    return { success: true };
  } catch (error) {
    console.error("Erreur d'acceptation client devis:", error);
    return { error: "Impossible de valider le devis." };
  }
}

export async function proposeQuotePriceAction(quoteId, price) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.primaryRole !== 'ADMIN') return { error: "Accès refusé." };

  try {
    const total = parseFloat(price) || 0;
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        total
      }
    });

    revalidatePath('/dashboard/admin/quotes');
    revalidatePath('/dashboard/client/quotes');
    return { success: true };
  } catch (error) {
    console.error("Erreur de proposition tarifaire devis:", error);
    return { error: "Une erreur est survenue lors de la soumission de la proposition." };
  }
}

