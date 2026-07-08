'use client';
import { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setProgress(0);
      setErrorMsg('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    
    // Étape 1 : Analyse Prépresse rapide (Optionnel)
    // On pourrait faire un appel fetch('/api/prepress/analyze') ici pour valider avant upload
    
    // Étape 2 : Upload
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('success');
        const response = JSON.parse(xhr.responseText);
        if (onUploadSuccess) onUploadSuccess(response);
      } else {
        setStatus('error');
        try {
          const res = JSON.parse(xhr.responseText);
          setErrorMsg(res.error || 'Erreur lors de l\'upload');
        } catch {
          setErrorMsg('Erreur inattendue');
        }
      }
    });

    xhr.addEventListener('error', () => {
      setStatus('error');
      setErrorMsg('Erreur de connexion lors de l\'upload');
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          Fichier pour impression (PDF, JPG, PNG)
        </label>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.tiff"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-600
            hover:file:bg-orange-100
            dark:file:bg-gray-700 dark:file:text-gray-200"
        />
      </div>

      {file && status === 'idle' && (
        <button 
          onClick={handleUpload}
          className="btn-primary w-full py-2 px-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all"
        >
          Envoyer le fichier
        </button>
      )}

      {status === 'uploading' && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Téléversement en cours...</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-orange-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium">
          ✅ Fichier envoyé et sécurisé avec succès.
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
          ❌ {errorMsg}
        </div>
      )}
    </div>
  );
}
