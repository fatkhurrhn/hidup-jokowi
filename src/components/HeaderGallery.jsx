// src/components/HeaderGallery.jsx
import React from 'react';
import FilterTags from './FilterTags';

export default function HeaderGallery({
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
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                        {(totalPhoto !== undefined || totalVideo !== undefined) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {totalPhoto > 0 && `${totalPhoto} foto`}
                                {totalPhoto > 0 && totalVideo > 0 && ' • '}
                                {totalVideo > 0 && `${totalVideo} video`}
                            </p>
                        )}
                    </div>
                    {totalItems > 0 && (
                        <span className="text-sm text-gray-500">
                            {totalItems} item
                        </span>
                    )}
                </div>

                {/* FILTER TAGS COMPONENT */}
                {tags && tags.length > 0 && (
                    <FilterTags
                        tags={tags}
                        selectedTag={selectedTag}
                        onTagChange={onTagChange}
                    />
                )}
            </div>
        </div>
    );
}