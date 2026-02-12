// src/AllPage.jsx
import React, { useState, useEffect } from 'react';

export default function AllPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const cloudName = 'dka0pnghx';

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/all');
                const data = await res.json();

                if (!res.ok) throw new Error('Gagal konek ke server');
                if (!data.success) throw new Error(data.error);

                const items = data.resources.map(item => {
                    // Video: pake thumbnail dari frame 0
                    if (item.resource_type === 'video') {
                        return {
                            ...item,
                            thumbnail: `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_300,c_fill/${item.public_id}.jpg`,
                            folder: item.public_id.split('/')[0] // Ambil nama folder
                        };
                    }
                    // Foto: thumbnail biasa
                    return {
                        ...item,
                        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_300,c_fill/${item.public_id}`,
                        folder: item.public_id.split('/')[0] // Ambil nama folder
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

        fetchAll();
    }, []);

    // Group by folder
    const groupedMedia = media.reduce((acc, item) => {
        const folder = item.folder || 'Uncategorized';
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-700">Memuat semua media...</p>
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
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                        <span>📚</span> Semua Media
                    </h1>
                    <p className="text-gray-600">
                        Total {media.length} item dari {Object.keys(groupedMedia).length} folder
                    </p>
                </div>
            </div>

            {/* Folder Stats */}
            <div className="max-w-7xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(groupedMedia).map(([folder, items]) => (
                    <div key={folder} className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-3xl mb-2">📁</div>
                        <div className="font-medium text-gray-800 truncate">{folder}</div>
                        <div className="text-sm text-gray-500">{items.length} item</div>
                    </div>
                ))}
            </div>

            {/* Grid per Folder */}
            {Object.entries(groupedMedia).map(([folder, items]) => (
                <div key={folder} className="max-w-7xl mx-auto mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">{folder}</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                            {items.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.public_id}
                                onClick={() => setSelectedMedia(item)}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            >
                                <div className="aspect-square bg-gray-200 relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.public_id}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {item.resource_type === 'video' && (
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <span>🎬</span> Video
                                        </div>
                                    )}
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
                </div>
            ))}

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
                        <div className="p-4 bg-white">
                            <p className="font-medium text-gray-800">
                                {selectedMedia.public_id.split('/').pop()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Folder: {selectedMedia.folder} • {new Date(selectedMedia.created_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}