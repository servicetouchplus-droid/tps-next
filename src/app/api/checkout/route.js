import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le panier
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 });
    }

    // Créer la commande en BDD (statut PENDING)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        product: 'Multiple Items (Cart)', // En prod, il faudrait soit lier OrderItems, soit stocker le JSON
        quantity: cartItems.length,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        totalAmount: cartItems.reduce((acc, item) => acc + (5000 * item.quantity), 0), // Base prix 5000 pour la démo
        options: cartItems.map(item => ({ product: item.product, quantity: item.quantity }))
      }
    });

    // Formater les line_items pour Stripe
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'xof', // Franc CFA (ou 'eur'/'usd' selon le compte Stripe)
        product_data: {
          name: item.product,
          description: item.options ? JSON.stringify(item.options) : 'Impression personnalisée',
        },
        unit_amount: 5000 * 100, // Stripe attend le montant en centimes/plus petite unité
      },
      quantity: item.quantity,
    }));

    // Créer la session Checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/client?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart?canceled=true`,
      client_reference_id: order.id,
      customer_email: user.email,
    });

    // Vider le panier
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe Checkout:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
