// src/components/FilterTags.jsx
import React from 'react';

export default function FilterTags({ tags, selectedTag, onTagChange }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tags.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => onTagChange(tag.id)}
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
    );
}