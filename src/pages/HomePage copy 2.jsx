// src/FolderAllWithTagsPage.jsx
import React, { useState, useEffect } from 'react';
import MasonryGrid from '../components/MasonryGrid';
import MediaModal from '../components/MediaModal';
import HeaderGallery from '../components/HeaderGallery';

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

                const url = `/api/images/ALL`;
                console.log('🔍 Fetching URL:', url);

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) throw new Error('Gagal konek ke server');
                if (!data.success) throw new Error(data.error);

                let items = data.resources.map(item => {
                    if (item.resource_type === 'video') {
                        return {
                            ...item,
                            thumbnail: getVideoThumbnail(item.public_id),
                            tags: item.tags || []
                        };
                    }
                    return {
                        ...item,
                        thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_600,h_900,c_limit/${item.public_id}`,
                        tags: item.tags || []
                    };
                });

                if (selectedTag !== 'all') {
                    items = items.filter(item =>
                        item.tags && item.tags.includes(selectedTag)
                    );
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

    return (
        <div className="min-h-screen bg-white">
            {/* 🔥 HEADER GALLERY COMPONENT */}
            <HeaderGallery
                title="Galeri Semuanya"
                // subtitle="Koleksi foto dan video dari berbagai kegiatan"
                totalItems={media.length}
                totalPhoto={media.filter(m => m.resource_type === 'image').length}
                totalVideo={media.filter(m => m.resource_type === 'video').length}
                tags={availableTags}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
            />

            {/* 🔥 MASONRY GRID COMPONENT */}
            <MasonryGrid
                items={media}
                onItemClick={setSelectedMedia}
            />

            {/* 🔥 MODAL COMPONENT */}
            <MediaModal
                media={selectedMedia}
                onClose={() => setSelectedMedia(null)}
                onDownload={downloadFile}
            />

            {/* SCROLL TO TOP */}
            {media.length > 0 && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg transition-all flex items-center justify-center text-2xl"
                >
                    ↑
                </button>
            )}
        </div>
    );
}