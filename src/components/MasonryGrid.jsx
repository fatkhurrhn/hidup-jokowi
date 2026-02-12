// src/components/MasonryGrid.jsx
import React from 'react';

export default function MasonryGrid({ items, onItemClick }) {
    if (!items || items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Belum Ada Media
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Belum ada foto atau video di folder ini
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
                {items.map((item) => (
                    <div
                        key={item.public_id}
                        onClick={() => onItemClick(item)}
                        className="break-inside-avoid cursor-pointer group relative"
                    >
                        {/* THUMBNAIL */}
                        <div className="relative">
                            <img
                                src={item.thumbnail}
                                alt={item.public_id?.split('/').pop() || 'media'}
                                className="w-full h-auto rounded-lg bg-gray-100"
                                loading="lazy"
                            />

                            {/* BADGE VIDEO */}
                            {item.resource_type === 'video' && (
                                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                    <span>🎬</span>
                                    <span>Video</span>
                                </div>
                            )}
                        </div>

                        {/* OVERLAY HOVER */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300" />

                        {/* TAGS DI KIRI BAWAH */}
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
        </div>
    );
}