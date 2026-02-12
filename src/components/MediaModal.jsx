// src/components/MediaModal.jsx
import React, { useEffect, useState, useRef } from 'react';

export default function MediaModal({
    media,
    onClose,
    onDownload,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
    isVideoMode
}) {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const videoRef = useRef(null);

    // 🔥 TUTUP MODAL PAKE ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // 🔥 HANDLE KEYBOARD NAVIGASI
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight' && hasNext) onNext();
            if (e.key === 'ArrowLeft' && hasPrev) onPrev();
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [hasNext, hasPrev, onNext, onPrev]);

    // 🔥 HANDLE SWIPE UNTUK VIDEO (TIKTOK STYLE)
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isSwipeUp = distance > 50;
        const isSwipeDown = distance < -50;

        if (isSwipeUp && hasNext) {
            onNext();
        }
        if (isSwipeDown && hasPrev) {
            onPrev();
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    if (!media) return null;

    const filename = media.public_id?.split('/').pop() || 'download';
    const isVideo = media.resource_type === 'video';

    // 🔥 RENDER UNTUK VIDEO - STYLE TIKTOK
    if (isVideoMode && isVideo) {
        return (
            <div
                className="fixed inset-0 bg-black z-50"
                onClick={onClose}
            >
                <div
                    className="relative w-full h-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-xl transition-all backdrop-blur-sm"
                    >
                        ✕
                    </button>

                    {/* VIDEO CONTAINER - FULL HEIGHT TIKTOK STYLE */}
                    <div className="flex-1 flex items-center justify-center bg-black">
                        <video
                            ref={videoRef}
                            src={media.secure_url}
                            controls
                            autoPlay
                            loop
                            muted  // 🔥 DITAMBAH: muted biar autoPlay work di semua browser
                            playsInline  // 🔥 DITAMBAH: biar ga fullscreen otomatis di iOS
                            disablePictureInPicture  // 🔥 OPTIONAL: matikan picture in picture
                            controlsList="nodownload"  // 🔥 OPTIONAL: hidden download button bawaan
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* BOTTOM BAR - INFO & ACTIONS */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pb-8">
                        <div className="flex items-end justify-between">
                            {/* LEFT SIDE - TAGS */}
                            <div className="flex-1">
                                {media.tags && media.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {media.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-white/80 text-sm">
                                    Video • {media.width}x{media.height}
                                </p>
                            </div>

                            {/* RIGHT SIDE - DOWNLOAD BUTTON */}
                            <button
                                onClick={() => onDownload(media.secure_url, filename)}
                                className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
                            >
                                <span>⬇️</span>
                                Download
                            </button>
                        </div>
                    </div>

                    {/* NAVIGATION INDICATOR */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2">
                        {hasPrev && (
                            <div className="w-1 h-12 bg-white/30 rounded-full overflow-hidden">
                                <div className="w-1 h-6 bg-white rounded-full"></div>
                            </div>
                        )}
                        {hasNext && (
                            <div className="w-1 h-12 bg-white/30 rounded-full overflow-hidden">
                                <div className="w-1 h-6 bg-white rounded-full absolute bottom-0"></div>
                            </div>
                        )}
                    </div>

                    {/* SWIPE INSTRUCTION - SEMI TRANSPARENT */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/30 text-xs rotate-90 uppercase tracking-widest">
                        Swipe
                    </div>

                    {/* 🔥 TAMBAHAN: MUTE TOGGLE (optional) - kalo pengen ada suara */}
                    <button
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.muted = !videoRef.current.muted;
                            }
                        }}
                        className="absolute bottom-24 right-4 z-50 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                    >
                        {videoRef.current?.muted ? '🔇' : '🔊'}
                    </button>
                </div>
            </div>
        );
    }

    // 🔥 RENDER UNTUK FOTO - PREVIEW 1x1
    return (
        <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-xl transition-all backdrop-blur-sm"
                >
                    ✕
                </button>

                {/* NAVIGATION BUTTONS - HANYA UNTUK FOTO */}
                {hasPrev && (
                    <button
                        onClick={onPrev}
                        className="absolute left-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl transition-all backdrop-blur-sm"
                    >
                        ←
                    </button>
                )}

                {/* FOTO PREVIEW */}
                <img
                    src={media.secure_url}
                    alt={filename}
                    className="max-h-screen max-w-full object-contain"
                />

                {hasNext && (
                    <button
                        onClick={onNext}
                        className="absolute right-4 z-50 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl transition-all backdrop-blur-sm"
                    >
                        →
                    </button>
                )}

                {/* BOTTOM BAR */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    {/* TAGS */}
                    {media.tags && media.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {media.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white backdrop-blur-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* DOWNLOAD BUTTON */}
                    <button
                        onClick={() => onDownload(media.secure_url, filename)}
                        className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
                    >
                        <span>⬇️</span>
                        Download
                    </button>
                </div>

                {/* COUNTER */}
                {hasPrev && hasNext && (
                    <div className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-black bg-opacity-50 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                        {currentIndex + 1} / {totalItems}
                    </div>
                )}
            </div>
        </div>
    );
}