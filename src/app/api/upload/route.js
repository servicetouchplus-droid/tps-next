import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier uploadé' }, { status: 400 });
    }

    // Validation du type MIME (Sécurisation)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Type de fichier non autorisé. Seuls les PDF, JPG, PNG et TIFF sont acceptés pour l\'impression.' 
      }, { status: 415 }); // 415 Unsupported Media Type
    }

    // Validation de la taille (ex: max 50 MB)
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
       return NextResponse.json({ error: `Le fichier dépasse la taille maximale autorisée de ${MAX_SIZE_MB}MB.` }, { status: 413 });
    }

    // L'idéal ici serait d'appeler un service Antivirus (ClamAV) ou l'API d'analyse prépresse.
    // Générer un nom de fichier unique sécurisé
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `${user.id}/${safeFileName}`;

    // Upload vers Supabase Storage (le bucket doit s'appeler 'uploads')
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur Supabase Storage:', error);
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde du fichier.' }, { status: 500 });
    }

    // Récupérer l'URL publique ou signée
    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filePath);

    return NextResponse.json({ 
        success: true, 
        path: filePath,
        url: publicUrlData.publicUrl 
    });

  } catch (error) {
    console.error('Erreur d\'upload:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de l\'upload' }, { status: 500 });
  }
}
