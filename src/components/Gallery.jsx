// src/components/Gallery.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function Gallery({
    folderName,
    title = "Galeri",
    cloudName = 'dka0pnghx'
}) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [columns, setColumns] = useState(2); // default untuk mobile

    // Deteksi ukuran layar untuk jumlah kolom
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setColumns(4); // desktop
            } else if (window.innerWidth >= 640) {
                setColumns(3); // tablet
            } else {
                setColumns(2); // mobile
            }
        };

        handleResize(); // set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch data
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/images/${folderName}`);
                const data = await res.json();

                if (!res.ok) throw new Error('Gagal konek ke server');
                if (!data.success) throw new Error(data.error);

                // Fetch dimensi asli untuk setiap media
                const itemsWithDimensions = await Promise.all(
                    data.resources.map(async (item) => {
                        // Dapatkan dimensi asli
                        let width, height;

                        if (item.resource_type === 'video') {
                            // Untuk video, kita pake thumbnail dengan dimensi asli
                            const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${item.public_id}.jpg`;

                            // Dapatkan dimensi dari metadata Cloudinary atau set default
                            width = item.width || 640;
                            height = item.height || 360;

                            return {
                                ...item,
                                originalWidth: width,
                                originalHeight: height,
                                aspectRatio: width / height,
                                thumbnail: thumbnailUrl,
                                // URL untuk preview ukuran asli
                                displayUrl: item.secure_url,
                                isVideo: true
                            };
                        } else {
                            // Untuk gambar, kita bisa minta versi dengan ukuran asli untuk preview
                            width = item.width || 800;
                            height = item.height || 600;

                            return {
                                ...item,
                                originalWidth: width,
                                originalHeight: height,
                                aspectRatio: width / height,
                                // Thumbnail dengan ukuran flexible, tanpa crop paksa
                                thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_800,c_limit/${item.public_id}`,
                                displayUrl: item.secure_url,
                                isVideo: false
                            };
                        }
                    })
                );

                setMedia(itemsWithDimensions);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [folderName, cloudName]);

    // Arrange items into columns untuk masonry layout
    const getColumnItems = () => {
        const columnHeights = new Array(columns).fill(0);
        const columnItems = new Array(columns).fill().map(() => []);

        media.forEach((item) => {
            // Hitung tinggi relatif berdasarkan aspect ratio
            const itemHeight = 1 / (item.aspectRatio || 1);

            // Cari kolom dengan tinggi paling rendah
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));

            columnItems[shortestColumn].push(item);
            columnHeights[shortestColumn] += itemHeight;
        });

        return columnItems;
    };

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
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                    <p className="text-gray-600">Belum ada foto/video di folder "{folderName}"</p>
                </div>
            </div>
        );
    }

    const columnItems = getColumnItems();

    return (
        <>
            {/* Masonry Grid */}
            <div className="bg-gray-100 px-2 sm:px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2 sm:gap-4">
                        {columnItems.map((column, colIndex) => (
                            <div key={colIndex} className="flex-1 flex flex-col gap-2 sm:gap-4">
                                {column.map((item) => (
                                    <GalleryItem
                                        key={item.public_id}
                                        item={item}
                                        onClick={() => setSelectedMedia(item)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Preview */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="max-w-5xl w-full bg-white rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end p-2 bg-gray-100">
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="bg-black flex items-center justify-center p-2">
                            {selectedMedia.isVideo ? (
                                <video
                                    src={selectedMedia.displayUrl}
                                    controls
                                    autoPlay
                                    className="max-h-[70vh] max-w-full"
                                    poster={selectedMedia.thumbnail}
                                />
                            ) : (
                                <img
                                    src={selectedMedia.displayUrl}
                                    alt={selectedMedia.public_id}
                                    className="max-h-[70vh] max-w-full object-contain"
                                    loading="lazy"
                                />
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="p-3 bg-white text-sm text-gray-600">
                            {selectedMedia.isVideo ? '🎬 Video' : '📷 Foto'} •{' '}
                            {selectedMedia.originalWidth} x {selectedMedia.originalHeight}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Item Gallery terpisah
function GalleryItem({ item, onClick }) {
    const [isLoading, setIsLoading] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(item.aspectRatio || 1);

    // Hitung padding-bottom berdasarkan aspect ratio
    const paddingBottom = `${(1 / aspectRatio) * 100}%`;

    return (
        <div
            onClick={onClick}
            className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
        >
            {/* Container dengan aspect ratio otomatis */}
            <div
                className="relative w-full bg-gray-200"
                style={{ paddingBottom }}
            >
                {/* Badge */}
                {item.isVideo && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <span>🎬</span>
                            <span className="hidden sm:inline">Video</span>
                        </span>
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Image */}
                <img
                    src={item.thumbnail}
                    alt={item.public_id}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    onLoad={() => setIsLoading(false)}
                    loading="lazy"
                />

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Info kecil (opsional) */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                {item.originalWidth} x {item.originalHeight}
            </div>
        </div>
    );
}