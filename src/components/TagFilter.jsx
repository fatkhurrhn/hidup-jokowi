// src/components/TagFilter.jsx
import React from 'react';

export default function TagFilter({ tags, selectedTag, onTagChange }) {
    return (
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
    );
}