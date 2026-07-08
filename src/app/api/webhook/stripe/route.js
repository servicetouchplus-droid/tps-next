import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Le webhook Stripe lit le text brut via req.text()

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Le client_reference_id contient l'ID de la commande
    const orderId = session.client_reference_id;

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            paymentStatus: 'PAID',
            paymentMethod: 'STRIPE',
          },
        });
        console.log(`Commande ${orderId} payée avec succès.`);
      } catch (error) {
        console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
