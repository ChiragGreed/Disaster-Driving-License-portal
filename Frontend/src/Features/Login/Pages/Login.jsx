import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onBack }) => {
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 46; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const [now, setNow] = useState(new Date());
    const [captchaValue, setCaptchaValue] = useState(generateCaptcha);
    const [captchaInput, setCaptchaInput] = useState('');
    const [username, setUsername] = useState('');
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

    const handleLogin = () => {
        if (!username || !password) {
            alert("Please enter username and password.");
            return;
        }
        if (captchaInput !== captchaValue) {
            alert("Invalid Captcha! Please try again.");
            handleRefreshCaptcha();
            return;
        }
        alert("Login successful!");
        // Logic for authenticating the user would go here
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
        hours = hours ? hours : 12; // the hour '0' should be '12'
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
                <div className="bg-white w-auto min-w-[420px] max-w-[95vw] rounded shadow-[0px_0px_10px_rgba(0,0,0,0.1)] flex flex-col">
                    {/* Card Header */}
                    <div className="flex flex-col items-center pt-6 pb-4">
                        <h2 className="text-[17px] font-medium text-gray-800 mb-2">Sign in</h2>
                        <div className="bg-[#222] text-white p-[6px] rounded-full flex items-center justify-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-10 pb-8">
                        <div className="grid grid-cols-[80px_1fr] gap-y-4 items-center">
                            {/* Username */}
                            <label className="text-[13px] font-semibold text-gray-800">Username:</label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-[#bce8f1] rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Password */}
                            <label className="text-[13px] font-semibold text-gray-800">Password:</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-[5px] text-[13px] outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] transition-all"
                            />

                            {/* Captcha */}
                            <label className="text-[13px] font-semibold text-gray-800">Captcha:</label>
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
                                        <a href="#" className="text-[#218121] hover:underline text-[12px] font-semibold flex items-center gap-1">
                                            Forgot your password
                                            <span className="bg-[#222] text-white rounded-full w-[14px] h-[14px] flex items-center justify-center text-[10px] font-bold">?</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 mt-1">
                                    <button onClick={handleLogin} className="bg-[#5cc0b5] hover:bg-[#4eb3a8] text-white font-medium text-[13px] px-12 py-[6px] rounded shadow-sm transition-colors w-full">
                                        LOGIN
                                    </button>
                                    <button onClick={onBack} className="text-[11px] text-black hover:underline mt-1 mr-1">
                                        Back to <span className="text-[#218121] font-semibold"
                                            onClick={() => { navigate('/') }}>sarathiservice</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;