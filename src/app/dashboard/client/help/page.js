import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ClientHelpPage() {
  let faqs = [];
  try {
    faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' }
    });
  } catch (e) {
    console.error("Failed to load FAQs:", e);
  }

  const defaultFaqs = [
    {
      question: "Comment soumettre des fichiers de maquette de haute qualité ?",
      answer: "Pour garantir une impression optimale, veuillez envoyer vos fichiers au format PDF, Illustrator (.ai) ou Photoshop (.psd) avec une résolution minimale de 300 DPI, en mode colorimétrique CMJN (CMYK). Évitez les formats compressés à faible résolution."
    },
    {
      question: "Qu'est-ce que la validation de BAT (Bon À Tirer) ?",
      answer: "Le Bon À Tirer (BAT) est une simulation numérique finale de votre impression. Une fois le BAT envoyé par notre graphiste, vous devez l'examiner puis cliquer sur 'Valider le BAT' dans les détails de votre commande pour lancer la production. Aucun projet n'est imprimé sans votre feu vert."
    },
    {
      question: "Quels sont les délais standards de fabrication ?",
      answer: "Les délais standards varient de 3 à 5 jours ouvrés après validation finale du BAT, selon la complexité du projet (façonnage, vernis, pelliculage). Les livraisons en dehors d'Abidjan peuvent nécessiter 24h à 48h supplémentaires."
    },
    {
      question: "Comment demander un devis sur mesure ?",
      answer: "Cliquez sur 'Nouveau Devis' dans le menu latéral. Remplissez le formulaire avec la description de votre support (format, quantité, type de papier, finitions). Collez un lien OneDrive/WeTransfer si vous possédez déjà des visuels. Nous vous enverrons un chiffrage sous 24h."
    }
  ];

  const faqsToRender = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <span className="inline-block px-3 py-1 bg-orange-550/10 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
          Centre d'assistance
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Aide & Questions Fréquentes</h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm">
          Retrouvez les réponses à vos questions techniques et contactez notre équipe en cas de besoin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Accordions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">FAQ Technique & Impression</h2>
          <div className="space-y-3">
            {faqsToRender.map((faq, idx) => (
              <details 
                key={idx} 
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 group cursor-pointer [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex justify-between items-center outline-none list-none">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 pr-4">
                    {faq.question}
                  </h3>
                  <span className="text-xs transition-transform group-open:rotate-180 text-slate-400 font-bold">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-750 pt-3 font-semibold">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact info panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <h3 className="text-lg font-black mb-1 relative z-10">Une question urgente ?</h3>
            <p className="text-xs text-slate-400 font-medium mb-6 relative z-10">Notre équipe commerciale et technique est à votre écoute.</p>
            
            <div className="space-y-4 text-xs font-semibold relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Téléphone direct</p>
                  <p className="text-white font-black mt-0.5">+225 07 00 00 00 00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">E-mail support pro</p>
                  <p className="text-white font-black mt-0.5">contact@touchplus.ci</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Atelier de façonnage</p>
                  <p className="text-white font-black mt-0.5">Boulevard VGE, Zone 4, Abidjan</p>
                </div>
              </div>
            </div>

            <Link 
              href="/dashboard/client/messages" 
              className="block w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-2xl text-center shadow-lg shadow-orange-550/20 transition-all uppercase tracking-widest mt-8 relative z-10"
            >
              💬 Écrire un message
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
