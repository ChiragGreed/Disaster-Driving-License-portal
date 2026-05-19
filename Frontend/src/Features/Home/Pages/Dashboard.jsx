import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

const banners = [
    '/images/portal1.jpg',
    '/images/portal2.jpg',
    '/images/portal3.jpg',
    '/images/portal4.jpg'
];

// Online parody images
const MODI_IMG =
    'https://tse2.mm.bing.net/th/id/OIP.N0s2xKknMTLvquhh2KyTsQHaEK?pid=Api&h=220&P=0';

const MODI_WAVE =
    'https://tse4.mm.bing.net/th/id/OIP.IE7EUPCY8O03MK5l8VBepgHaEK?pid=Api&h=220&P=0';

const MODI_SARKAR =
    'https://tse2.mm.bing.net/th/id/OIP.ixHxKilgnoaG34lTSLO_DwHaFj?pid=Api&h=220&P=0';

export default function Dashboard() {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [now, setNow] = useState(new Date());
    const navigate = useNavigate();

    const [selectedState, setSelectedState] = useState('');
    const [mapSvg, setMapSvg] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);

    const mapContainerRef = useRef(null);

    useEffect(() => {
        fetch('/images/india_map.svg')
            .then(res => res.text())
            .then(data => {
                setMapSvg(data);
            })
            .catch(err => {
                console.error("Failed to load India map SVG:", err);
            });
    }, []);

    useEffect(() => {
        if (!mapSvg) return;

        const savedState = localStorage.getItem('selectedState');

        if (savedState) {
            setSelectedState(savedState);

            setTimeout(() => {
                const paths = document.querySelectorAll('.india-map-container svg path');

                paths.forEach(path => {
                    if (path.getAttribute('aria-label') === savedState) {
                        path.classList.add('active-state-path');
                    } else {
                        path.classList.remove('active-state-path');
                    }
                });
            }, 100);
        }
    }, [mapSvg]);

    useEffect(() => {
        const container = mapContainerRef.current;

        if (!container) return;

        const handleNativeClick = (e) => {
            const path = e.target.closest('path');

            if (path) {
                const stateName = path.getAttribute('aria-label') || path.id;

                if (stateName) {
                    setSelectedState(stateName);
                    localStorage.setItem('selectedState', stateName);

                    container.querySelectorAll('path').forEach(p => {
                        p.classList.remove('active-state-path');
                    });

                    path.classList.add('active-state-path');

                    setShowMapModal(false);
                }
            }
        };

        container.addEventListener('click', handleNativeClick);

        return () => {
            container.removeEventListener('click', handleNativeClick);
        };
    }, [mapSvg, showMapModal]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 10);

        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="min-h-screen font-sans flex flex-col bg-white relative overflow-hidden">

            {/* Background Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `url(${MODI_SARKAR})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '120px'
                }}
            />

            {/* Floating Stickers */}
            <img
                src={MODI_WAVE}
                alt=""
                className="fixed bottom-6 left-4 h-28 opacity-80 z-40 rotate-[-12deg] pointer-events-none rounded-xl shadow-2xl"
            />

            <img
                src={MODI_IMG}
                alt=""
                className="fixed top-40 right-4 h-24 opacity-70 z-40 rotate-[8deg] pointer-events-none rounded-xl shadow-2xl animate-pulse"
            />

            {/* Header */}
            <header className="bg-[#1CA6EF] text-white py-1.5 px-6 flex justify-between items-center shadow-md z-10 relative">

                <div className="flex items-center space-x-3 w-1/3">
                    <img
                        src="/images/MinistryOfRoad.png"
                        alt="Ministry of Road Transport and Highways"
                        className="h-16 object-contain"
                    />
                </div>

                <div className="flex items-center justify-center w-1/3 relative">

                    <img
                        src="/images/ParivahanSarthi.png"
                        alt="Parivahan Sarathi"
                        className="h-16 object-contain"
                    />

                    {/* Modi Badge */}
                    <img
                        src={MODI_WAVE}
                        alt="Modi"
                        className="absolute -right-10 top-[-10px] h-20 rounded-full border-4 border-white shadow-2xl rotate-[8deg]"
                    />
                </div>

                <div className="flex flex-col items-end w-1/3 relative">

                    <img
                        src={MODI_IMG}
                        alt="Modi Sarkar"
                        className="absolute -left-12 top-0 h-20 object-cover rounded-xl shadow-2xl rotate-[-5deg] pointer-events-none"
                    />

                    <div className="flex space-x-4 mb-2 text-[11px] font-medium items-top">
                        <span className='text-black'>DATE:</span>
                        <span>{Math.floor(now.getTime() / 86400000)} (Days since 1970)</span>

                        <span className='text-black'>TIME:</span>
                        <span>{now.getTime()} (ms since 1970)</span>

                        <span className="flex items-top ml-2">
                            <span className='text-black'>
                                Language:
                            </span>

                            <span className="ml-1 text-base cursor-pointer">अ</span>
                            <span className="text-[10px] align-bottom cursor-pointer">A</span>
                        </span>

                        <div className="flex space-x-2 items-center ml-4 font-bold text-black bg-white/20 px-2 py-0.5 rounded">
                            <button className="hover:text-gray-200">A-</button>
                            <button className="hover:text-gray-200">A</button>
                            <button className="hover:text-gray-200">A+</button>
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-1">
                        <button
                            className="bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-6 py-1.5 rounded shadow-sm font-semibold transition-colors"
                            onClick={() => { navigate('/login') }}
                        >
                            Login
                        </button>

                        <button
                            className="bg-[#1b5cb3] hover:bg-[#154a96] text-white text-xs px-6 py-1.5 rounded shadow-sm font-semibold transition-colors"
                            onClick={() => { navigate('/register') }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <section className="relative h-[420px] w-full overflow-hidden bg-gray-100 flex items-center group">

                {/* Huge Watermark */}
                <img
                    src={MODI_IMG}
                    alt="Modi Watermark"
                    className="absolute right-10 bottom-0 h-[360px] opacity-20 z-10 object-cover pointer-events-none rounded-3xl"
                />

                {/* Parody Ribbon */}
                <div className="absolute top-6 left-6 z-30 bg-orange-500 text-white px-6 py-2 rounded-full shadow-2xl border-4 border-white rotate-[-6deg]">
                    <div className="text-xs font-black tracking-widest">
                        MODI SARKAR APPROVED PORTAL™
                    </div>
                </div>

                {/* Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-20"></div>

                {/* Images */}
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-in-out z-0"
                    style={{
                        transform: `translateX(-${currentBannerIndex * 100}%)`
                    }}
                >
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className="h-full w-full flex-shrink-0 relative"
                        >
                            <img
                                src={banner}
                                alt={`Banner ${index + 1}`}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://picsum.photos/id/${10 + index}/1600/500`;
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Funny Text */}
                <div className="absolute bottom-10 left-10 z-30 bg-black/70 backdrop-blur-md text-green-400 px-6 py-4 rounded-xl border border-green-500 shadow-2xl font-mono">
                    <div className="text-xl font-bold">
                        DIGITAL VISHWAGURU SERVICES
                    </div>

                    <div className="text-sm mt-2 animate-pulse">
                        STATUS: NATION BUILDING IN PROGRESS...
                    </div>

                    <div className="text-xs mt-1">
                        AI Powered by Ancient Indian Technology™
                    </div>
                </div>

                {/* Navigation */}
                <button
                    onClick={prevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-6xl px-4 transition-colors font-light z-30 opacity-0 group-hover:opacity-100 cursor-pointer drop-shadow-md"
                >
                    &lsaquo;
                </button>

                <button
                    onClick={nextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-6xl px-4 transition-colors font-light z-30 opacity-0 group-hover:opacity-100 cursor-pointer drop-shadow-md"
                >
                    &rsaquo;
                </button>
            </section>

            {/* Marquee */}
            <marquee className="bg-[#1b5cb3] text-white text-[18px] py-1.5 px-4 tracking-wide font-medium">
                🚨 NATIONAL ALERT: Server uptime has remained 99.999% since Mahabharata era. Jai Digital Bharat 🚨
            </marquee>

            {/* State Selector */}
            <section className="bg-white py-16 flex flex-col items-center justify-center flex-1 border-t border-b border-gray-200 relative">

                {/* Side Modi */}
                <img
                    src={MODI_WAVE}
                    alt=""
                    className="absolute left-10 top-10 h-48 opacity-10 pointer-events-none rounded-2xl"
                />

                <img
                    src={MODI_IMG}
                    alt=""
                    className="absolute right-10 bottom-10 h-48 opacity-10 pointer-events-none rounded-2xl"
                />

                <h2
                    className="text-[#20407d] text-[17px] mb-2 text-center font-serif"
                    style={{
                        fontFamily: "'Times New Roman', Times, serif"
                    }}
                >
                    Online services in this portal are available only for the States listed below
                </h2>

                <h3 className="text-[#2e8b2b] text-[15px] mb-6 text-center font-medium">
                    Please select the State from where the service is to be taken
                </h3>

                <button
                    onClick={() => setShowMapModal(true)}
                    className="border border-gray-300 rounded px-3 py-1.5 text-[13px] w-64 bg-white text-gray-700 focus:outline-none focus:border-blue-400 shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                    <span className="font-medium">
                        {selectedState || '--- Select State ---'}
                    </span>

                    <span className="text-gray-400 text-xs">▼</span>
                </button>

                {selectedState && (
                    <div className="mt-8 flex flex-col items-center animate-fade-in">

                        <div className="text-gray-800 text-[13px] font-bold mb-4 font-mono uppercase">
                            SELECTED STATE:
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200 uppercase font-sans font-extrabold tracking-wide shadow-sm ml-2">
                                {selectedState}
                            </span>
                        </div>

                        <button
                            onClick={() => navigate('/services')}
                            className="bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-8 py-2 rounded shadow-md font-bold transition-all cursor-pointer animate-bounce"
                        >
                            PROCEED ➔
                        </button>
                    </div>
                )}
            </section>

            {/* Modal */}
            {showMapModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

                    <div className="bg-[#d4d0c8] border-2 border-white shadow-[2px_2px_15px_rgba(0,0,0,0.6)] w-full max-w-2xl font-mono text-black relative flex flex-col rounded-sm">

                        <div className="absolute inset-0 pointer-events-none border border-gray-400 m-[1px]"></div>

                        <div className="bg-[#000080] text-white px-2 py-1.5 flex justify-between items-center text-xs font-bold font-sans select-none m-[2px]">
                            <span className="flex items-center space-x-2">
                                <span className="text-sm">🗺️</span>

                                <span className="tracking-wide">
                                    SELECT STATE - INTERACTIVE MAP OF INDIA
                                </span>
                            </span>

                            <button
                                onClick={() => setShowMapModal(false)}
                                className="bg-[#d4d0c8] text-black border-2 border-white shadow-[inset_-1px_-1px_0px_#000,1px_1px_0px_#fff] px-2 py-0.5 font-bold hover:bg-gray-300 active:shadow-[inset_1px_1px_0px_#000] cursor-pointer font-mono text-[10px]"
                            >
                                X
                            </button>
                        </div>

                        <div className="bg-[#d4d0c8] border-b border-gray-400 p-3 text-[11px] font-sans text-gray-700 select-none">
                            ℹ️ Click on your state outline directly on the map below to select it.
                        </div>

                        <div className="p-6 bg-white flex flex-col items-center justify-center min-h-[420px] max-h-[460px] overflow-auto border-t-2 border-gray-400 m-2 mt-0">

                            {mapSvg ? (
                                <div
                                    ref={mapContainerRef}
                                    className="india-map-container w-full max-w-sm select-none"
                                    dangerouslySetInnerHTML={{ __html: mapSvg }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3">

                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                                    <span className="text-[11px] text-gray-500 font-sans tracking-wide animate-pulse">
                                        BOOTING NATIONAL MAP SERVICES...
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#d4d0c8] p-2 flex justify-between items-center text-[10px] font-sans border-t border-gray-400 select-none mx-2 mb-2">
                            <div className="border border-gray-400 px-3 py-1 bg-gray-100/50 w-full text-center font-mono text-blue-800 font-bold truncate">
                                {selectedState
                                    ? `SELECTED STATE: ${selectedState.toUpperCase()}`
                                    : 'PLEASE CLICK ON A STATE TO CONFIRM'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vishwaguru Section */}
            <section className="bg-gradient-to-r from-orange-100 via-white to-green-100 py-8 border-y-4 border-orange-400">

                <div className="max-w-6xl mx-auto flex items-center justify-center gap-10">

                    <img
                        src={MODI_WAVE}
                        alt="Modi"
                        className="h-40 object-cover rounded-3xl shadow-2xl"
                    />

                    <div className="text-center">

                        <div className="text-4xl font-black text-orange-600 tracking-wider">
                            DIGITAL VISHWAGURU PORTAL
                        </div>

                        <div className="text-xl font-bold text-green-700 mt-2">
                            Empowering Citizens Since 56 Billion Years
                        </div>

                        <div className="mt-4 text-sm bg-black text-green-400 px-4 py-2 rounded font-mono inline-block">
                            STATUS: NATION BUILDING IN PROGRESS...
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1CA6EF] text-black">

                <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto w-full">

                    <div className="flex flex-col w-1/4">

                        <span className="text-[10px] italic mb-2 font-medium">
                            Designed, developed and hosted by
                        </span>

                        <div className="flex items-center space-x-4">

                            <img
                                src="/images/NIC.png"
                                alt="National Informatics Centre"
                                className="h-10 object-contain"
                            />

                            <img
                                src="/images/DigitalIndia.png"
                                alt="Digital India"
                                className="h-10 object-contain"
                            />
                        </div>
                    </div>

                    <div className="bg-[#fdf3cc] p-4 text-[11px] w-[500px] shadow-sm rounded-sm">

                        <div className="font-bold text-red-600 mb-2 flex items-center space-x-2 text-[12px]">
                            <span className="text-blue-500 text-lg">ℹ️</span>

                            <span>
                                Beware of Fraudulent Websites and Apps
                            </span>
                        </div>

                        <p className="text-[10px] italic mb-3 text-gray-700 leading-relaxed pr-4">
                            Vehicle, Driving License, and eChallan related services can only be availed through official platforms.
                        </p>

                        <div className="flex items-center space-x-2 mb-1.5 text-blue-600">
                            <span className="text-blue-400">🌐</span>

                            <a href="#" className="font-bold hover:underline">
                                https://parivahan.gov.in
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-1/4">

                        <div className="text-[11px] mb-1 text-gray-900">
                            Organ Donor Count :
                        </div>

                        <div className="text-[11px] mb-4 text-gray-900">
                            18228068
                        </div>

                        <div className="flex items-center bg-transparent mt-2">

                            <img
                                src="/images/G20.png"
                                alt="G20"
                                className="h-12 object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-rgb-speed text-center text-[12px] py-2 font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
                    Correctness of the translation into the regional language lies with the respective State Transport Department.
                </div>
            </footer>
        </div>
    )
}