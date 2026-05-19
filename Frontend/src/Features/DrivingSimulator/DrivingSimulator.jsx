import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DrivingSimulator.css';

// ─── POLICE CHAOS OVERLAY ────────────────────────────────────────────────────
const PoliceChaosOverlay = ({ onClose }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [caught, setCaught] = useState(false);
    const [glitchText, setGlitchText] = useState('POLICE INCOMING');
    const [popups, setPopups] = useState([]);
    const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
    const alarmRef = useRef(null);
    const intervalRef = useRef(null);
    const glitchRef = useRef(null);
    const popupRef = useRef(null);
    const dudiRef = useRef(null);
    const hornRef = useRef(null);

    const GLITCH_PHRASES = [
        'POLICE INCOMING',
        'P0L1CE 1NC0M1NG',
        'POLIC3 INCOM1NG',
        'P̷O̸L̵I̶C̷E̸ I̷N̸C̷O̷M̸I̷N̸G̷',
        'YOU CANNOT ESCAPE',
        'Y0U CANN0T ESC4PE',
        'RTO INSPECTOR FURIOUS',
        'GPAY NOT RECEIVED',
        'ARREST WARRANT ISSUED',
        '4RR3ST W4RR4NT 1$$U3D',
    ];

    // Alarm sound via Web Audio
    const startAlarm = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            alarmRef.current = ctx;
            const playBeep = (time, freq1, freq2, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq1, time);
                osc.frequency.setValueAtTime(freq2, time + duration / 2);
                gain.gain.setValueAtTime(0.18, time);
                gain.gain.setValueAtTime(0, time + duration);
                osc.start(time);
                osc.stop(time + duration + 0.01);
            };
            // Loop alarm pattern
            const scheduleAlarm = () => {
                const now = ctx.currentTime;
                for (let i = 0; i < 4; i++) {
                    playBeep(now + i * 0.25, 880, 660, 0.22);
                }
            };
            scheduleAlarm();
            alarmRef._loopId = setInterval(scheduleAlarm, 1100);
        } catch (e) { /* blocked */ }
    }, []);

    const stopAlarm = useCallback(() => {
        clearInterval(alarmRef._loopId);
        try { alarmRef.current?.close(); } catch (e) { }
    }, []);

    // Spawn random fake error popups
    const spawnPopup = useCallback(() => {
        const msgs = [
            '⚠️ VIRUS DETECTED IN LICENSE.PDF',
            '🚨 RTO TRACKING YOUR IP',
            '💀 HARD DISK BEING FORMATTED',
            '📡 LOCATION SHARED WITH THANA',
            '🔴 ARREST WARRANT: DOWNLOADING...',
            '💸 GPAY ACCOUNT FROZEN BY COURT',
            '📸 PHOTO CAPTURED BY CCTV',
            '🚓 PATROL CAR 2.3KM AWAY',
            '🔒 AADHAAR SUSPENDED',
            '📋 FIR NO. 420/2026 FILED',
        ];
        const id = Date.now() + Math.random();
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        const x = 5 + Math.random() * 55;
        const y = 5 + Math.random() * 70;
        setPopups(prev => [...prev.slice(-6), { id, msg, x, y }]);
    }, []);

    useEffect(() => {
        startAlarm();
        document.body.style.cursor = 'none';

        // Countdown
        intervalRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(intervalRef.current);
                    setCaught(true);
                    stopAlarm();
                    document.body.style.cursor = 'default';
                    // Play DudiDudi on loop
                    if (dudiRef.current) {
                        dudiRef.current.currentTime = 0;
                        dudiRef.current.loop = true;
                        const playPromise = dudiRef.current.play();

                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    console.log("DudiDudi playing");
                                })
                                .catch(err => {
                                    console.log("DudiDudi blocked:", err);

                                    // fallback retry
                                    setTimeout(() => {
                                        dudiRef.current?.play().catch(() => { });
                                    }, 300);
                                });
                        }
                    }
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        // Glitch text
        glitchRef.current = setInterval(() => {
            setGlitchText(GLITCH_PHRASES[Math.floor(Math.random() * GLITCH_PHRASES.length)]);
        }, 220);

        // Spawn popups
        popupRef.current = setInterval(spawnPopup, 600);

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(glitchRef.current);
            clearInterval(popupRef.current);
            stopAlarm();
            document.body.style.cursor = 'default';
            if (dudiRef.current) { dudiRef.current.pause(); dudiRef.current.currentTime = 0; }
        };
    }, []);

    // Button runs away on hover
    const runButton = () => {
        setBtnPos({
            x: (Math.random() - 0.5) * 260,
            y: (Math.random() - 0.5) * 120,
        });
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            fontFamily: '"Courier New", monospace',
            userSelect: 'none',
        }}>
            {/* Audio always mounted so ref is populated before caught fires */}
            <audio
                ref={dudiRef}
                src="/Sounds/DudiDudi.mp3"
                preload="auto"
                loop
            />

            <audio
                ref={hornRef}
                src="/Sounds/puneetScream.mp3"
                preload="auto"
            />

            {/* ── CAUGHT SCREEN ── */}
            {caught && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: '#000',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#ff2222',
                }}>
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                    }} />
                    <div style={{ fontSize: 72, marginBottom: 16 }}>🚨</div>
                    <div style={{
                        fontSize: 28, fontWeight: 900, letterSpacing: 6,
                        textShadow: '0 0 20px #ff2222, 2px 2px 0 #000',
                        marginBottom: 8, textAlign: 'center', padding: '0 16px',
                    }}>
                        YOU'VE BEEN CAUGHT
                    </div>
                    <div style={{ fontSize: 13, color: '#ff6666', letterSpacing: 3, marginBottom: 32, textAlign: 'center' }}>
                        RTO INSPECTOR BHOLA NATH DIXIT ARREST CONFIRMED
                    </div>
                    <div style={{
                        border: '2px solid #ff2222', padding: '16px 24px', maxWidth: 420,
                        textAlign: 'center', fontSize: 12, lineHeight: 1.8,
                        color: '#ff9999', marginBottom: 32, background: 'rgba(255,34,34,0.08)',
                    }}>
                        <div style={{ color: '#ff2222', fontWeight: 900, marginBottom: 8, fontSize: 13 }}>■ CHARGE SHEET — FIR NO. 420/2026 ■</div>
                        <div>• Obtaining DL via GPay bribery (₹8000)</div>
                        <div>• Endangering sacred bovine (Cow Collision Attempt)</div>
                        <div>• Reckless operation of Padmini/Maruti/Ambassador</div>
                        <div>• Corruption of RTO Inspector Bhola Nath Dixit</div>
                        <div>• Fleeing simulation jurisdiction</div>
                        <br />
                        <div style={{ color: '#ff4444', fontWeight: 900 }}>
                            SENTENCE: LICENSE CANCELLED ∙ AADHAAR SUSPENDED ∙ 2YRS JAIL
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (dudiRef.current) { dudiRef.current.pause(); dudiRef.current.currentTime = 0; }
                            onClose();
                        }}
                        style={{
                            background: '#ff2222', color: '#000', border: 'none',
                            padding: '12px 32px', fontFamily: '"Courier New", monospace',
                            fontWeight: 900, fontSize: 13, letterSpacing: 3,
                            cursor: 'pointer', textTransform: 'uppercase',
                        }}
                    >
                        ACCEPT PUNISHMENT & CLOSE
                    </button>
                </div>
            )}

            {/* ── COUNTDOWN SCREEN ── */}
            {!caught && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    animation: 'policeFlash 0.4s infinite',
                    cursor: 'none',
                }}>
                    <style>{`
                @keyframes policeFlash {
                    0%,49% { background-color: rgba(180,0,0,0.7); }
                    50%,100% { background-color: rgba(0,0,60,0.75); }
                }
                @keyframes shakeEl {
                    0%,100% { transform: translateX(0) rotate(0); }
                    15% { transform: translateX(-6px) rotate(-1.5deg); }
                    35% { transform: translateX(7px) rotate(1deg); }
                    55% { transform: translateX(-5px) rotate(-0.8deg); }
                    75% { transform: translateX(6px) rotate(1.2deg); }
                }
                @keyframes popupIn {
                    from { transform: scale(0.5) rotate(-8deg); opacity: 0; }
                    to { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes sirenSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

                    {/* Scanlines */}
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 6px)',
                    }} />

                    {/* Fake popup errors */}
                    {popups.map(p => (
                        <div key={p.id} style={{
                            position: 'absolute',
                            left: `${p.x}%`, top: `${p.y}%`,
                            background: '#c0c0c0',
                            border: '2px solid #000',
                            boxShadow: '3px 3px 0 #000',
                            padding: '0',
                            fontFamily: '"Courier New", monospace',
                            fontSize: 11,
                            zIndex: 100,
                            animation: 'popupIn 0.2s ease-out',
                            maxWidth: 240,
                            pointerEvents: 'none',
                        }}>
                            <div style={{ background: '#800000', color: '#fff', padding: '2px 6px', fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>
                                ⚠ SYSTEM WARNING
                            </div>
                            <div style={{ padding: '6px 10px 8px', color: '#000', fontWeight: 700 }}>{p.msg}</div>
                        </div>
                    ))}

                    {/* Main content box */}
                    <div style={{
                        background: 'rgba(0,0,0,0.85)',
                        border: '3px solid #ff2222',
                        padding: '32px 40px',
                        textAlign: 'center',
                        maxWidth: 480,
                        width: '90%',
                        animation: 'shakeEl 0.15s infinite',
                        position: 'relative', zIndex: 10,
                        boxShadow: '0 0 40px rgba(255,0,0,0.5)',
                    }}>
                        {/* Siren lights row */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} style={{
                                    width: 18, height: 18,
                                    borderRadius: '50%',
                                    background: i % 2 === 0 ? '#ff2222' : '#2222ff',
                                    boxShadow: i % 2 === 0 ? '0 0 12px #ff2222' : '0 0 12px #2222ff',
                                    animation: `sirenSpin ${0.3 + i * 0.05}s linear infinite`,
                                }} />
                            ))}
                        </div>

                        <div style={{
                            fontSize: 48, marginBottom: 8,
                            animation: 'shakeEl 0.08s infinite',
                        }}>🚨🚓🚨</div>

                        <div style={{
                            fontSize: 22, fontWeight: 900,
                            color: '#ff2222',
                            letterSpacing: 4,
                            textShadow: '2px 2px 0 #000, 0 0 15px #ff0000',
                            marginBottom: 4,
                            lineHeight: 1.3,
                            wordBreak: 'break-all',
                        }}>
                            {glitchText}
                        </div>

                        <div style={{
                            fontSize: 11, color: '#ff9999',
                            letterSpacing: 2, marginBottom: 24,
                            textTransform: 'uppercase',
                        }}>
                            Haryana Police Cyber Cell • Unit 420
                        </div>

                        {/* Timer */}
                        <div style={{
                            fontSize: 72, fontWeight: 900,
                            color: timeLeft <= 3 ? '#ff0000' : '#ffcc00',
                            textShadow: '3px 3px 0 #000',
                            lineHeight: 1,
                            marginBottom: 12,
                            fontVariantNumeric: 'tabular-nums',
                            animation: timeLeft <= 3 ? 'shakeEl 0.05s infinite' : 'none',
                        }}>
                            {String(timeLeft).padStart(2, '0')}
                        </div>

                        <div style={{ fontSize: 12, color: '#ffaaaa', marginBottom: 24, letterSpacing: 1 }}>
                            SECONDS UNTIL ARREST
                        </div>

                        {/* Progress bar */}
                        <div style={{
                            background: '#330000', height: 8, borderRadius: 4,
                            marginBottom: 24, overflow: 'hidden',
                            border: '1px solid #660000',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(timeLeft / 10) * 100}%`,
                                background: timeLeft > 5 ? '#ff6600' : '#ff0000',
                                transition: 'width 0.9s linear, background 0.3s',
                                boxShadow: '0 0 8px currentColor',
                            }} />
                        </div>

                        {/* Escape button that runs away */}
                        <div style={{ position: 'relative', height: 48 }}>
                            <button
                                onMouseEnter={runButton}
                                onFocus={runButton}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(calc(-50% + ${btnPos.x}px), calc(-50% + ${btnPos.y}px))`,
                                    transition: 'transform 0.15s cubic-bezier(0.22,1,0.36,1)',
                                    background: 'transparent',
                                    border: '1px solid #ff4444',
                                    color: '#ff4444',
                                    padding: '8px 20px',
                                    fontFamily: '"Courier New", monospace',
                                    fontSize: 11, cursor: 'none',
                                    letterSpacing: 2,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                🏃 ESCAPE POLICE
                            </button>
                        </div>
                    </div>
                </div>
            )} {/* end !caught */}
        </div>
    );
};

// ─── MAIN SIMULATOR ──────────────────────────────────────────────────────────
const DrivingSimulator = ({ onClose, onSuccess }) => {

    const [gameState, setGameState] = useState('START');
    const [selectedCar, setSelectedCar] = useState('padmini');
    const [score, setScore] = useState(0);
    const [distanceLeft, setDistanceLeft] = useState(1000);
    const [health, setHealth] = useState(100);
    const [failReason, setFailReason] = useState('');
    const [bribed, setBribed] = useState(false);
    const [showBribeAnim, setShowBribeAnim] = useState(false);
    const [speedText, setSpeedText] = useState('0 km/h');
    const [showBribeOverQuit, setShowBribeOverQuit] = useState(false);
    const [showPolice, setShowPolice] = useState(false);

    const marutiAudioRef = useRef(null);
    const crashAudioRef = useRef(null);
    const padminiAudioRef = useRef(null);
    const ambassadorAudioRef = useRef(null);
    const baapreAudioRef = useRef(null);
    const hornRef = useRef(null);

    const audioUnlockedRef = useRef(false);

    const unlockAudio = async () => {
        if (audioUnlockedRef.current) return;

        const audios = [
            marutiAudioRef.current,
            padminiAudioRef.current,
            ambassadorAudioRef.current,
            baapreAudioRef.current,
            crashAudioRef.current,
            hornRef.current
        ];

        for (const audio of audios) {
            if (!audio) continue;

            try {
                audio.volume = 0;
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1;
            } catch (e) {
                console.log("Audio unlock failed", e);
            }
        }

        audioUnlockedRef.current = true;
    };

    useEffect(() => {
        if (gameState === 'CRASHED') {
            if (crashAudioRef.current) {
                crashAudioRef.current.currentTime = 0;
                crashAudioRef.current.play().catch(() => { });
            }
        } else {
            if (crashAudioRef.current) {
                crashAudioRef.current.pause();
                crashAudioRef.current.currentTime = 0;
            }
        }
    }, [gameState]);

    useEffect(() => {
        const allAudios = [
            marutiAudioRef.current,
            padminiAudioRef.current,
            ambassadorAudioRef.current
        ];

        allAudios.forEach(a => {
            if (a) {
                a.pause();
                a.currentTime = 0;
            }
        });

        if (gameState !== 'PLAYING') return;

        let active = null;

        if (selectedCar === 'maruti') {
            active = marutiAudioRef.current;
        } else if (selectedCar === 'padmini') {
            active = padminiAudioRef.current;
        } else if (selectedCar === 'ambassador') {
            active = ambassadorAudioRef.current;
        }

        if (active) {
            active.volume = 1;

            const playAudio = async () => {
                try {
                    await active.play();
                } catch (err) {
                    console.log("Autoplay blocked, retrying...", err);

                    // Retry after tiny delay
                    setTimeout(() => {
                        active.play().catch(() => { });
                    }, 100);
                }
            };

            playAudio();
        }

    }, [selectedCar, gameState]);

    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    const synthSound = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'crash') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(); osc.stop(ctx.currentTime + 0.5);
            } else if (type === 'kaching') {
                const osc2 = ctx.createOscillator();
                osc2.connect(gain);
                osc.type = 'sine'; osc2.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.15);
                osc2.frequency.setValueAtTime(1046, ctx.currentTime);
                osc2.frequency.setValueAtTime(2093, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(); osc2.start();
                osc.stop(ctx.currentTime + 0.4); osc2.stop(ctx.currentTime + 0.4);
            } else if (type === 'pothole') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.setValueAtTime(50, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) { }
    };

    const keys = useRef({
        ArrowLeft: false, ArrowRight: false,
        ArrowUp: false, ArrowDown: false,
        KeyA: false, KeyD: false, KeyW: false, KeyS: false, Space: false
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code in keys.current) {
                // prevent browser repeat spam
                if (e.repeat) return;

                keys.current[e.code] = true;

                // HORN START
                if (e.code === 'Space' && hornRef.current) {
                    const horn = hornRef.current;

                    horn.loop = true;
                    horn.volume = 0.6;

                    horn.currentTime = 0;

                    horn.play().catch(() => { });
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.code in keys.current) {
                keys.current[e.code] = false;

                // HORN STOP
                if (e.code === 'Space' && hornRef.current) {
                    hornRef.current.pause();
                    hornRef.current.currentTime = 0;
                }
            }
        };

        // stop horn if tab loses focus
        const handleBlur = () => {
            keys.current.Space = false;

            if (hornRef.current) {
                hornRef.current.pause();
                hornRef.current.currentTime = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const gameVars = useRef({
        playerX: 295, playerY: 350, playerSpeed: 0, maxSpeed: 8,
        acceleration: 0.15, friction: 0.05, roadScroll: 0,
        obstacles: [], particles: [], distanceRemaining: 1000,
        playerHealth: 100, laneWidth: 153, roadWidth: 460,
        roadLeft: 65, shakeDuration: 0, shakeIntensity: 0, cowCooldown: 0
    });

    const startGame = () => {
        setGameState('PLAYING');
        setDistanceLeft(1000);
        setHealth(100);
        setBribed(false);
        gameVars.current = {
            playerX: 295, playerY: 350, playerSpeed: 0,
            maxSpeed: selectedCar === 'maruti' ? 14 : selectedCar === 'ambassador' ? 9 : 12,
            acceleration: selectedCar === 'maruti' ? 0.28 : selectedCar === 'ambassador' ? 0.16 : 0.22,
            friction: 0.05, roadScroll: 0, obstacles: [], particles: [],
            distanceRemaining: 1000, playerHealth: 100,
            laneWidth: 153, roadWidth: 460, roadLeft: 65,
            shakeDuration: 0, shakeIntensity: 0, cowCooldown: 0
        };
    };

    useEffect(() => {
        if (gameState !== 'PLAYING') {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const carColors = {
            padmini: { body: '#f3c623', roof: '#222', accent: '#000' },
            maruti: { body: '#e72929', roof: '#e72929', accent: '#111' },
            ambassador: { body: '#fcfcfc', roof: '#fcfcfc', accent: '#d3d3d3' }
        };
        const activeColor = carColors[selectedCar];

        const triggerShake = (dur, intens) => {
            gameVars.current.shakeDuration = dur;
            gameVars.current.shakeIntensity = intens;
        };

        const loop = () => {
            const vars = gameVars.current;
            let shakeX = 0, shakeY = 0;
            if (vars.shakeDuration > 0) {
                shakeX = (Math.random() - 0.5) * vars.shakeIntensity;
                shakeY = (Math.random() - 0.5) * vars.shakeIntensity;
                vars.shakeDuration--;
            }

            const leftPressed = keys.current.ArrowLeft || keys.current.KeyA;
            const rightPressed = keys.current.ArrowRight || keys.current.KeyD;
            const upPressed = keys.current.ArrowUp || keys.current.KeyW;
            const downPressed = keys.current.ArrowDown || keys.current.KeyS;

            if (leftPressed) {
                vars.playerX -= 6.5;
                if (vars.playerX < vars.roadLeft + 20) { vars.playerX = vars.roadLeft + 20; vars.playerHealth -= 0.5; triggerShake(5, 5); }
            }
            if (rightPressed) {
                vars.playerX += 6.5;
                if (vars.playerX > vars.roadLeft + vars.roadWidth - 20) { vars.playerX = vars.roadLeft + vars.roadWidth - 20; vars.playerHealth -= 0.5; triggerShake(5, 5); }
            }
            if (upPressed) { vars.playerSpeed += vars.acceleration; if (vars.playerSpeed > vars.maxSpeed) vars.playerSpeed = vars.maxSpeed; }
            else if (downPressed) { vars.playerSpeed -= vars.acceleration * 1.5; if (vars.playerSpeed < 0) vars.playerSpeed = 0; }
            else { if (vars.playerSpeed > 0) vars.playerSpeed -= vars.friction; if (vars.playerSpeed < 0) vars.playerSpeed = 0; }

            vars.roadScroll += vars.playerSpeed;

            if (vars.playerSpeed > 0) {
                vars.distanceRemaining -= (vars.playerSpeed * 0.05);
                if (vars.distanceRemaining <= 0) {
                    vars.distanceRemaining = 0;
                    setGameState('PASSED');
                    synthSound('kaching');
                    return;
                }
                setDistanceLeft(Math.ceil(vars.distanceRemaining));
            }

            setSpeedText(`${Math.ceil(vars.playerSpeed * 15)} km/h`);
            setHealth(Math.ceil(vars.playerHealth));

            if (vars.playerHealth <= 0) {
                vars.playerHealth = 0;
                setFailReason("Your vehicle disintegrated completely due to excessive potholes and crashes!");
                setGameState('CRASHED');
                synthSound('crash');
                return;
            }

            if (Math.random() < 0.022 && vars.obstacles.length < 6) {
                const lane = Math.floor(Math.random() * 3);
                const types = ['car', 'pothole', 'cow', 'speedbreaker', 'rickshaw'];
                let type = types[Math.floor(Math.random() * types.length)];
                if (type === 'cow' && vars.cowCooldown > 0) type = 'rickshaw';
                const newObs = {
                    x: vars.roadLeft + (lane * vars.laneWidth) + vars.laneWidth / 2,
                    y: -50, type, lane,
                    speed: type === 'car' ? (3 + Math.random() * 4) : type === 'rickshaw' ? (2 + Math.random() * 3) : 0,
                    width: type === 'speedbreaker' ? vars.roadWidth : type === 'rickshaw' ? 38 : 42,
                    height: type === 'cow' ? 44 : type === 'pothole' ? 32 : type === 'speedbreaker' ? 14 : type === 'rickshaw' ? 48 : 58,
                    targetX: vars.roadLeft + (lane * vars.laneWidth) + vars.laneWidth / 2,
                    color: ['#e72929', '#2563eb', '#16a34a', '#a855f7'][Math.floor(Math.random() * 4)],
                    hasBounced: false
                };
                if (type === 'speedbreaker') { newObs.x = vars.roadLeft + vars.roadWidth / 2; newObs.targetX = newObs.x; }
                vars.obstacles.push(newObs);
                if (type === 'cow') vars.cowCooldown = 120;
            }
            if (vars.cowCooldown > 0) vars.cowCooldown--;

            for (let i = vars.obstacles.length - 1; i >= 0; i--) {
                const obs = vars.obstacles[i];
                if (obs.type === 'rickshaw' && !obs.hasBounced && obs.y > 60 && obs.y < 260) {
                    if (Math.random() < 0.035) {
                        const playerLane = Math.floor((vars.playerX - vars.roadLeft) / vars.laneWidth);
                        if (playerLane !== obs.lane) {
                            obs.lane += playerLane > obs.lane ? 1 : -1;
                            obs.targetX = vars.roadLeft + (obs.lane * vars.laneWidth) + vars.laneWidth / 2;
                            obs.hasBounced = true;
                            synthSound('pothole');
                        }
                    }
                }
                if (obs.targetX !== undefined) obs.x += (obs.targetX - obs.x) * 0.12;
                obs.y += (vars.playerSpeed - obs.speed);
                if (obs.y > canvas.height + 100) { vars.obstacles.splice(i, 1); continue; }

                const pBox = { x: vars.playerX - 20, y: vars.playerY - 30, w: 40, h: 60 };
                const oBox = { x: obs.x - obs.width / 2, y: obs.y - obs.height / 2, w: obs.width, h: obs.height };
                if (pBox.x < oBox.x + oBox.w && pBox.x + pBox.w > oBox.x && pBox.y < oBox.y + oBox.h && pBox.y + pBox.h > oBox.y) {
                    if (obs.type === 'cow') { setFailReason("TEST FAILED: You hit a sacred cow! 🐄 Instant driving test failure, RTO suspension, and direct jail sentence!"); setGameState('CRASHED'); synthSound('crash'); return; }
                    else if (obs.type === 'car') { vars.playerHealth -= 25; triggerShake(20, 15); synthSound('pothole'); obs.y -= 60; obs.speed = -2; }
                    else if (obs.type === 'rickshaw') { vars.playerHealth -= 35; triggerShake(25, 20); synthSound('crash'); obs.y -= 70; obs.speed = -3; }
                    else if (obs.type === 'pothole') { vars.playerHealth -= 10; triggerShake(15, 10); synthSound('pothole'); vars.playerSpeed *= 0.4; vars.obstacles.splice(i, 1); }
                    else if (obs.type === 'speedbreaker') { if (vars.playerSpeed > 3) { vars.playerHealth -= 15; triggerShake(20, 8); synthSound('pothole'); vars.playerSpeed *= 0.2; } else { triggerShake(5, 3); vars.playerSpeed *= 0.8; } vars.obstacles.splice(i, 1); }
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(shakeX, shakeY);

            ctx.fillStyle = '#429346';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#327236';
            const grassOffset = Math.floor(vars.roadScroll) % 50;
            for (let y = -50 + grassOffset; y < canvas.height + 50; y += 50) {
                ctx.beginPath(); ctx.arc(25, y, 18, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(canvas.width - 25, y + 25, 18, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = '#ff9900';
            ctx.fillRect(vars.roadLeft - 8, 0, 8, canvas.height);
            ctx.fillRect(vars.roadLeft + vars.roadWidth, 0, 8, canvas.height);
            ctx.fillStyle = '#a1a8b0';
            ctx.fillRect(vars.roadLeft, 0, vars.roadWidth, canvas.height);

            ctx.strokeStyle = '#8d949c'; ctx.lineWidth = 2;
            const jointsOffset = Math.floor(vars.roadScroll) % 120;
            for (let y = -120 + jointsOffset; y < canvas.height + 120; y += 120) {
                ctx.beginPath(); ctx.moveTo(vars.roadLeft, y); ctx.lineTo(vars.roadLeft + vars.roadWidth, y); ctx.stroke();
            }

            ctx.strokeStyle = '#4a5460'; ctx.lineWidth = 4;
            ctx.setLineDash([25, 25]); ctx.lineDashOffset = -vars.roadScroll;
            ctx.beginPath(); ctx.moveTo(vars.roadLeft + vars.laneWidth, 0); ctx.lineTo(vars.roadLeft + vars.laneWidth, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(vars.roadLeft + vars.laneWidth * 2, 0); ctx.lineTo(vars.roadLeft + vars.laneWidth * 2, canvas.height); ctx.stroke();
            ctx.setLineDash([]);

            vars.obstacles.forEach(obs => {
                ctx.save(); ctx.translate(obs.x, obs.y);
                if (obs.type === 'car') {
                    ctx.fillStyle = obs.color; ctx.fillRect(-16, -26, 32, 52);
                    ctx.fillStyle = '#000'; ctx.fillRect(-19, -19, 3, 11); ctx.fillRect(16, -19, 3, 11); ctx.fillRect(-19, 11, 3, 11); ctx.fillRect(16, 11, 3, 11);
                    ctx.fillStyle = '#87ceeb'; ctx.fillRect(-13, -13, 26, 11);
                    ctx.fillStyle = '#111'; ctx.fillRect(-13, 1, 26, 16);
                    ctx.fillStyle = '#ffffbb'; ctx.fillRect(-12, -27, 4, 3); ctx.fillRect(8, -27, 4, 3);
                } else if (obs.type === 'cow') {
                    ctx.font = '36px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('🐄', 0, 0);
                } else if (obs.type === 'pothole') {
                    ctx.fillStyle = '#2b2d30'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 11, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = '#4e5257'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-26, -2); ctx.moveTo(20, 0); ctx.lineTo(27, 3); ctx.stroke();
                } else if (obs.type === 'speedbreaker') {
                    ctx.fillStyle = '#f59e0b'; ctx.fillRect(-obs.width / 2, -7, obs.width, 14);
                    ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
                    for (let x = -obs.width / 2 + 10; x < obs.width / 2; x += 25) { ctx.beginPath(); ctx.moveTo(x, -7); ctx.lineTo(x + 10, 7); ctx.stroke(); }
                } else if (obs.type === 'rickshaw') {
                    ctx.fillStyle = '#eab308'; ctx.fillRect(-15, -20, 30, 24);
                    ctx.fillStyle = '#15803d'; ctx.fillRect(-17, 4, 34, 18);
                    ctx.fillStyle = '#111'; ctx.fillRect(-19, 6, 3, 12); ctx.fillRect(16, 6, 3, 12); ctx.fillRect(-2, -24, 4, 5);
                    ctx.fillStyle = '#111'; ctx.fillRect(-12, 14, 24, 4);
                    ctx.fillStyle = '#1e293b'; ctx.fillRect(-11, -15, 22, 6);
                    ctx.fillStyle = '#ffffbb'; ctx.fillRect(-9, -21, 3, 2); ctx.fillRect(6, -21, 3, 2);
                }
                ctx.restore();
            });

            ctx.save(); ctx.translate(vars.playerX, vars.playerY);
            ctx.fillStyle = '#111111';
            ctx.fillRect(-22, -22, 4, 13); ctx.fillRect(18, -22, 4, 13);
            ctx.fillRect(-22, 13, 4, 13); ctx.fillRect(18, 13, 4, 13);
            ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-20, -28, 40, 56);
            ctx.fillStyle = activeColor.body; ctx.fillRect(-18, -30, 36, 60);
            if (selectedCar === 'padmini') {
                ctx.fillStyle = '#000000'; ctx.fillRect(-18, -4, 36, 34);
                ctx.fillStyle = '#f3c623'; ctx.fillRect(-14, -20, 28, 20);
            } else if (selectedCar === 'ambassador') {
                ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(0, -6, 5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffb300'; ctx.fillRect(12, -24, 2, 9);
                ctx.fillStyle = '#ff0000'; ctx.fillRect(14, -28, 4, 4);
            } else if (selectedCar === 'maruti') {
                ctx.fillStyle = '#111111'; ctx.fillRect(-7, -30, 3, 60); ctx.fillRect(4, -30, 3, 60);
            }
            ctx.fillStyle = '#87ceeb'; ctx.fillRect(-14, -18, 28, 11); ctx.fillRect(-14, 16, 28, 9);
            ctx.fillRect(-17, -4, 2, 18); ctx.fillRect(15, -4, 2, 18);
            ctx.fillStyle = '#222'; ctx.fillRect(-11, -30, 22, 3);
            ctx.fillStyle = 'rgba(255, 255, 180, 0.45)';
            ctx.beginPath(); ctx.moveTo(-14, -30); ctx.lineTo(-28, -75); ctx.lineTo(0, -75); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(14, -30); ctx.lineTo(28, -75); ctx.lineTo(0, -75); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffeedd'; ctx.fillRect(-15, -31, 4, 2); ctx.fillRect(11, -31, 4, 2);
            ctx.fillStyle = '#ff2222'; ctx.fillRect(-16, 29, 4, 2); ctx.fillRect(12, 29, 4, 2);
            ctx.restore();
            ctx.restore();

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [gameState, selectedCar]);

    const handleBribe = () => {
        synthSound('kaching');
        if (baapreAudioRef.current) { baapreAudioRef.current.currentTime = 0; baapreAudioRef.current.play().catch(() => { }); }
        setShowBribeAnim(true);
        setTimeout(() => { setBribed(true); setShowBribeAnim(false); setGameState('PASSED'); }, 1500);
    };

    // Called when user clicks "SAVE LICENSE & RETURN TO PORTAL"
    const handleSaveLicense = () => {
        onSuccess();         // notify parent
        setShowPolice(true); // trigger chaos — DON'T call onClose yet
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 font-mono select-none">

            {/* Police chaos overlay — rendered on top of everything */}
            {showPolice && <PoliceChaosOverlay onClose={onClose} />}

            <audio ref={marutiAudioRef} src="/Sounds/Maruti.mp3" loop style={{ display: 'none' }} />
            <audio ref={padminiAudioRef} src="/Sounds/ChandSeParda.mp3" loop style={{ display: 'none' }} />
            <audio ref={ambassadorAudioRef} src="/Sounds/15Sector.mp3" loop style={{ display: 'none' }} />
            <audio ref={baapreAudioRef} src="/Sounds/Are%20Baap%20re.mp3" style={{ display: 'none' }} />
            <audio ref={crashAudioRef} src="/Sounds/KhelKhatamBeta.mp3" style={{ display: 'none' }} />
            <audio ref={hornRef} src="/Sounds/puneetScream.mp3" style={{ display: 'none' }} />

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
                        <div key={i} className="absolute text-green-300 text-3xl font-bold font-sans animate-bounce"
                            style={{ left: `${Math.random() * 90}vw`, top: `${Math.random() * 90}vh`, animationDuration: `${0.5 + Math.random() * 1.5}s`, animationDelay: `${Math.random()}s` }}>
                            ₹8000
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[3px_3px_0px_0px_#000000] max-w-3xl w-full flex flex-col relative">

                <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-sm tracking-wide font-sans">
                    <span className="flex items-center gap-2">💾 SYSTEM_DRIVING_SIMULATOR_TEST.EXE</span>
                    <button onClick={onClose}
                        className="bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-[#808080] shadow-[1px_1px_0px_0px_#000000] w-5 h-5 flex items-center justify-center text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none font-sans font-bold cursor-pointer">
                        X
                    </button>
                </div>

                <div className="bg-[#5a5d64] p-1.5 flex flex-col items-center">

                    {gameState === 'START' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
                            <div className="w-full border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white p-3 bg-[#e0e0e0] shadow-inner">
                                <h1 className="text-xl font-extrabold tracking-widest text-[#000080] font-sans">LICENCING ROAD TEST SIMULATOR</h1>
                                <p className="text-[10px] text-gray-700 uppercase font-mono mt-0.5">HARYANA GOVERNMENT TRANSPORT DEPARTMENT • ESTD 1995</p>
                            </div>
                            <div className="w-96 h-40 border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-[#a1a8b0] relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                                <div className="absolute left-1/3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#4a5460]"></div>
                                <div className="absolute right-1/3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#4a5460]"></div>
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#429346] flex flex-col justify-around text-center text-xs">🌲🌲</div>
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#429346] flex flex-col justify-around text-center text-xs">🌳🌳</div>
                                <div className="bg-[#f3c623] text-black border border-black text-[9px] font-bold px-2 py-1 rounded shadow-md animate-bounce relative z-10">🚖 DRIVING TEST (LMV)</div>
                            </div>
                            <div className="w-full">
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 text-left border-b border-[#808080] pb-1">Select Vehicle Type:</h3>
                                <div className="flex gap-3 justify-center">
                                    {[['padmini', '🚕 Padmini Taxi', 'Kaali Peeli / Standard'], ['maruti', '🚗 Maruti 800', 'Red / High Accel'], ['ambassador', '🏛️ Ambassador', 'VVIP Red Beacon / Heavy']].map(([id, label, sub]) => (
                                        <button key={id}
                                            className={`flex-1 p-2 text-[11px] font-bold cursor-pointer transition-all border-2 ${selectedCar === id ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-black border-r-2 border-b-2 border-white shadow-inner font-black' : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] text-gray-800 shadow-[1px_1px_0px_0px_#000000]'}`}
                                            onClick={async () => {
                                                await unlockAudio();

                                                setSelectedCar(id);

                                                // wait one frame so audio refs are ready
                                                requestAnimationFrame(() => {
                                                    startGame();
                                                });
                                            }}>
                                            {label}<div className="text-[8px] opacity-75 font-normal">{sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full">
                                <button
                                    className="w-full bg-[#c0c0c0] text-black font-extrabold text-sm py-2 px-6 ..."
                                    onClick={async () => {
                                        await unlockAudio();

                                        // force selected car audio ready
                                        const audioMap = {
                                            maruti: marutiAudioRef.current,
                                            padmini: padminiAudioRef.current,
                                            ambassador: ambassadorAudioRef.current
                                        };

                                        const active = audioMap[selectedCar];

                                        if (active) {
                                            try {
                                                active.currentTime = 0;
                                                active.volume = 1;
                                                await active.play();
                                            } catch (e) {
                                                console.log("Music start failed:", e);
                                            }
                                        }

                                        startGame();
                                    }}
                                >
                                    START DISASTER ROAD TEST
                                </button>
                                <p className="text-[9px] text-gray-600 font-semibold mt-2.5">STEER: A/D or ARROWS • HORN: SPACEBAR • BRAKE: S/DOWN • GO: W/UP</p>
                            </div>
                        </div>
                    )}

                    {gameState === 'PLAYING' && (
                        <div className="relative w-[590px] h-[550px] border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white overflow-hidden bg-[#a1a8b0] flex flex-col">
                            <div className="z-10 bg-[#c0c0c0] border-b-2 border-[#808080] p-1.5 font-sans text-[11px] grid grid-cols-4 gap-2 shadow-sm flex-shrink-0">
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">VEHICLE:</span>
                                    <span className="font-extrabold text-blue-900 leading-tight uppercase truncate">{selectedCar}</span>
                                </div>
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">SPEED:</span>
                                    <span className="font-mono font-extrabold text-cyan-800 text-[12px] leading-tight">{speedText}</span>
                                </div>
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-center">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">PATIENCE:</span>
                                    <span className={`font-mono font-extrabold text-[12px] leading-tight ${health > 30 ? 'text-green-700' : 'text-red-700'}`}>{health}%</span>
                                </div>
                                <div className="border-t-2 border-l-2 border-[#808080] border-r-2 border-b-2 border-white bg-white text-black px-1.5 py-0.5 flex flex-col justify-center text-right">
                                    <span className="text-[8px] text-gray-500 font-bold leading-none uppercase">GOAL DIST:</span>
                                    <span className="font-mono font-extrabold text-red-600 text-[12px] leading-tight">{distanceLeft}m</span>
                                </div>
                            </div>
                            <canvas ref={canvasRef} width={582} height={435} className="block flex-grow border-b-2 border-[#808080]" />
                            <div className="z-10 bg-[#c0c0c0] p-1.5 flex justify-between items-center border-t-2 border-white font-sans flex-shrink-0">
                                <div className="flex gap-2">
                                    {[['ArrowLeft', '🛞 ◀'], ['ArrowRight', '▶ 🛞']].map(([key, label]) => (
                                        <button key={key}
                                            className="w-12 h-9 bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-bold flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm"
                                            onMouseDown={() => { keys.current[key] = true; }}
                                            onMouseUp={() => { keys.current[key] = false; }}
                                            onTouchStart={() => { keys.current[key] = true; }}
                                            onTouchEnd={() => { keys.current[key] = false; }}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <button className="bg-[#c0c0c0] text-black font-extrabold text-[10px] px-6 py-2 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none cursor-pointer uppercase tracking-wider"
                                    onClick={() => synthSound('horn')}>
                                    📯 RETRO HORN
                                </button>
                                <div className="flex gap-2">
                                    <button className="w-12 h-9 bg-[#c0c0c0] text-red-700 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-black flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm"
                                        onMouseDown={() => { keys.current.ArrowDown = true; }} onMouseUp={() => { keys.current.ArrowDown = false; }}
                                        onTouchStart={() => { keys.current.ArrowDown = true; }} onTouchEnd={() => { keys.current.ArrowDown = false; }}>
                                        BRAKE
                                    </button>
                                    <button className="w-12 h-9 bg-[#c0c0c0] text-green-700 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[1px_1px_0px_0px_#000000] font-black flex items-center justify-center cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none text-sm animate-pulse"
                                        onMouseDown={() => { keys.current.ArrowUp = true; }} onMouseUp={() => { keys.current.ArrowUp = false; }}
                                        onTouchStart={() => { keys.current.ArrowUp = true; }} onTouchEnd={() => { keys.current.ArrowUp = false; }}>
                                        GAS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'CRASHED' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            <div className="bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[3px_3px_0px_0px_#000000] w-full max-w-md my-auto flex flex-col gap-4">
                                <div className="bg-red-800 text-white px-2 py-1 flex justify-between items-center font-bold text-xs tracking-wide">
                                    <span>⚠️ FATAL ERROR: CRASH_DETECTED</span><span>X</span>
                                </div>
                                <div className="p-4 text-left">
                                    <div className="text-4xl text-center mb-2">💥</div>
                                    <h3 className="text-sm font-bold text-red-700 mb-1 uppercase tracking-wide">LICENSE APPLICATION SUSPENDED</h3>
                                    <p className="text-[11px] font-semibold leading-relaxed text-gray-800">{failReason}</p>
                                    <div className="mt-4 border-2 border-dashed border-gray-500 p-2.5 bg-[#d8d8d8] text-center rounded">
                                        <div className="text-[10px] text-gray-600 font-bold">RTO ASSESSOR BHOLA NATH DIXIT'S STATE:</div>
                                        <div className="text-[13px] text-red-700 font-extrabold animate-pulse uppercase mt-1">😠 VERY ANGRY (GPAY NOT RECEIVED)</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 p-2 pt-0">
                                    <button className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs py-3 px-4 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-green-950 shadow-[1px_1px_0px_0px_#000000] rounded cursor-pointer tracking-wider animate-bounce flex items-center justify-center gap-1.5 active:border-t-green-950 active:border-l-green-950 active:border-b-white active:border-r-white active:shadow-none"
                                        onClick={handleBribe}>
                                        💸 BRIBE RTO INSPECTOR (₹8000 GPAY)
                                    </button>
                                    <div className="flex gap-2 w-full">
                                        <button className="flex-1 bg-[#c0c0c0] hover:bg-gray-200 text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] font-bold text-[11px] py-2 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                                            onClick={startGame}>
                                            RETRY HONESTLY 🚗
                                        </button>
                                        <div className="flex-1 relative">
                                            <button className="w-full bg-[#c0c0c0] hover:bg-gray-200 text-black border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] font-bold text-[11px] py-2 cursor-pointer active:border-t-black active:border-l-black active:border-b-white active:border-r-white relative overflow-hidden"
                                                onClick={() => setShowBribeOverQuit(true)} disabled={showBribeOverQuit}>
                                                QUIT SIMULATOR
                                            </button>
                                            {showBribeOverQuit && (
                                                <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs py-3 px-4 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-green-950 shadow-[1px_1px_0px_0px_#000000] rounded cursor-pointer tracking-wider animate-slide-in flex items-center justify-center gap-1.5 active:border-t-green-950 active:border-l-green-950 active:border-b-white active:border-r-white active:shadow-none transition-all duration-700"
                                                    style={{ zIndex: 10 }} onClick={handleBribe}>
                                                    💸 BRIBE RTO INSPECTOR (₹8000 GPAY)
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'PASSED' && (
                        <div className="w-[590px] h-[550px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex flex-col items-center justify-between p-6 text-center text-black relative font-sans">
                            <div className="w-full my-auto flex flex-col gap-4 items-center">
                                <div className="text-4xl animate-bounce">🎉 🪪 🎉</div>
                                <h2 className="text-xl font-extrabold text-green-800 font-sans uppercase leading-none">LICENCE GRANTED BY MINISTRY</h2>
                                <p className="text-[10px] text-gray-700 uppercase tracking-widest">{bribed ? "Direct PM Mercy Scheme Override Clearance" : "Passed with Professional Skills"}</p>
                                <div className="bg-[#f0edd6] border-2 border-amber-900 rounded p-4 text-black text-left font-sans shadow-2xl relative select-none w-full max-w-md border-b-[8px] border-r-[6px] border-amber-950/20">
                                    <div className="flex justify-between items-center border-b-2 border-amber-900 pb-1.5 mb-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xl">🇮🇳</span>
                                            <div>
                                                <div className="text-[8px] font-bold tracking-tight uppercase leading-none text-red-800">UNION OF INDIA</div>
                                                <div className="text-[10px] font-extrabold tracking-tight uppercase leading-none">DRIVING LICENCE</div>
                                            </div>
                                        </div>
                                        <div className="text-[7px] font-mono text-gray-600 leading-none text-right">LIC NO: DL-2026-95489<br />HARYANA RTO</div>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-3">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-16 h-18 bg-white border border-gray-400 p-0.5 shadow-inner flex items-center justify-center overflow-hidden">
                                                {bribed ? <span className="text-3xl">💀</span> : <span className="text-3xl">😎</span>}
                                            </div>
                                            <div className="text-[6px] font-bold text-gray-600 bg-white border border-gray-300 px-1 py-0.5 rounded leading-none text-center">TEMP GRANTED</div>
                                        </div>
                                        <div className="text-[8px] flex flex-col gap-1 font-semibold leading-tight text-gray-900">
                                            <div><span className="text-gray-500 font-bold">NAME:</span> DISASTER CHAMPION</div>
                                            <div><span className="text-gray-500 font-bold">DOB:</span> 18-05-1995</div>
                                            <div><span className="text-gray-500 font-bold">COV:</span> LMV / HARYANA_TAXI</div>
                                            <div><span className="text-gray-500 font-bold">RTO REMARK:</span>{' '}
                                                <span className="text-red-700 font-black tracking-wide uppercase">
                                                    {bribed ? "GPAY_CLEARANCE_PASSED" : "PERFECT_DRIVER_NO_COWS_HARMED"}
                                                </span>
                                            </div>
                                            <div className="mt-2.5 border-t border-amber-900/30 pt-1.5 flex justify-between items-end">
                                                <div className="text-[6px] font-mono text-gray-500">EXP: 18-05-2046</div>
                                                <div className="italic text-[8px] font-mono text-blue-900 font-bold border-b border-blue-900 border-dashed pr-2">Bhola Nath</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute right-4 top-12 w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400/40 via-cyan-400/40 to-pink-500/40 border border-white/80 flex items-center justify-center text-[5px] text-gray-700 font-black tracking-tighter opacity-70 animate-spin">GOVT</div>
                                </div>
                                {/* ← KEY CHANGE: calls handleSaveLicense instead of onSuccess+onClose */}
                                <button
                                    className="w-full bg-[#c0c0c0] text-black font-extrabold text-xs py-3 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#808080] shadow-[2px_2px_0px_0px_#000000] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:shadow-none cursor-pointer tracking-wider"
                                    onClick={handleSaveLicense}
                                >
                                    SAVE LICENSE & RETURN TO PORTAL
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default DrivingSimulator;