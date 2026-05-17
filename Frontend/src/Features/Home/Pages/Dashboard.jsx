import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const banners = [
    '/images/portal1.jpg',
    '/images/portal2.jpg',
    '/images/portal3.jpg',
    '/images/portal4.jpg'
];

export default function Dashboard() {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [now, setNow] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 10); // Update frequently for milliseconds
        return () => clearInterval(timer);
    }, []);

    const nextBanner = () => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="min-h-screen font-sans flex flex-col bg-white">
            {/* Header */}
            <header className="bg-[#1CA6EF] text-white py-1.5 px-6 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center space-x-3 w-1/3">
                    <img src="/images/MinistryOfRoad.png" alt="Ministry of Road Transport and Highways" className="h-16 object-contain" />
                </div>

                <div className="flex items-center justify-center w-1/3">
                    <img src="/images/ParivahanSarthi.png" alt="Parivahan Sarathi" className="h-16 object-contain" />
                </div>

                <div className="flex flex-col items-end w-1/3">
                    <div className="flex space-x-4 mb-2 text-[11px] font-medium items-top">
                        <span className='text-black'>DATE: </span>
                        <span> {Math.floor(now.getTime() / 86400000)} (Days since 1970)</span>
                        <span className='text-black'>TIME: </span>
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
                    <button
                        className="bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-8 py-1.5 rounded shadow-sm font-semibold transition-colors"
                        onClick={() => { navigate('/login') }}
                    >

                        Login
                    </button>
                </div>
            </header>

            {/* Hero / Banner Slider */}
            <section className="relative h-[420px] w-full overflow-hidden bg-gray-100 flex items-center group">
                {/* Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-20"></div>

                {/* Images Container */}
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-in-out z-0"
                    style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={index} className="h-full w-full flex-shrink-0 relative">
                            <img
                                src={banner}
                                alt={`Banner ${index + 1}`}
                                className="h-full w-full object-cover object-center"
                                onError={(e) => {
                                    // Fallback for missing images
                                    e.target.onerror = null;
                                    e.target.src = `https://picsum.photos/id/${10 + index}/1600/500`;
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
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

            {/* Marquee Strip */}
            <marquee className="bg-[#1b5cb3] text-white text-[18px] py-1.5 px-4 tracking-wide font-medium">
                Others can live when we agree to give. Take a simple step, donate your organs.There is no bar of age sex and color of organs donation. Come forward and take part in saving numerous lives by organ donation
            </marquee>

            {/* State Selector */}
            <section className="bg-white py-16 flex flex-col items-center justify-center flex-1">
                <h2 className="text-[#20407d] text-[17px] mb-2 text-center" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    Online services in this portal are available only for the States listed below
                </h2>
                <h3 className="text-[#2e8b2b] text-[15px] mb-6 text-center font-medium">
                    Please select the State from where the service is to be taken
                </h3>
                <select className="border border-gray-300 rounded px-3 py-1.5 text-[13px] w-64 bg-white text-gray-700 focus:outline-none focus:border-blue-400 shadow-sm">
                    <option>Delhi</option>
                </select>
            </section>

            {/* Footer */}
            <footer className="bg-[#1CA6EF] text-black">
                <div className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col w-1/4">
                        <span className="text-[10px] italic mb-2 font-medium">Designed, developed and hosted by</span>
                        <div className="flex items-center space-x-4">
                            <img src="/images/NIC.png" alt="National Informatics Centre" className="h-10 object-contain" />
                            <img src="/images/DigitalIndia.png" alt="Digital India" className="h-10 object-contain" />
                        </div>
                    </div>

                    <div className="bg-[#fdf3cc] p-4 text-[11px] w-[500px] shadow-sm rounded-sm">
                        <div className="font-bold text-red-600 mb-2 flex items-center space-x-2 text-[12px]">
                            <span className="text-blue-500 text-lg">ℹ️</span>
                            <span>Beware of Fraudulent Websites and Apps</span>
                        </div>
                        <p className="text-[10px] italic mb-3 text-gray-700 leading-relaxed pr-4">
                            Vehicle, Driving License, and eChallan related services can only be availed through the official platforms:
                        </p>
                        <div className="flex items-center space-x-2 mb-1.5 text-blue-600">
                            <span className="text-blue-400">🌐</span>
                            <a href="#" className="font-bold hover:underline">https://parivahan.gov.in</a>
                        </div>
                        <div className="flex items-start space-x-2 mb-2">
                            <span className="text-gray-500">📱</span>
                            <span><span className="font-bold">Nexgen mParivahan</span> mobile app of the Ministry of Road Transport and Highways</span>
                        </div>
                        <ul className="mt-3 space-y-1">
                            <li className="flex items-start text-[9px] font-bold text-gray-800">
                                <span className="text-green-600 mr-2 text-[10px]">✅</span> Always use only the official website and mobile apps of the Ministry
                            </li>
                            <li className="flex items-start text-[9px] font-bold text-gray-800">
                                <span className="text-red-600 mr-2 text-[10px]">❌</span> Do not click on suspicious links or use unknown apps.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center w-1/4">
                        <div className="text-[11px] mb-1 text-gray-900">Organ Donor Count :</div>
                        <div className="text-[11px] mb-4 text-gray-900">18228068</div>
                        <div className="flex items-center bg-transparent mt-2">
                            <img src="/images/G20.png" alt="G20" className="h-12 object-contain" />
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
