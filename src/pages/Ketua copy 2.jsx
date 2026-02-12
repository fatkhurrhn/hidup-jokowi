// src/FolderAllWithTagsPage.jsx
import React, { useState, useEffect } from 'react';

export default function FolderAllWithTagsPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    // 🔥 HARDCODE TAGS
    const [selectedTag, setSelectedTag] = useState('all');
    const availableTags = [
        { id: 'all', label: 'Semua' },
        { id: 'felfest2', label: 'Felfest2' },
        { id: 'umum', label: 'Umum' },
        { id: 'ketua', label: 'Ketua' }
    ];

    const cloudName = 'dka0pnghx';

    // 🔥 FUNGSI UNTUK NGACAKIN FOTO
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // 🔥 FUNGSI UNTUK THUMBNAIL VIDEO
    const getVideoThumbnail = (publicId) => {
        return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_600,h_900,c_limit/${publicId}.jpg`;
    };

    useEffect(() => {
        const fetchAllMedia = async () => {
            try {
                setLoading(true);

                // 🔥 CEK URL YANG DIFETCH
                const url = `/api/images/ALL`;
                console.log('🔍 Fetching URL:', url);

                const res = await fetch(url);
                console.log('📡 Response status:', res.status);

                const data = await res.json();
                console.log('📦 Full API Response:', data);

                if (!res.ok) throw new Error('Gagal konek ke server');
                if (!data.success) throw new Error(data.error);

                console.log('🖼️ Total resources dari API:', data.resources.length);

                // 🔥 LIHAT DISTRIBUSI TAGS
                const tagCount = {};
                data.resources.forEach(item => {
                    if (item.tags) {
                        item.tags.forEach(tag => {
                            tagCount[tag] = (tagCount[tag] || 0) + 1;
                        });
                    }
                });
                console.log('🏷️ Tag distribution dari API:', tagCount);

                let items = data.resources.map(item => {
                    if (item.resource_type === 'video') {
                        return {
                            ...item,
                            thumbnail: `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_600,h_900,c_limit/${item.public_id}.jpg`,
                            tags: item.tags || []
                        };
                    }
                    return {
                        ...item,
                        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_600,h_900,c_limit/${item.public_id}`,
                        tags: item.tags || []
                    };
                });

                console.log('🎯 Selected tag:', selectedTag);

                // 🔥 FILTER HANYA JIKA BUKAN 'all'
                if (selectedTag !== 'all') {
                    console.log(`🔍 Filtering by tag: ${selectedTag}`);
                    items = items.filter(item =>
                        item.tags && item.tags.includes(selectedTag)
                    );
                    console.log(`📊 After filter: ${items.length} items`);
                } else {
                    console.log(`📊 No filter - showing all ${items.length} items`);
                }

                items = shuffleArray(items);
                setMedia(items);
                setError(null);

            } catch (err) {
                console.error('❌ Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMedia();
    }, [selectedTag]);

    // 🔥 FUNGSI DOWNLOAD
    const downloadFile = async (fileUrl, filename) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    // ============== LOADING STATE ==============
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat media...</p>
                </div>
            </div>
        );
    }

    // ============== ERROR STATE ==============
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Load</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    // ============== MAIN RENDER ==============
    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Galeri Semuanya
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {media.filter(m => m.resource_type === 'image').length} foto • {media.filter(m => m.resource_type === 'video').length} video
                            </p>
                        </div>
                        <span className="text-sm text-gray-500">
                            {media.length} item
                        </span>
                    </div>

                    {/* FILTER TAGS */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {availableTags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTag(tag.id)}
                                className={`
                                    px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                    ${selectedTag === tag.id
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔥 GRID MASONRY */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                {media.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="text-6xl mb-4">🖼️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Belum Ada Media
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {selectedTag === 'all'
                                ? 'Belum ada foto/video di folder ini'
                                : `Belum ada media dengan tag #${selectedTag}`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
                        {media.map((item) => (
                            <div
                                key={item.public_id}
                                onClick={() => setSelectedMedia(item)}
                                className="break-inside-avoid cursor-pointer group relative"
                            >
                                {/* THUMBNAIL */}
                                <div className="relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.public_id}
                                        className="w-full h-auto rounded-lg bg-gray-100"
                                        loading="lazy"
                                    />

                                    {/* 🔥 BADGE VIDEO */}
                                    {item.resource_type === 'video' && (
                                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                            <span>🎬</span>
                                            <span>Video</span>
                                        </div>
                                    )}
                                </div>

                                {/* OVERLAY HOVER */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300" />

                                {/* 🔥 TAGS DI KIRI BAWAH */}
                                {item.tags && item.tags.length > 0 && (
                                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {item.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[10px] px-2 py-1 rounded-full font-medium bg-black bg-opacity-70 text-white backdrop-blur-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 🔥 MODAL PREVIEW - FOTO & VIDEO */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black z-50 flex items-center justify-center"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-xl transition-all backdrop-blur-sm"
                        >
                            ✕
                        </button>

                        {/* 🔥 PREVIEW - VIDEO ATAU FOTO */}
                        {selectedMedia.resource_type === 'video' ? (
                            <video
                                src={selectedMedia.secure_url}
                                controls
                                autoPlay
                                className="max-h-screen max-w-full object-contain"
                            />
                        ) : (
                            <img
                                src={selectedMedia.secure_url}
                                alt={selectedMedia.public_id}
                                className="max-h-screen max-w-full object-contain"
                            />
                        )}

                        {/* 🔥 BUTTON DOWNLOAD */}
                        <button
                            onClick={() => downloadFile(
                                selectedMedia.secure_url,
                                selectedMedia.public_id.split('/').pop() || 'download'
                            )}
                            className="absolute bottom-4 right-4 z-50 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
                        >
                            <span>⬇️</span>
                            Download
                        </button>

                        {/* 🔥 TAGS DI MODAL */}
                        {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                            <div className="absolute bottom-4 left-4 z-50 flex flex-wrap gap-2">
                                {selectedMedia.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white backdrop-blur-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 🔥 BADGE VIDEO DI MODAL */}
                        {selectedMedia.resource_type === 'video' && (
                            <div className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-black bg-opacity-50 text-white rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                                <span>🎬</span>
                                Video
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SCROLL TO TOP */}
            {media.length > 0 && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg transition-all flex items-center justify-center text-2xl"
                >
                    ↑
                </button>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}