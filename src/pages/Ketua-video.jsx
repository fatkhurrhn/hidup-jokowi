// src/FolderVideosPage.jsx
import React, { useState, useEffect } from 'react';

// 🔥 TERIMA PROPS, hapus useParams()
export default function FolderVideosPage({ folderName = "Ketua" }) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const cloudName = 'dka0pnghx';

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                console.log(`🎬 Fetching videos from folder: ${folderName}`);

                const res = await fetch(`/api/images/${folderName}/videos`);
                const data = await res.json();

                if (!res.ok) throw new Error('Gagal konek ke server');
                if (!data.success) throw new Error(data.error);

                const items = data.resources.map(item => {
                    // 🔥 🔥 🔥 INI YANG BENER UNTUK THUMBNAIL VIDEO!
                    const videoPublicId = item.public_id;

                    // FORMAT 1: Pake so_0 (frame pertama) - REKOMENDASI!
                    const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_300,c_fill/${videoPublicId}.jpg`;

                    // FORMAT 2: Kalo format 1 error, coba pake f_auto
                    // const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/f_auto:video,w_300,h_300,c_fill/${videoPublicId}`;

                    return {
                        ...item,
                        thumbnail: thumbnailUrl,
                        // Tambah fallback thumbnail
                        thumbnailFallback: `https://res.cloudinary.com/${cloudName}/video/upload/f_auto:video,w_300,h_300,c_fill/${videoPublicId}`
                    };
                });

                // makanan m dwded c 
                // nhdsjdns  diw 

                setMedia(items);
                setError(null);
            } catch (err) {
                console.error('❌ Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [folderName]);

    // Handler untuk image error - ganti dengan fallback
    const handleImageError = (e, item) => {
        e.target.src = item.thumbnailFallback;
        // Kalo masih error, ganti dengan placeholder
        e.target.onerror = () => {
            e.target.src = 'https://via.placeholder.com/300x300?text=🎬+Video';
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-700">Memuat video dari folder {folderName}...</p>
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🎬</span>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Video Folder: {folderName}
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Total {media.length} video ditemukan
                    </p>
                </div>
            </div>

            {/* Grid Video */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {media.map((item) => (
                    <div
                        key={item.public_id}
                        onClick={() => setSelectedMedia(item)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    >
                        <div className="aspect-square bg-gray-200 relative">
                            {/* 🔥 PAKE IMG UNTUK THUMBNAIL, BUKAN VIDEO */}
                            <img
                                src={item.thumbnail}
                                alt={item.public_id}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => handleImageError(e, item)}
                            />
                            {/* Overlay play icon */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all">
                                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">▶️</span>
                                </div>
                            </div>
                            {/* Badge Video */}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <span>🎬</span> Video
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm text-gray-800 truncate">
                                {item.public_id.split('/').pop()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Preview - SAMA SEPERTI SEBELUMNYA */}
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
                            <video
                                src={selectedMedia.secure_url}
                                controls
                                autoPlay
                                className="max-h-[70vh] max-w-full"
                            />
                        </div>
                        <div className="p-4 bg-white">
                            <p className="font-medium text-gray-800">
                                {selectedMedia.public_id.split('/').pop()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(selectedMedia.created_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}