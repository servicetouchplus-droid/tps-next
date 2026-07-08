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

export async function updateEmailTemplateAction(trigger, subject, body, isActive) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { error: "Accès refusé." };

  try {
    await prisma.emailTemplate.upsert({
      where: { trigger },
      update: {
        subject,
        body,
        isActive: isActive === true
      },
      create: {
        trigger,
        subject,
        body,
        isActive: isActive === true
      }
    });

    revalidatePath('/dashboard/admin/emails');
    return { success: true };
  } catch (error) {
    console.error("Erreur sauvegarde template email:", error);
    return { error: "Impossible de sauvegarder le modèle d'email." };
  }
}

export async function simulateSendEmailAction(trigger, recipientEmail, placeholders) {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { trigger }
    });

    if (!template || !template.isActive) {
      console.log(`[EMAIL SIMULATOR] Trigger ${trigger} triggered but template is inactive or missing.`);
      return { success: false, error: "Template inactif ou inexistant." };
    }

    let subject = template.subject;
    let body = template.body;

    // Substitute placeholders
    for (const [key, val] of Object.entries(placeholders)) {
      const regex = new RegExp(`{${key}}`, 'g');
      subject = subject.replace(regex, val);
      body = body.replace(regex, val);
    }

    console.log(`========================================`);
    console.log(`[EMAIL SEND SIMULATION]`);
    console.log(`TO: ${recipientEmail}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:`);
    console.log(body);
    console.log(`========================================`);

    // Create an audit log trace for this email trigger!
    await prisma.auditLog.create({
      data: {
        module: 'settings',
        action: 'update', // generic action matching schema index
        entityType: 'User',
        label: `Email automatique envoyé à ${recipientEmail} (Trigger: ${trigger})`,
        newValue: { subject, recipient: recipientEmail }
      }
    });

    return { success: true, subject, body };
  } catch (error) {
    console.error("Erreur simulation email:", error);
    return { error: "Impossible d'envoyer la relance." };
  }
}
