// src/components/Layout.jsx
import React from 'react';
import BottomNav from './BottomNav';
import HeaderGallery from './HeaderGallery';

export default function Layout({
    children,
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
        <div className="min-h-screen bg-white">
            {/* HEADER GALLERY - DI ATAS */}
            <HeaderGallery
                title={title}
                subtitle={subtitle}
                totalItems={totalItems}
                totalPhoto={totalPhoto}
                totalVideo={totalVideo}
                tags={tags}
                selectedTag={selectedTag}
                onTagChange={onTagChange}
            />

            {/* CONTENT */}
            {children}

            {/* BOTTOM NAV - DI BAWAH */}
            <BottomNav />
        </div>
    );
}