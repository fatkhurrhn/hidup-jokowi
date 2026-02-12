// src/Ketua.jsx
import React, { useState, useEffect } from 'react';

export default function Ketua() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const cloudName = 'dka0pnghx';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/images/Ketua');
        const data = await res.json();

        if (!res.ok) throw new Error('Gagal konek ke server');
        if (!data.success) throw new Error(data.error);

        const items = data.resources.map(item => {
          // KALAU VIDEO: thumbnail dari frame pertama (so_0)
          if (item.resource_type === 'video') {
            return {
              ...item,
              thumbnail: `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_300,c_fill/${item.public_id}.jpg`
            };
          }

          // KALAU FOTO: thumbnail biasa
          return {
            ...item,
            thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_300,c_fill/${item.public_id}`
          };
        });

        setMedia(items);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Load</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // EMPTY
  if (media.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Folder Kosong</h2>
          <p className="text-gray-600">Belum ada foto/video di folder "Ketua"</p>
        </div>
      </div>
    );
  }

  // GALLERY
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📸</span> Galeri Ketua
          </h1>
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            {media.length} Item
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <div
            key={item.public_id}
            onClick={() => setSelectedMedia(item)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          >
            {/* Thumbnail - VIDEO pake frame, FOTO pake gambar */}
            <div className="aspect-square bg-gray-200">
              <img
                src={item.thumbnail}
                alt={item.public_id}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Badge video */}
              {item.resource_type === 'video' && (
                <div className="relative -mt-8 mr-2 flex justify-end">
                  <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span>🎬</span> Video
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview (sama seperti sebelumnya) */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="max-w-5xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2 bg-gray-100">
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="bg-black flex items-center justify-center p-2">
              {selectedMedia.resource_type === 'video' ? (
                <video
                  src={selectedMedia.secure_url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full"
                />
              ) : (
                <img
                  src={selectedMedia.secure_url}
                  alt={selectedMedia.public_id}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}