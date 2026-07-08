'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Non authentifié.' };

  const name = formData.get('name');
  const phone = formData.get('phone');
  const company = formData.get('company');
  const companyType = formData.get('companyType');
  const taxId = formData.get('taxId');
  const address = formData.get('address');
  const city = formData.get('city');
  const country = formData.get('country');

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        name, 
        phone,
        company: company || null,
        companyType: companyType || null,
        taxId: taxId || null,
        address: address || null,
        city: city || null,
        country: country || 'CI'
      }
    });
    revalidatePath('/dashboard/client');
    revalidatePath('/dashboard/client/profile');
    return { success: 'Profil professionnel mis à jour avec succès !' };
  } catch (e) {
    console.error("Profile update error:", e);
    return { error: 'Erreur lors de la mise à jour du profil.' };
  }
}
