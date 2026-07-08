import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Non authentifié', { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true }
    });

    if (!order) {
      return new NextResponse('Commande introuvable', { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    
    const isDatabaseOffline = !dbUser;
    const hasAdminRole = dbUser?.primaryRole === 'ADMIN' || (isDatabaseOffline && user.email?.includes('admin'));

    if (order.userId !== user.id && !hasAdminRole) {
      return new NextResponse('Non autorisé', { status: 403 });
    }

    // Build the PDF Document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // Standard A4 Size
    
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 1. Header & Branding
    page.drawRectangle({ x: 0, y: 770, width: 595, height: 72, color: rgb(0.06, 0.09, 0.16) }); // Slate 900
    page.drawText('TOUCH+ SERVICES', { x: 40, y: 795, size: 22, font: helveticaBold, color: rgb(1.0, 1.0, 1.0) });
    page.drawText('FACTURE COMMANDE', { x: 400, y: 795, size: 14, font: helveticaBold, color: rgb(0.97, 0.45, 0.09) }); // Orange 500

    // 2. Legal details and metadata
    page.drawText(`Reference: #${order.reference || order.id.substring(0,8).toUpperCase()}`, { x: 40, y: 720, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, { x: 40, y: 705, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(`Statut: ${order.paymentStatus === 'PAID' ? 'PAYE' : 'EN ATTENTE'}`, { x: 40, y: 690, size: 10, font: helveticaBold, color: order.paymentStatus === 'PAID' ? rgb(0.1, 0.6, 0.1) : rgb(0.8, 0.4, 0.1) });

    // Customer info box
    page.drawRectangle({ x: 300, y: 660, width: 255, height: 85, color: rgb(0.97, 0.98, 0.99), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });
    page.drawText('FACTURE POUR :', { x: 315, y: 730, size: 8, font: helveticaBold, color: rgb(0.5, 0.5, 0.5) });
    page.drawText(order.user.name || 'Client B2B', { x: 315, y: 715, size: 11, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(order.user.email, { x: 315, y: 700, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
    if (order.user.phone) {
      page.drawText(`Tel: ${order.user.phone}`, { x: 315, y: 685, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
    }

    // 3. Table Header
    page.drawRectangle({ x: 40, y: 580, width: 515, height: 25, color: rgb(0.9, 0.92, 0.95) });
    page.drawText('DESCRIPTION PRODUIT', { x: 50, y: 588, size: 9, font: helveticaBold, color: rgb(0.2, 0.3, 0.4) });
    page.drawText('QTE', { x: 340, y: 588, size: 9, font: helveticaBold, color: rgb(0.2, 0.3, 0.4) });
    page.drawText('P.U. (XOF)', { x: 400, y: 588, size: 9, font: helveticaBold, color: rgb(0.2, 0.3, 0.4) });
    page.drawText('TOTAL (XOF)', { x: 480, y: 588, size: 9, font: helveticaBold, color: rgb(0.2, 0.3, 0.4) });

    // 4. Render items
    let yPos = 550;
    const subtotal = order.total || 0;
    const items = order.items && order.items.length > 0 ? order.items : [{ productName: order.product || "Impression personnalisée", quantity: order.quantity || 1, unitPrice: subtotal, total: subtotal }];
    
    items.forEach(item => {
      page.drawText(item.productName, { x: 50, y: yPos, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(String(item.quantity), { x: 340, y: yPos, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      page.drawText((item.unitPrice || 0).toLocaleString(), { x: 400, y: yPos, size: 10, font: helvetica, color: rgb(0.1, 0.1, 0.1) });
      page.drawText((item.total || 0).toLocaleString(), { x: 480, y: yPos, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      
      // Bottom divider line
      page.drawLine({ start: { x: 40, y: yPos - 10 }, end: { x: 555, y: yPos - 10 }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
      yPos -= 30;
    });

    // 5. Totals
    const tva = Math.round(subtotal * 0.18);
    const totalTtc = subtotal + tva;

    yPos -= 20;
    page.drawText('SOUS-TOTAL :', { x: 360, y: yPos, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(`${subtotal.toLocaleString()} FCFA`, { x: 460, y: yPos, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });

    yPos -= 20;
    page.drawText('TVA (18%) :', { x: 360, y: yPos, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(`${tva.toLocaleString()} FCFA`, { x: 460, y: yPos, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) });

    yPos -= 25;
    page.drawRectangle({ x: 350, y: yPos - 5, width: 205, height: 22, color: rgb(0.97, 0.92, 0.88) });
    page.drawText('TOTAL TTC :', { x: 360, y: yPos, size: 10, font: helveticaBold, color: rgb(0.8, 0.3, 0.0) });
    page.drawText(`${totalTtc.toLocaleString()} FCFA`, { x: 460, y: yPos, size: 10, font: helveticaBold, color: rgb(0.8, 0.3, 0.0) });

    // Footer info
    page.drawText('Merci pour votre confiance. Touch+ Services, Abidjan, Côte d\'Ivoire.', { x: 140, y: 50, size: 8, font: helvetica, color: rgb(0.6, 0.6, 0.6) });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Facture_TouchPlus_${order.reference || orderId.split('-')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return new NextResponse('Erreur serveur lors de la génération de la facture', { status: 500 });
  }
}
