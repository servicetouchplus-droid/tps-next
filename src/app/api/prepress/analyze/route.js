import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Analyse avec Sharp
    const metadata = await sharp(buffer).metadata();

    const analysisResult = {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      space: metadata.space, // ex: 'srgb', 'cmyk'
      density: metadata.density || 72, // DPI (72 par défaut si non spécifié)
      hasAlpha: metadata.hasAlpha,
      isOpaque: metadata.isOpaque,
      validForPrint: true,
      warnings: [],
      errors: []
    };

    // Logique de validation Prépresse (critères basiques)
    if (analysisResult.density < 150) {
      analysisResult.errors.push('La résolution est trop faible (minimum 150 DPI, 300 DPI recommandé). L\'impression sera pixellisée.');
      analysisResult.validForPrint = false;
    } else if (analysisResult.density < 300) {
      analysisResult.warnings.push('La résolution est bonne (150-300 DPI), mais 300 DPI est idéal pour une netteté maximale.');
    }

    if (analysisResult.space === 'srgb' || analysisResult.space === 'rgb') {
      analysisResult.warnings.push('Fichier en RVB. Les couleurs à l\'impression (CMJN) peuvent être légèrement différentes de l\'écran.');
    }

    // Calcul des dimensions approximatives en mm (DPI = Dots Per Inch, 1 inch = 25.4 mm)
    if (metadata.width && metadata.height && analysisResult.density) {
        const widthMm = Math.round((metadata.width / analysisResult.density) * 25.4);
        const heightMm = Math.round((metadata.height / analysisResult.density) * 25.4);
        analysisResult.physicalDimensions = `${widthMm} x ${heightMm} mm`;
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Erreur prépresse:', error);
    return NextResponse.json({ error: 'Le fichier n\'a pas pu être analysé (format non supporté ou fichier corrompu).' }, { status: 500 });
  }
}
