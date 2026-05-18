import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Register = ({ onBack }) => {

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrst23456789';
        let result = '';
        for (let i = 0; i < 46; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const [now, setNow] = useState(new Date());
    const [captchaValue, setCaptchaValue] = useState(generateCaptcha);
    const [captchaInput, setCaptchaInput] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRefreshCaptcha = () => {
        setCaptchaValue(generateCaptcha());
        setCaptchaInput('');
    };

    const [modiPopup, setModiPopup] = useState({
        show: false,
        message: '',
        title: '',
        image: '',
        btnText: '',
        onConfirm: null
    });

    const showModiAlert = (message, title = "", onConfirm = null) => {
        const randomImage = '/images/Modi.jpeg';
        
        const titles = ["Mitron!", "Achhe Din!", "Wah Modi Ji Wah!", "Hypocrisy Ki Seema!", "Surgical Strike!"];
        const randomTitle = title || titles[Math.floor(Math.random() * titles.length)];

        const buttons = ["OK", "Mitron!", "Ache Din?", "Swachh Bharat!", "Modi Hai To Mumkin!"];
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)];

        setModiPopup({
            show: true,
            message,
            title: randomTitle,
            image: randomImage,
            btnText: randomButton,
            onConfirm
        });
    };

    const [registerFailCount, setRegisterFailCount] = useState(0);

    const handleRegister = async () => {
        if (!fullname || !email || !password) {
            const nextCount = registerFailCount + 1;
            setRegisterFailCount(nextCount);
            if (nextCount >= 2) {
                showModiAlert(
                    "Bhaiyo aur Behno... You have failed to register twice! I am deeply moved by your struggle. Under the PM's special mercy scheme, you are hereby permitted to bypass the registration directly to services!",
                    "PM Modi Mercy Granted!",
                    () => navigate('/services')
                );
            } else {
                showModiAlert("Please fill all required fields, my dear friends!", "Mitron!");
            }
            return;
        }
        if (captchaInput.trim().toUpperCase() !== captchaValue.toUpperCase()) {
            const nextCount = registerFailCount + 1;
            setRegisterFailCount(nextCount);
            if (nextCount >= 2) {
                showModiAlert(
                    "Bhaiyo aur Behno... You have failed the Captcha twice! I am deeply moved by your struggle. Under the PM's special mercy scheme, you are hereby permitted to bypass the registration directly to services!",
                    "PM Modi Mercy Granted!",
                    () => navigate('/services')
                );
            } else {
                showModiAlert("Invalid Captcha! Hypocrisy ki bhi seema hoti hai... Try again!", "Hypocrisy Ki Seema!");
                handleRefreshCaptcha();
            }
            return;
        }
        try {
            await registerHandler({ fullname, email, contact, password });
            showModiAlert("Registration successful! Achhe din has finally arrived! Please log in now.", "Achhe Din!", () => navigate('/login'));
        } catch (error) {
            console.error(error);
            const nextCount = registerFailCount + 1;
            setRegisterFailCount(nextCount);
            if (nextCount >= 2) {
                showModiAlert(
                    "Bhaiyo aur Behno... You have failed to register twice! I am deeply moved by your struggle. Under the PM's special mercy scheme, you are hereby permitted to bypass the registration directly to services!",
                    "PM Modi Mercy Granted!",
                    () => navigate('/services')
                );
            } else {
                showModiAlert("Registration failed. Yeh toh badtameezi hai... Please try again!", "Surgical Strike!");
            }
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[date.getDay()];
        return `${day}-${month}-${year} ${dayName}`;
    };

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');
        return `${strHours}:${minutes}:${seconds} ${ampm}`;
    };

    const displayLength = Math.min(46, 6 + captchaInput.length);
    const displayedCaptcha = captchaValue.substring(0, displayLength);

    return (
        <div className="min-h-screen flex flex-col bg-[#e6e6e6] font-sans">
            {/* Header */}
            <header className="bg-[#29A3E8] text-white py-2 px-6 flex justify-between items-center shadow-md">
                <div className="flex items-center w-1/3">
                    <img src="/images/MinistryOfRoad.png" alt="Ministry of Road Transport and Highways" className="h-[60px] object-contain" />
                </div>

                <div className="flex items-center justify-center w-1/3">
                    <img src="/images/ParivahanSarthi.png" alt="Parivahan Sarathi" className="h-[50px] object-contain" />
                </div>

                <div className="flex flex-col items-end w-1/3 text-[13px] font-medium tracking-wide">
                    <div>{formatDate(now)}</div>
                    <div>{formatTime(now)}</div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex justify-center items-center py-10">
                <div className="bg-white w-auto min-w-[450px] max-w-[95vw] rounded shadow-[0px_0px_10px_rgba(0,0,0,0.1)] flex flex-col">
                    {/* Card Header */}
                    <div className="flex flex-col items-center pt-6 pb-4">
                        <h2 className="text-[17px] font-medium text-gray-800 mb-2">Register User</h2>
                        <div className="bg-[#222] text-white p-[6px] rounded-full flex items-center justify-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-10 pb-8">
                        <div className="grid grid-cols-[90px_1fr] gap-y-4 items-center">
                            {/* Full Name */}
                            <label className="text-[13px] font-semibold text-gray-800">Full Name:<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="border border-[#bce8f1] rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Email */}
                            <label className="text-[13px] font-semibold text-gray-800">Email:<span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Contact */}
                            <label className="text-[13px] font-semibold text-gray-800">Contact:</label>
                            <input
                                type="text"
                                placeholder="Contact Number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Password */}
                            <label className="text-[13px] font-semibold text-gray-800">Password:<span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Captcha */}
                            <label className="text-[13px] font-semibold text-gray-800">Captcha:<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Captcha"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />
                        </div>

                        {/* Captcha Image & Links row */}
                        <div className="mt-4 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        {/* Simulated Captcha Image */}
                                        <div className="relative w-full max-w-[400px] min-h-[40px] h-auto py-2 px-4 bg-[#d3d3d3] flex items-center justify-center border border-gray-400">
                                            {/* Noise */}
                                            <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')] pointer-events-none"></div>
                                            <span className="text-[#3b9f3b] font-bold text-[22px] tracking-widest relative z-10 filter drop-shadow-sm transform -rotate-1 select-none break-all text-center">{displayedCaptcha}</span>
                                        </div>
                                        {/* Refresh Icon */}
                                        <button onClick={handleRefreshCaptcha} className="text-[#1A2875] hover:text-blue-900 flex items-center justify-center" title="Refresh Captcha">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-[12px] font-semibold text-gray-700 flex items-center gap-1">
                                            Already have an account?
                                            <button onClick={() => navigate('/login')} className="text-[#218121] hover:underline font-bold">Login Here</button>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 mt-1">
                                    <button onClick={handleRegister} className="bg-[#5cc0b5] hover:bg-[#4eb3a8] text-white font-medium text-[13px] px-12 py-[6px] rounded shadow-sm transition-colors w-full">
                                        REGISTER
                                    </button>
                                    <button onClick={onBack || (() => navigate('/'))} className="text-[11px] text-black hover:underline mt-1 mr-1">
                                        Back to <span className="text-[#218121] font-semibold">sarathiservice</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Funny Modi Popup Modal (Old Era Windows 95 Style) */}
            {modiPopup.show && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 font-mono">
                    <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[2px_2px_0px_0px_#000000] max-w-sm w-full select-none">
                        {/* Title Bar */}
                        <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-sm tracking-wide font-sans">
                            <span className="flex items-center gap-2">
                                🖥️ {modiPopup.title}
                            </span>
                            <button 
                                onClick={() => {
                                    setModiPopup(prev => ({ ...prev, show: false }));
                                    if (modiPopup.onConfirm) modiPopup.onConfirm();
                                }}
                                className="bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-[#808080] shadow-[1px_1px_0px_0px_#000000] w-5 h-5 flex items-center justify-center text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none font-sans font-bold cursor-pointer"
                            >
                                X
                            </button>
                        </div>

                        {/* Dialog Body */}
                        <div className="p-4 flex flex-col items-center gap-4 text-center">
                            {/* Image Container with Inset 3D border */}
                            <div className="w-40 h-40 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-white p-1 flex items-center justify-center overflow-hidden shadow-inner">
                                <img 
                                    src="/images/Modi.jpeg" 
                                    alt="Modi Alert" 
                                    className="w-full h-full object-contain filter contrast-125 brightness-95" 
                                />
                            </div>

                            {/* Message Container with Fieldset look */}
                            <div className="w-full border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-3 bg-[#e0e0e0] text-left text-xs text-black font-sans font-semibold min-h-[60px] flex items-center shadow-inner">
                                <span className="leading-relaxed">
                                    ⚠️ {modiPopup.message}
                                </span>
                            </div>

                            {/* Ok Button */}
                            <button 
                                className="bg-[#c0c0c0] text-black font-bold text-xs px-8 py-1.5 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] active:border-t-2 active:border-l-2 active:border-b-2 active:border-r-2 active:border-white active:border-t-[#808080] active:border-l-[#808080] active:shadow-none outline-none focus:outline-dotted focus:outline-1 focus:outline-black cursor-pointer font-sans"
                                onClick={() => {
                                    setModiPopup(prev => ({ ...prev, show: false }));
                                    if (modiPopup.onConfirm) modiPopup.onConfirm();
                                }}
                            >
                                {modiPopup.btnText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
