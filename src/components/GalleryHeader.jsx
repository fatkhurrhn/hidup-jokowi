// src/components/GalleryHeader.jsx
import React from 'react';

export default function GalleryHeader({
    title,
    subtitle,
    totalItems,
    totalPhoto,
    totalVideo,
    tags,
    selectedTag,
    onTagChange
}) {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Title Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                </div>

                {/* Stats Section */}
                <div className="flex gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{totalItems}</span>
                        <span className="text-gray-600">Total Media</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{totalPhoto}</span>
                        <span className="text-gray-600">Foto</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{totalVideo}</span>
                        <span className="text-gray-600">Video</span>
                    </div>
                </div>

                {/* Tags Filter */}
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => onTagChange(tag.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedTag === tag.id
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}