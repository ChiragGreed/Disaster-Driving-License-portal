import React, { useState, useEffect, useRef } from 'react';
import './DrivingSimulator.css';

const DrivingSimulator = ({ onClose, onSuccess }) => {
    // Audio refs
    const marutiAudioRef = useRef(null);
    const padminiAudioRef = useRef(null);
    const ambassadorAudioRef = useRef(null);

    // Ref for KhelKhatamBeta audio
    const crashAudioRef = useRef(null);

    // Play KhelKhatamBeta.mp3 when the user loses (gameState === 'CRASHED')
    useEffect(() => {
        if (gameState === 'CRASHED') {
            if (crashAudioRef.current) {
                crashAudioRef.current.currentTime = 0;
                crashAudioRef.current.play().catch(err => {
                    console.log('Crash audio autoplay blocked:', err);
                });
            }
        } else {
            if (crashAudioRef.current) {
                crashAudioRef.current.pause();
                crashAudioRef.current.currentTime = 0;
            }
        }
    }, [gameState]);

    // Play car-specific songs
    useEffect(() => {

        // Pause/reset all audios first
        const allAudios = [
            marutiAudioRef.current,
            padminiAudioRef.current,
            ambassadorAudioRef.current
        ];

        allAudios.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Only play during gameplay
        if (gameState !== 'PLAYING') return;

        let activeAudio = null;

        if (selectedCar === 'maruti') {
            activeAudio = marutiAudioRef.current;
        } else if (selectedCar === 'padmini') {
            activeAudio = padminiAudioRef.current;
        } else if (selectedCar === 'ambassador') {
            activeAudio = ambassadorAudioRef.current;
        }

        if (activeAudio) {
            activeAudio.currentTime = 0;

            activeAudio.play().catch(err => {
                console.log('Audio autoplay blocked:', err);
            });
        }

        // Cleanup when component changes/unmounts
        return () => {
            allAudios.forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };

    }, [selectedCar, gameState]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 font-mono select-none">
            {/* Maruti Song Audio Element */}
            <audio ref={marutiAudioRef} src="../../../public/Sounds/Maruti.mp3" loop style={{ display: 'none' }} />
            {/* Crash (KhelKhatamBeta) Audio Element */}
            <audio ref={crashAudioRef} src="../../../public/Sounds/KhelKhatamBeta.mp3" style={{ display: 'none' }} />
            {/* Rupee notes bribe animation Overlay */}
            {showBribeAnim && (
                <div className="absolute inset-0 z-[110] bg-black/70 flex items-center justify-center overflow-hidden pointer-events-none">
                    <div className="text-center animate-pulse">
                        <div className="text-8xl mb-4">💸 📄 💸</div>
                        <h2 className="text-3xl font-extrabold text-green-400 font-sans tracking-wide">
                            CORRUPTION PROTOCOL INITIALIZED...
                        </h2>
                        <p className="text-lg text-white font-bold mt-2">
                            Transferring ₹8000 directly into RTO Inspector's GPay account...
                        </p>
                    </div>
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-green-300 text-3xl font-bold font-sans animate-bounce"
                            style={{
                                left: `${Math.random() * 90}vw`,
                                top: `${Math.random() * 90}vh`,
                                animationDuration: `${0.5 + Math.random() * 1.5}s`,
                                animationDelay: `${Math.random()}s`
                            }}
                        >
                            ₹8000
                        </div>
                    ))}
                </div>
            )}

            {/* Retro Win95 Console Arcade Cabinet Box Wrapper (Wider layout 630px max-w) */}
            <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[3px_3px_0px_0px_#000000] max-w-3xl w-full flex flex-col relative">

                {/* Windows 95 System Dialog Title Bar Header */}
                <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-sm tracking-wide font-sans">
                    <span className="flex items-center gap-2">
                        💾 SYSTEM_DRIVING_SIMULATOR_TEST.EXE
                    </span>
                    <button
                        onClick={onClose}
                        className="bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-[#808080] shadow-[1px_1px_0px_0px_#000000] w-5 h-5 flex items-center justify-center text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none font-sans font-bold cursor-pointer"
                    >
                        X
                    </button>
                </div>

                {/* Main Cabinet Screen Screen */}
                <div className="bg-[#5a5d64] p-1.5 flex flex-col items-center">

                    {gameState === 'START' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            {/* CRT Screen Scanlines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

                            {/* Retro Banner */}
                            <div className="w-full border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white p-3 bg-[#e0e0e0] shadow-inner">
                                <h1 className="text-xl font-extrabold tracking-widest text-[#000080] font-sans">
                                    LICENCING ROAD TEST SIMULATOR
                                </h1>
                                <p className="text-[10px] text-gray-700 uppercase font-mono mt-0.5">
                                    HARYANA GOVERNMENT TRANSPORT DEPARTMENT • ESTD 1995
                                </p>
                            </div>

                            {/* Wide Game Preview (Light Gray concrete road) */}
                            <div className="w-96 h-40 border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-[#a1a8b0] relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                                {/* Dividers */}
                                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#4a5460]"></div>
                                <div className="absolute right-1/3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#4a5460]"></div>
                                {/* Grass bushes */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#429346] flex flex-col justify-around text-center text-xs">🌲🌲</div>
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#429346] flex flex-col justify-around text-center text-xs">🌳🌳</div>
                                {/* Cab */}
                                <div className="bg-[#f3c623] text-black border border-black text-[9px] font-bold px-2 py-1 rounded shadow-md animate-bounce relative z-10">
                                    🚖 DRIVING TEST (LMV)
                                </div>
                            </div>

                            {/* Vehicle choice with Win95 look */}
                            <div className="w-full">
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 text-left border-b border-[#808080] pb-1">
                                    Select Vehicle Type:
                                </h3>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        className={`flex-1 p-2 text-[11px] font-bold cursor-pointer transition-all border-2 ${selectedCar === 'padmini' ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-black border-r-2 border-b-2 border-white shadow-inner font-black' : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] text-gray-800 shadow-[1px_1px_0px_0px_#000000]'}`}
                                        onClick={() => setSelectedCar('padmini')}
                                    >
                                        🚕 Padmini Taxi
                                        <div className="text-[8px] opacity-75 font-normal">Kaali Peeli / Standard</div>
                                    </button>
                                    <button
                                        className={`flex-1 p-2 text-[11px] font-bold cursor-pointer transition-all border-2 ${selectedCar === 'maruti' ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-black border-r-2 border-b-2 border-white shadow-inner font-black' : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] text-gray-800 shadow-[1px_1px_0px_0px_#000000]'}`}
                                        onClick={() => setSelectedCar('maruti')}
                                    >
                                        🚗 Maruti 800
                                        <div className="text-[8px] opacity-75 font-normal">Red / High Accel</div>
                                    </button>
                                    <button
                                        className={`flex-1 p-2 text-[11px] font-bold cursor-pointer transition-all border-2 ${selectedCar === 'ambassador' ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-black border-r-2 border-b-2 border-white shadow-inner font-black' : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] text-gray-800 shadow-[1px_1px_0px_0px_#000000]'}`}
                                        onClick={() => setSelectedCar('ambassador')}
                                    >
                                        🏛️ Ambassador
                                        <div className="text-[8px] opacity-75 font-normal">VVIP Red Beacon / Heavy</div>
                                    </button>
                                </div>
                            </div>

                            <div className="w-full">
                                <button
                                    className="w-full bg-[#c0c0c0] text-black font-extrabold text-sm py-2 px-6 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[2px_2px_0px_0px_#000000] active:border-t-2 active:border-l-2 active:border-r-2 active:border-b-2 active:border-white active:border-t-black active:border-l-black active:shadow-none cursor-pointer tracking-widest uppercase focus:outline-dotted focus:outline-1"
                                    onClick={startGame}
                                >
                                    START DISASTER ROAD TEST
                                </button>
                                <p className="text-[9px] text-gray-600 font-semibold mt-2.5">
                                    STEER: A/D or ARROWS • HORN: SPACEBAR • BRAKE: S/DOWN • GO: W/UP
                                </p>
                            </div>
                        </div>
                    )}

                    {gameState === 'PLAYING' && (
                        <div className="relative w-[590px] h-[550px] border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-hidden bg-[#a1a8b0] flex flex-col">

                            {/* Inset Windows 95 Style HUD Display Status Bar */}
                            <div className="z-10 bg-[#c0c0c0] border-b-2 border-[#808080] p-1.5 font-sans text-[11px] grid grid-cols-4 gap-2 shadow-sm flex-shrink-0">
                                {/* HUD Panel 1 */}
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">VEHICLE:</span>
                                    <span className="font-extrabold text-blue-900 leading-tight uppercase truncate">{selectedCar}</span>
                                </div>

                                {/* HUD Panel 2 */}
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">SPEED:</span>
                                    <span className="font-mono font-extrabold text-cyan-800 text-[12px] leading-tight">{speedText}</span>
                                </div>

                                {/* HUD Panel 3 */}
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">PATIENCE:</span>
                                    <span className={`font-mono font-extrabold text-[12px] leading-tight ${health > 30 ? 'text-green-700' : 'text-red-700'}`}>{health}%</span>
                                </div>

                                {/* HUD Panel 4 */}
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-right">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">GOAL DIST:</span>
                                    <span className="font-mono font-extrabold text-red-600 text-[12px] leading-tight">{distanceLeft}m</span>
                                </div>
                            </div>

                            {/* Wide Canvas Object */}
                            <canvas
                                ref={canvasRef}
                                width={582}
                                height={435} // adjusted for top HUD and bottom controller height space
                                className="block flex-grow border-b-2 border-[#808080]"
                            />

                            {/* Windows 95 Style Raised Console Controller Panel at bottom */}
                            <div className="z-10 bg-[#c0c0c0] p-1.5 flex justify-between items-center border-t-2 border-white font-sans flex-shrink-0">
                                {/* Left/Right controls */}
                                <div className="flex gap-2">
                                    <button
                                        className="w-12 h-9 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-bold flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm"
                                        onMouseDown={() => { keys.current.ArrowLeft = true; }}
                                        onMouseUp={() => { keys.current.ArrowLeft = false; }}
                                        onTouchStart={() => { keys.current.ArrowLeft = true; }}
                                        onTouchEnd={() => { keys.current.ArrowLeft = false; }}
                                    >
                                        🛞 ◀
                                    </button>
                                    <button
                                        className="w-12 h-9 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-bold flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm"
                                        onMouseDown={() => { keys.current.ArrowRight = true; }}
                                        onMouseUp={() => { keys.current.ArrowRight = false; }}
                                        onTouchStart={() => { keys.current.ArrowRight = true; }}
                                        onTouchEnd={() => { keys.current.ArrowRight = false; }}
                                    >
                                        ▶ 🛞
                                    </button>
                                </div>

                                {/* Horn center bar */}
                                <button
                                    className="bg-[#c0c0c0] text-black font-extrabold text-[10px] px-6 py-2 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none cursor-pointer uppercase tracking-wider"
                                    onClick={() => synthSound('horn')}
                                >
                                    📯 RETRO HORN
                                </button>

                                {/* Go/Brake controls */}
                                <div className="flex gap-2">
                                    <button
                                        className="w-12 h-9 bg-[#c0c0c0] text-red-700 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-black flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm"
                                        onMouseDown={() => { keys.current.ArrowDown = true; }}
                                        onMouseUp={() => { keys.current.ArrowDown = false; }}
                                        onTouchStart={() => { keys.current.ArrowDown = true; }}
                                        onTouchEnd={() => { keys.current.ArrowDown = false; }}
                                    >
                                        BRAKE
                                    </button>
                                    <button
                                        className="w-12 h-9 bg-[#c0c0c0] text-green-700 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-black flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm animate-pulse"
                                        onMouseDown={() => { keys.current.ArrowUp = true; }}
                                        onMouseUp={() => { keys.current.ArrowUp = false; }}
                                        onTouchStart={() => { keys.current.ArrowUp = true; }}
                                        onTouchEnd={() => { keys.current.ArrowUp = false; }}
                                    >
                                        GAS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'CRASHED' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            {/* Diagnostic Window (Windows 95 alert dialog block) */}
                            <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[3px_3px_0px_0px_#000000] w-full max-w-md my-auto flex flex-col gap-4">
                                <div className="bg-red-800 text-white px-2 py-1 flex justify-between items-center font-bold text-xs tracking-wide">
                                    <span>⚠️ FATAL ERROR: CRASH_DETECTED</span>
                                    <span>X</span>
                                </div>
                                <div className="p-4 text-left">
                                    <div className="text-4xl text-center mb-2">💥</div>
                                    <h3 className="text-sm font-bold text-red-700 mb-1 uppercase tracking-wide">
                                        LICENSE APPLICATION SUSPENDED
                                    </h3>
                                    <p className="text-[11px] font-semibold leading-relaxed text-gray-800">
                                        {failReason}
                                    </p>

                                    <div className="mt-4 border-2 border-dashed border-gray-500 p-2.5 bg-[#d8d8d8] text-center rounded">
                                        <div className="text-[10px] text-gray-600 font-bold">
                                            RTO ASSESSOR BHOLA NATH DIXIT'S STATE:
                                        </div>
                                        <div className="text-[13px] text-red-700 font-extrabold animate-pulse uppercase mt-1">
                                            😠 VERY ANGRY (GPAY NOT RECEIVED)
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 p-2 pt-0">
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs py-3 px-4 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-green-950 shadow-[1px_1px_0px_0px_#000000] rounded cursor-pointer tracking-wider animate-bounce flex items-center justify-center gap-1.5 active:border-t-green-950 active:border-l-green-950 active:border-b-white active:border-r-white active:shadow-none"
                                        onClick={handleBribe}
                                    >
                                        💸 BRIBE RTO INSPECTOR (₹8000 GPAY)
                                    </button>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            className="flex-1 bg-[#c0c0c0] hover:bg-gray-200 text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] font-bold text-[11px] py-2 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                                            onClick={startGame}
                                        >
                                            RETRY HONESTLY 🚗
                                        </button>
                                        <button
                                            className="flex-1 bg-[#c0c0c0] hover:bg-gray-200 text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] font-bold text-[11px] py-2 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                                            onClick={onClose}
                                        >
                                            QUIT SIMULATOR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'PASSED' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            <div className="w-full my-auto flex flex-col gap-4 items-center">
                                <div className="text-4xl animate-bounce">🎉 🪪 🎉</div>
                                <h2 className="text-xl font-extrabold text-green-800 font-sans uppercase leading-none">
                                    LICENCE GRANTED BY MINISTRY
                                </h2>
                                <p className="text-[10px] text-gray-700 uppercase tracking-widest">
                                    {bribed ? "Direct PM Mercy Scheme Override Clearance" : "Passed with Professional Skills"}
                                </p>

                                {/* High fidelity retro style License Card */}
                                <div className="bg-[#f0edd6] border-2 border-amber-900 rounded p-4 text-black text-left font-sans shadow-2xl relative select-none w-full max-w-md border-b-[8px] border-r-[6px] border-amber-950/20">
                                    <div className="flex justify-between items-center border-b-2 border-amber-900 pb-1.5 mb-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xl">🇮🇳</span>
                                            <div>
                                                <div className="text-[8px] font-bold tracking-tight uppercase leading-none text-red-800">
                                                    UNION OF INDIA
                                                </div>
                                                <div className="text-[10px] font-extrabold tracking-tight uppercase leading-none">
                                                    DRIVING LICENCE
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[7px] font-mono text-gray-600 leading-none text-right">
                                            LIC NO: DL-2026-95489<br />
                                            HARYANA RTO
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[80px_1fr] gap-3">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-16 h-18 bg-white border border-gray-400 p-0.5 shadow-inner flex items-center justify-center overflow-hidden">
                                                {bribed ? (
                                                    <span className="text-3xl" title="Bribed Skeleton Face">💀</span>
                                                ) : (
                                                    <span className="text-3xl" title="Champ Face">😎</span>
                                                )}
                                            </div>
                                            <div className="text-[6px] font-bold text-gray-600 bg-white border border-gray-300 px-1 py-0.5 rounded leading-none text-center">
                                                TEMP GRANTED
                                            </div>
                                        </div>

                                        <div className="text-[8px] flex flex-col gap-1 font-semibold leading-tight text-gray-900">
                                            <div>
                                                <span className="text-gray-500 font-bold">NAME:</span> DISASTER CHAMPION
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-bold">DOB:</span> 18-05-1995
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-bold">COV:</span> LMV / HARYANA_TAXI
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-bold">RTO REMARK:</span>{' '}
                                                <span className="text-red-700 font-black tracking-wide uppercase">
                                                    {bribed ? "GPAY_CLEARANCE_PASSED" : "PERFECT_DRIVER_NO_COWS_HARMED"}
                                                </span>
                                            </div>
                                            <div className="mt-2.5 border-t border-amber-900/30 pt-1.5 flex justify-between items-end">
                                                <div className="text-[6px] font-mono text-gray-500">
                                                    EXP: 18-05-2046
                                                </div>
                                                <div className="italic text-[8px] font-mono text-blue-900 font-bold border-b border-blue-900 border-dashed pr-2">
                                                    Bhola Nath
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hologram Circle */}
                                    <div className="absolute right-4 top-12 w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400/40 via-cyan-400/40 to-pink-500/40 border border-white/80 flex items-center justify-center text-[5px] text-gray-700 font-black tracking-tighter opacity-70 animate-spin">
                                        GOVT
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full bg-[#c0c0c0] text-black font-extrabold text-xs py-3 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[2px_2px_0px_0px_#000000] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none cursor-pointer tracking-wider focus:outline-dotted focus:outline-1"
                                onClick={() => {
                                    onSuccess();
                                    onClose();
                                }}
                            >
                                SAVE LICENSE & RETURN TO PORTAL
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrivingSimulator;
