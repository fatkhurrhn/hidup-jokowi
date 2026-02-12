// src/layouts/GalleryLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GalleryHeader from '../components/GalleryHeader';

// Data tags yang akan dipakai di semua halaman gallery
export const availableTags = [
    { id: 'all', label: 'Semua' },
    { id: 'felfest2', label: 'Felfest2' },
    { id: 'umum', label: 'Umum' },
    { id: 'ketua', label: 'Ketua' }
];

export default function GalleryLayout() {
    const location = useLocation();

    // State untuk filter tag (akan diakses oleh child components via context)
    const [selectedTag, setSelectedTag] = React.useState('all');
    const [galleryData, setGalleryData] = React.useState({
        totalItems: 0,
        totalPhoto: 0,
        totalVideo: 0,
        title: 'Galeri',
        subtitle: 'Koleksi foto dan video'
    });

    // Update title berdasarkan route
    React.useEffect(() => {
        switch (location.pathname) {
            case '/all':
                setGalleryData(prev => ({
                    ...prev,
                    title: 'Galeri Semuanya',
                    subtitle: 'Koleksi foto dan video dari berbagai kegiatan'
                }));
                break;
            case '/ketua':
                setGalleryData(prev => ({
                    ...prev,
                    title: 'Galeri Ketua',
                    subtitle: 'Dokumentasi kegiatan Ketua'
                }));
                break;
            default:
                break;
        }
    }, [location.pathname]);

    // Halaman yang tidak perlu GalleryHeader
    const hideHeaderPages = ['/'];
    const shouldShowHeader = !hideHeaderPages.includes(location.pathname);

    if (!shouldShowHeader) {
        return <Outlet />;
    }

    return (
        <>
            <GalleryHeader
                title={galleryData.title}
                subtitle={galleryData.subtitle}
                totalItems={galleryData.totalItems}
                totalPhoto={galleryData.totalPhoto}
                totalVideo={galleryData.totalVideo}
                tags={availableTags}
                selectedTag={selectedTag}
                onTagChange={setSelectedTag}
            />

            {/* Pass selectedTag ke child components via context */}
            <GalleryContext.Provider value={{ selectedTag, setSelectedTag, setGalleryData }}>
                <Outlet />
            </GalleryContext.Provider>
        </>
    );
}

// Create Context
export const GalleryContext = React.createContext({
    selectedTag: 'all',
    setSelectedTag: () => { },
    setGalleryData: () => { }
});