'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPostPage() {
  return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4">Article de Blog</h1>
              <p className="text-gray-600">Contenu de l'article en construction...</p>
          </div>
      </div>
      <Footer />
    </>
  );
}
