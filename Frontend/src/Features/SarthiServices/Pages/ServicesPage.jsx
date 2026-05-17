import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, CreditCard, RefreshCw, Copy, MapPin, Globe, 
    Download, HandCoins, Printer, Smartphone, ArrowUpRight,
    ClipboardList, Calendar, BookOpen, Clock, CheckCircle, 
    Upload, Monitor, Stethoscope
} from 'lucide-react';

const ServicesPage = () => {
    const [now, setNow] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

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
                            <button className="mt-1 bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-3 py-1 rounded shadow-sm font-semibold transition-colors">
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
                            <button
                                className="bg-[#659b39] hover:bg-[#55842f] text-white text-xs px-6 py-1 rounded shadow-sm font-semibold transition-colors"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Title Strip */}
            <div className="bg-[#e6f2ff] text-center py-2">
                <h1 className="text-[#0000ff] text-xl font-bold uppercase tracking-wide">
                    TRANSPORT DEPARTMENT, GOVERNMENT OF HARYANA
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
                        <div key={index} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setShowPopup(true)}>
                            <div className="mb-4 transform transition-transform group-hover:scale-110 shadow-sm rounded-full">
                                {service.icon}
                            </div>
                            <span className={`text-[13px] text-gray-700 max-w-[160px] leading-tight ${service.bold ? 'font-bold text-gray-900' : ''}`}>
                                {service.label}
                            </span>
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

            {/* Funny Lunch Time Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center border-t-8 border-orange-500 relative transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl mb-4">🍛</div>
                        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Service Not Available!</h2>
                        <p className="text-lg text-gray-600 mb-6 font-medium">
                            Arre bhai, abhi server down hai... <br/>
                            <span className="text-xl text-red-600 font-bold mt-2 inline-block">Lunch time ke baad aana! 🕒</span>
                        </p>
                        <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded shadow-md transition-colors"
                            onClick={() => setShowPopup(false)}
                        >
                            Theek Hai
                        </button>
                    </div>
                </div>
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