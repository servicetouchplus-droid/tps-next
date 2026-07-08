'use client';
import { useState } from 'react';
import { approveBAT, rejectBAT } from '@/app/actions/bat';

export default function BATAction({ orderId, mockupUrl }) {
  const [loading, setLoading] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    const res = await approveBAT(orderId);
    if (res.error) setError(res.error);
    setLoading(false);
  };

  const handleReject = async () => {
    if (!comments.trim()) {
        setError('Veuillez indiquer les modifications souhaitées.');
        return;
    }
    setLoading(true);
    setError('');
    const res = await rejectBAT(orderId, comments);
    if (res.error) setError(res.error);
    setLoading(false);
  };

  return (
    <div className="mt-4 p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
      <h4 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">Action Requise : Bon à Tirer (BAT)</h4>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Votre maquette est prête. Veuillez la vérifier et valider pour lancer l'impression.
      </p>

      {mockupUrl && (
          <div className="mb-4">
              <img src={mockupUrl} alt="Maquette BAT" className="max-w-full h-auto rounded shadow-sm border border-gray-200" />
          </div>
      )}

      {error && <p className="text-red-500 text-sm font-bold mb-3">{error}</p>}

      {!showRejectBox ? (
        <div className="flex space-x-3">
            <button 
                onClick={handleApprove} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
            >
                {loading ? 'Validation...' : 'Valider pour Impression'}
            </button>
            <button 
                onClick={() => setShowRejectBox(true)} 
                disabled={loading}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded font-medium disabled:opacity-50"
            >
                Demander une modification
            </button>
        </div>
      ) : (
          <div className="mt-2 space-y-3">
              <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Décrivez les modifications à apporter à la maquette..."
                  className="w-full p-3 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600"
                  rows="3"
              ></textarea>
              <div className="flex space-x-3">
                  <button 
                      onClick={handleReject} 
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                  >
                      {loading ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                  <button 
                      onClick={() => setShowRejectBox(false)} 
                      disabled={loading}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium disabled:opacity-50"
                  >
                      Annuler
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
