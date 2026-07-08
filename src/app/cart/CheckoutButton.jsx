'use client';
import { useState } from 'react';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers le paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="btn-primary w-full flex justify-center items-center py-4 rounded-xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? 'Redirection...' : 'Passer à la caisse'}
    </button>
  );
}
