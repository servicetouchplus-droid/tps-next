'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClientChatThreadsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  try {
    // Load client's orders
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Load existing threads
    const threads = await prisma.thread.findMany({
      where: { clientId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    return { success: true, orders, threads };
  } catch (error) {
    console.error("Failed to load chat threads:", error);
    return { error: "Impossible de récupérer les discussions." };
  }
}

export async function sendChatMessageAction(threadId, orderId, content) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };
  if (!content || !content.trim()) return { error: "Le message ne peut pas être vide." };

  try {
    let targetThreadId = threadId;

    // Create thread if it doesn't exist
    if (!targetThreadId) {
      // Check if thread already exists for this order
      const existing = await prisma.thread.findFirst({
        where: { clientId: user.id, orderId: orderId }
      });

      if (existing) {
        targetThreadId = existing.id;
      } else {
        const newThread = await prisma.thread.create({
          data: {
            clientId: user.id,
            orderId: orderId || null,
            lastMessageAt: new Date()
          }
        });
        targetThreadId = newThread.id;
      }
    }

    // Create message
    const msg = await prisma.message.create({
      data: {
        threadId: targetThreadId,
        senderId: user.id,
        content: content.trim(),
        isRead: false
      }
    });

    // Update lastMessageAt
    await prisma.thread.update({
      where: { id: targetThreadId },
      data: { lastMessageAt: new Date() }
    });

    revalidatePath('/dashboard/client/messages');
    revalidatePath('/dashboard/admin/messages');

    return { success: true, message: msg, threadId: targetThreadId };
  } catch (error) {
    console.error("Failed to send chat message:", error);
    return { error: "Erreur d'envoi du message." };
  }
}
