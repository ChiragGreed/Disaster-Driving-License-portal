import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, CreditCard, RefreshCw, Copy, MapPin, Globe, 
    Download, HandCoins, Printer, Smartphone, ArrowUpRight,
    ClipboardList, Calendar, BookOpen, Clock, CheckCircle, 
    Upload, Monitor, Stethoscope
} from 'lucide-react';
import DrivingSimulator from '../../DrivingSimulator/DrivingSimulator';

const ServicesPage = () => {
    const [now, setNow] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const [showGameModal, setShowGameModal] = useState(false);
    const navigate = useNavigate();

    const selectedState = localStorage.getItem('selectedState') || 'Haryana';

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const services = [
        { icon: <div className="bg-[#5c4a73] rounded-full p-4"><FileText className="text-white w-7 h-7" /></div>, label: "Apply for Learner Licence" },
        { icon: <div className="bg-[#1d4ed8] rounded-full p-4"><CreditCard className="text-white w-7 h-7" /></div>, label: "Apply for Driving Licence" },
        { icon: <div className="bg-[#f97316] rounded-full p-4"><RefreshCw className="text-white w-7 h-7" /></div>, label: "Apply for DL Renewal" },
        { icon: <div className="bg-[#ec4899] rounded-full p-4"><Copy className="text-white w-7 h-7" /></div>, label: "Apply for Duplicate DL" },
        { icon: <div className="bg-[#06b6d4] rounded-full p-4"><MapPin className="text-white w-7 h-7" /></div>, label: "Apply for Change of Address" },
        { icon: <div className="bg-[#ef4444] rounded-full p-4"><Globe className="text-white w-7 h-7" /></div>, label: "Apply for International Driving Permit (IDP)" },
        { icon: <div className="bg-[#2563eb] rounded-full p-4"><Download className="text-white w-7 h-7" /></div>, label: "DL Extract" },
        { icon: <div className="bg-[#1e3a8a] rounded-full p-4"><HandCoins className="text-white w-7 h-7" /></div>, label: "Fee Payments" },
        { icon: <div className="bg-[#a855f7] rounded-full p-4"><Printer className="text-white w-7 h-7" /></div>, label: "Print Application Forms" },
        { icon: <div className="bg-[#38bdf8] rounded-full p-4"><Smartphone className="text-white w-7 h-7" /></div>, label: "Mobile Number Update" },
        { icon: <div className="bg-[#84cc16] rounded-full p-4"><ArrowUpRight className="text-white w-7 h-7" /></div>, label: "Service Withdraw" },
        { icon: <div className="bg-[#7e22ce] rounded-full p-4"><CreditCard className="text-white w-7 h-7" /></div>, label: "DL Services (Replace of DL/Others)" },
        { icon: <div className="bg-[#ea580c] rounded-full p-4"><ClipboardList className="text-white w-7 h-7" /></div>, label: "Add Class of Vehicles to an Application" },
        { icon: <div className="bg-[#86198f] rounded-full p-4"><Calendar className="text-white w-7 h-7" /></div>, label: "Appointments" },
        { icon: <div className="bg-[#2563eb] rounded-full p-4"><BookOpen className="text-white w-7 h-7" /></div>, label: "Tutorial for LL Test" },
        { icon: <div className="bg-[#ef4444] rounded-full p-4"><Clock className="text-white w-7 h-7" /></div>, label: "Complete your Pending Application", bold: true },
        { icon: <div className="bg-[#16a34a] rounded-full p-4"><CheckCircle className="text-white w-7 h-7" /></div>, label: "Check Payment Status", bold: true },
        { icon: <div className="bg-[#3b82f6] rounded-full p-4"><Upload className="text-white w-7 h-7" /></div>, label: "Upload Document" },
        { icon: <div className="bg-[#1e40af] rounded-full p-4"><Monitor className="text-white w-7 h-7" /></div>, label: "Online LLTest(STALL)" },
        { icon: <div className="bg-[#14b8a6] rounded-full p-4"><Stethoscope className="text-white w-7 h-7" /></div>, label: "Find Doctor" },
    ];

    return (
        <div className="min-h-screen font-sans flex flex-col bg-white">
            {/* Header */}
            <header className="bg-[#1CA6EF] text-white py-1 px-6 flex justify-between items-center z-10">
                <div className="flex items-center space-x-3 w-1/3">
                    <img src="/images/MinistryOfRoad.png" alt="Ministry of Road Transport and Highways" className="h-16 object-contain" />
                </div>

                <div className="flex items-center justify-center w-1/3">
                    <img src="/images/ParivahanSarthi.png" alt="Parivahan Sarathi" className="h-16 object-contain" />
                </div>

                <div className="flex flex-col items-end w-1/3">
                    <div className="flex justify-between w-full pl-8 text-[11px] font-medium items-start">
                        <div className="flex flex-col items-center">
                            <div className="flex space-x-2 mt-2">
                                <span className='text-black font-bold'>DATE:</span>
                                <span>{now.toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
                                <span className='text-black font-bold ml-2'>TIME:</span>
                                <span>{now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            </div>
                            <button 
                                onClick={() => navigate('/')}
                                className="mt-1 bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-3 py-1 rounded shadow-sm font-semibold transition-colors cursor-pointer"
                            >
                                Change State
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-end mt-2">
                            <div className="flex space-x-4 items-center mb-1">
                                <span className="flex items-center">
                                    <span className='text-gray-200'>Language:</span>
                                    <span className="ml-1 text-base cursor-pointer text-blue-900 font-bold">अ</span>
                                    <span className="text-[10px] align-bottom cursor-pointer text-blue-900 font-bold ml-0.5">A</span>
                                </span>
                                <div className="flex space-x-3 items-center ml-4 font-bold text-black px-2 py-0.5 rounded">
                                    <button className="hover:text-gray-200 text-xs">A-</button>
                                    <button className="hover:text-gray-200 text-sm">A</button>
                                    <button className="hover:text-gray-200 text-base">A+</button>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-6 py-1 rounded shadow-sm font-semibold transition-colors"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </button>
                                <button
                                    className="bg-[#1b5cb3] hover:bg-[#154a96] text-white text-xs px-6 py-1 rounded shadow-sm font-semibold transition-colors"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Title Strip */}
            <div className="bg-[#e6f2ff] text-center py-2">
                <h1 className="text-[#0000ff] text-xl font-bold uppercase tracking-wide">
                    TRANSPORT DEPARTMENT, GOVERNMENT OF {selectedState.toUpperCase()}
                </h1>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-gradient-to-r from-[#2080c0] to-[#20b0d0] text-white text-sm px-4 flex items-center h-10 overflow-x-auto whitespace-nowrap">
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Learner Licence ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Driving Licence ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Conductor Licence ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Driving School Licence ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Appointments ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Upload Document ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Fee Payments ▾</button>
                <button className="hover:bg-black/10 px-3 py-2 h-full flex items-center">Others ▾</button>
                <button className="bg-[#b38f00] hover:bg-[#997a00] px-3 py-1 ml-2 text-xs font-semibold rounded-sm h-7 flex items-center text-black">Application Status</button>
                <button className="bg-[#b38f00] hover:bg-[#997a00] px-3 py-1 ml-2 text-xs font-semibold rounded-sm h-7 flex items-center text-black">File Your Grievance</button>
            </nav>

            {/* Main Content Grid */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12 relative">
                <div className="grid grid-cols-5 gap-y-12 gap-x-6">
                    {services.map((service, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col items-center text-center group cursor-pointer" 
                            onClick={() => {
                                if (index === 1) {
                                    setShowGameModal(true);
                                } else {
                                    setShowPopup(true);
                                }
                            }}
                        >
                            <div className="mb-4 transform transition-transform group-hover:scale-110 shadow-sm rounded-full">
                                {service.icon}
                            </div>
                            <span className={`text-[13px] text-gray-700 max-w-[160px] leading-tight ${service.bold ? 'font-bold text-gray-900' : ''}`}>
                                {service.label}
                            </span>
                            {index === 1 && (
                                <div className="text-[10px] text-emerald-600 font-extrabold tracking-wider mt-1 uppercase animate-pulse">
                                    ● Currently Available
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Floating Chatbot */}
                <div className="fixed bottom-12 right-6 z-50 flex flex-col items-center group">
                    <div className="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1.5 rounded-2xl mb-1 shadow-md border border-blue-200 relative opacity-0 group-hover:opacity-100 transition-opacity">
                        Happy<br/>to Assist
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-blue-100 border-r border-b border-blue-200 transform rotate-45"></div>
                    </div>
                    <div className="bg-white rounded-full p-1.5 shadow-xl cursor-pointer hover:scale-105 transition-transform border border-gray-200">
                        <div className="bg-[#1CA6EF] rounded-full w-14 h-14 flex items-center justify-center relative overflow-hidden">
                            <div className="w-10 h-8 bg-white rounded-t-xl rounded-b-md relative flex flex-col items-center justify-center">
                                <div className="flex space-x-2">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                </div>
                                <div className="w-4 h-1 bg-blue-500 mt-1.5 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Retro Windows 95 Style Lunch Time Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-mono select-none">
                    <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[3px_3px_0px_0px_#000000] max-w-md w-full">
                        {/* Retro Title Bar */}
                        <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-sm tracking-wide font-sans">
                            <span className="flex items-center gap-2">
                                📠 SYSTEM ALERT: SERVICE_OFFLINE_404
                            </span>
                            <button 
                                onClick={() => setShowPopup(false)}
                                className="bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-[#808080] shadow-[1px_1px_0px_0px_#000000] w-5 h-5 flex items-center justify-center text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none font-sans font-bold cursor-pointer"
                            >
                                X
                            </button>
                        </div>

                        {/* Retro Window Content */}
                        <div className="p-5 flex flex-col gap-4 font-sans">
                            <div className="flex items-start gap-4">
                                {/* Vintage Lunch Plate Emoji */}
                                <div className="text-4xl flex-shrink-0 animate-bounce">🍛</div>
                                
                                <div className="flex-1 text-left">
                                    <h3 className="text-base font-bold text-black mb-1">
                                        Fatal Exception - Service Terminated
                                    </h3>
                                    <p className="text-xs text-gray-800 leading-relaxed font-bold">
                                        An error has occurred while trying to access Sarathi Services. The operator is currently unresponsive due to carbohydrate overload.
                                    </p>
                                </div>
                            </div>

                            {/* Inner Inset Box for the Funny Message */}
                            <div className="w-full border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-4 bg-white text-xs text-black shadow-inner">
                                <div className="font-bold text-red-700 mb-2 flex items-center gap-1 text-left">
                                    ⚠️ DETAILS:
                                </div>
                                <div className="font-mono bg-[#f0f0f0] p-2 border border-gray-400 text-[11px] leading-relaxed text-gray-900 break-words font-semibold text-left">
                                    SERVER STATUS: EATING_LUNCH<br />
                                    OPERATOR STATE: SLEEPING<br />
                                    MESSAGE: "Arre bhai, abhi server down hai... Lunch time ke baad aana! 🕒"
                                </div>
                            </div>

                            {/* Retro Actions Row */}
                            <div className="flex justify-end gap-3 mt-1">
                                <button 
                                    className="bg-[#c0c0c0] text-black font-bold text-xs px-6 py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 active:border-white active:border-t-[#808080] active:border-l-[#808080] active:shadow-none outline-none focus:outline-dotted focus:outline-1 focus:outline-black cursor-pointer"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Theek Hai (OK)
                                </button>
                                <button 
                                    className="bg-[#c0c0c0] text-black text-xs px-6 py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 active:border-white active:border-t-[#808080] active:border-l-[#808080] active:shadow-none outline-none focus:outline-dotted focus:outline-1 focus:outline-black cursor-pointer"
                                    onClick={() => alert("System: Refreshing failed because operator refuses to put down the samosa.")}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Retro 2D Driving Simulator Game Modal */}
            {showGameModal && (
                <DrivingSimulator 
                    onClose={() => setShowGameModal(false)}
                    onSuccess={() => {
                        // Display a custom retro dialog alert on success
                        alert("SUCCESS: Your Driving Licence has been officially processed and digitally signed by the Ministry! You are now legally cleared to drive.");
                    }}
                />
            )}

            {/* Footer */}
            <footer className="bg-[#1CA6EF] text-black border-t-2 border-blue-300 mt-auto">
                <div className="flex justify-between items-start px-10 py-6 max-w-7xl mx-auto w-full text-[13px]">
                    <div className="flex flex-col w-1/4">
                        <span className="text-[10px] italic mb-2 font-medium">Designed, developed and hosted by S7</span>
                        <div className="flex items-center space-x-4">
                            <img src="/images/NIC.png" alt="National Informatics Centre" className="h-10 object-contain" />
                            <img src="/images/DigitalIndia.png" alt="Digital India" className="h-10 object-contain" />
                        </div>
                    </div>

                    <div className="flex w-3/4 justify-around text-gray-900 font-medium">
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
                            <a href="#" className="hover:text-white transition-colors">Doctor Registration</a>
                            <a href="#" className="hover:text-white transition-colors">Find Doctor</a>
                            <a href="#" className="hover:text-white transition-colors">Activate User Account</a>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="hover:text-white transition-colors">User Manual</a>
                            <a href="#" className="hover:text-white transition-colors">Acts & Rules</a>
                            <a href="#" className="hover:text-white transition-colors">Screen Reader</a>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                            <a href="#" className="hover:text-white transition-colors">Feedback / Complaints</a>
                            <a href="#" className="hover:text-white transition-colors">FAQs</a>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="hover:text-white transition-colors">Change State</a>
                            <a href="#" className="hover:text-white transition-colors">Parivahan</a>
                            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>

                <div className="bg-[#ffe4e4] text-center text-[12px] py-2 font-medium text-gray-800 tracking-wide">
                    Correctness of the translation into the regional language lies with the respective State Transport Department.
                </div>
            </footer>
        </div>
    );
};

export default ServicesPage;