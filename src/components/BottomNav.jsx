import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);

    const mainMenus = [
        { path: '/', label: 'Umum', icon: 'ri-home-5-line' },
        { path: '/ketua', label: 'Ketua', icon: 'ri-user-star-line' },
        { path: '/ragunan', label: 'Ragunan', icon: 'ri-map-pin-line' },
        { path: '/panahan', label: 'Panahan', icon: 'ri-focus-3-line' },
    ];

    const moreMenus = [
        { path: '/tenis-meja', label: 'Tenis Meja' },
        { path: '/felfest-1', label: 'Felfest I' },
        { path: '/felfest-2', label: 'Felfest II' },
        { path: '/tarhib-1447h', label: 'Tarhib 1447H' },
        { path: '/tirta-1', label: 'Tirta Cakti I' },
        { path: '/tirta-2', label: 'Tirta Cakti II' },
        { path: '/tirta-3', label: 'Tirta Cakti III' },
        { path: '/tirta-4', label: 'Tirta Cakti IV' },
        { path: '/tirta-5', label: 'Tirta Cakti V' },
    ];

    return (
        <>
            {/* Bottom Sheet More Menu */}
            {showMore && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40">
                    <div className="bg-white w-full rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Menu Lainnya</h3>
                            <button
                                onClick={() => setShowMore(false)}
                                className="text-slate-500"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {moreMenus.map((menu) => (
                                <Link
                                    key={menu.path}
                                    to={menu.path}
                                    onClick={() => setShowMore(false)}
                                    className="text-center text-sm p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                                >
                                    {menu.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg">
                <div className="max-w-md mx-auto flex justify-around items-center h-16">
                    {mainMenus.map((menu) => {
                        const isActive = location.pathname === menu.path;

                        return (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${isActive
                                        ? 'text-yellow-600'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <i className={`${menu.icon} text-[20px]`} />
                                <span>{menu.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setShowMore(true)}
                        className="flex flex-col items-center justify-center w-full h-full text-xs text-slate-400 hover:text-slate-600"
                    >
                        <i className="ri-more-2-fill text-[20px]" />
                        <span>More</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
