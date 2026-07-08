import './globals.css';
import './style.css';
import Script from 'next/script';

export const metadata = {
  title: "Touch+ Services – Impression & Communication Visuelle Abidjan",
  description: "Votre partenaire de confiance pour la communication visuelle, l'impression, le textile et le packaging à Abidjan. Commandez et suivez en ligne.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
