import React, { useState, useEffect, useRef } from 'react';
import './DrivingSimulator.css';


const DrivingSimulator = ({ onClose, onSuccess }) => {

    // STATES FIRST
    const [gameState, setGameState] = useState('START');
    const [selectedCar, setSelectedCar] = useState('padmini');
    const [score, setScore] = useState(0);
    const [distanceLeft, setDistanceLeft] = useState(1000);
    const [health, setHealth] = useState(100);
    const [failReason, setFailReason] = useState('');
    const [bribed, setBribed] = useState(false);
    const [showBribeAnim, setShowBribeAnim] = useState(false);
    const [speedText, setSpeedText] = useState('0 km/h');

    // REFS AFTER STATES
    const marutiAudioRef = useRef(null);
    const crashAudioRef = useRef(null);
    const padminiAudioRef = useRef(null);
    const ambassadorAudioRef = useRef(null);

    // NOW useEffect can safely use gameState
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

    // Play Maruti song when Maruti car is selected and game is PLAYING
    useEffect(() => {

        const allAudios = [
            marutiAudioRef.current,
            padminiAudioRef.current,
            ambassadorAudioRef.current
        ];

        // Stop everything first
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
            activeAudio.play().catch(err => {
                console.log('Audio autoplay blocked:', err);
            });
        }

    }, [selectedCar, gameState]);


    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    // Audio effects synth helper
    const synthSound = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'horn') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'crash') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } else if (type === 'kaching') {
                const osc2 = ctx.createOscillator();
                osc2.connect(gain);
                osc.type = 'sine';
                osc2.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.15);
                osc2.frequency.setValueAtTime(1046, ctx.currentTime);
                osc2.frequency.setValueAtTime(2093, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start();
                osc2.start();
                osc.stop(ctx.currentTime + 0.4);
                osc2.stop(ctx.currentTime + 0.4);
            } else if (type === 'pothole') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.setValueAtTime(50, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            console.log("Web Audio not supported or blocked");
        }
    };

    // Keyboard states
    const keys = useRef({
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        KeyA: false,
        KeyD: false,
        KeyW: false,
        KeyS: false,
        Space: false
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code in keys.current) {
                keys.current[e.code] = true;
                if (e.code === 'Space') {
                    synthSound('horn');
                }
            }
        };

        const handleKeyUp = (e) => {
            if (e.code in keys.current) {
                keys.current[e.code] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game variables references (Wider road configuration)
    const gameVars = useRef({
        playerX: 295, // center lane for 590 width canvas
        playerY: 350,
        playerSpeed: 0,
        maxSpeed: 8,
        acceleration: 0.15,
        friction: 0.05,
        roadScroll: 0,
        obstacles: [],
        particles: [],
        distanceRemaining: 1000,
        playerHealth: 100,
        laneWidth: 153,
        roadWidth: 460,
        roadLeft: 65,
        shakeDuration: 0,
        shakeIntensity: 0,
        cowCooldown: 0
    });

    const startGame = () => {
        setGameState('PLAYING');
        setDistanceLeft(1000);
        setHealth(100);
        setBribed(false);
        gameVars.current = {
            playerX: 295,
            playerY: 350,
            playerSpeed: 0,
            maxSpeed: selectedCar === 'maruti' ? 14 : selectedCar === 'ambassador' ? 9 : 12,
            acceleration: selectedCar === 'maruti' ? 0.28 : selectedCar === 'ambassador' ? 0.16 : 0.22,
            friction: 0.05,
            roadScroll: 0,
            obstacles: [],
            particles: [],
            distanceRemaining: 1000,
            playerHealth: 100,
            laneWidth: 153,
            roadWidth: 460,
            roadLeft: 65,
            shakeDuration: 0,
            shakeIntensity: 0,
            cowCooldown: 0
        };
    };

    // Main Game Loop Effect
    useEffect(() => {
        if (gameState !== 'PLAYING') {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const carColors = {
            padmini: { body: '#f3c623', roof: '#222', accent: '#000' }, // classic kaali peeli taxi
            maruti: { body: '#e72929', roof: '#e72929', accent: '#111' }, // fierce red
            ambassador: { body: '#fcfcfc', roof: '#fcfcfc', accent: '#d3d3d3' } // vvip white
        };

        const activeColor = carColors[selectedCar];

        const loop = () => {
            const vars = gameVars.current;

            // Handle shake
            let shakeX = 0;
            let shakeY = 0;
            if (vars.shakeDuration > 0) {
                shakeX = (Math.random() - 0.5) * vars.shakeIntensity;
                shakeY = (Math.random() - 0.5) * vars.shakeIntensity;
                vars.shakeDuration--;
            }

            // --- Update Physics & Controls ---
            const leftPressed = keys.current.ArrowLeft || keys.current.KeyA;
            const rightPressed = keys.current.ArrowRight || keys.current.KeyD;
            const upPressed = keys.current.ArrowUp || keys.current.KeyW;
            const downPressed = keys.current.ArrowDown || keys.current.KeyS;

            // Steer Left/Right
            if (leftPressed) {
                vars.playerX -= 6.5; // wider steering responsiveness
                if (vars.playerX < vars.roadLeft + 20) {
                    vars.playerX = vars.roadLeft + 20;
                    vars.playerHealth -= 0.5; // damage scraping side barrier
                    triggerShake(5, 5);
                }
            }
            if (rightPressed) {
                vars.playerX += 6.5;
                if (vars.playerX > vars.roadLeft + vars.roadWidth - 20) {
                    vars.playerX = vars.roadLeft + vars.roadWidth - 20;
                    vars.playerHealth -= 0.5;
                    triggerShake(5, 5);
                }
            }

            // Accelerate/Decelerate
            if (upPressed) {
                vars.playerSpeed += vars.acceleration;
                if (vars.playerSpeed > vars.maxSpeed) vars.playerSpeed = vars.maxSpeed;
            } else if (downPressed) {
                vars.playerSpeed -= vars.acceleration * 1.5;
                if (vars.playerSpeed < 0) vars.playerSpeed = 0;
            } else {
                // drag
                if (vars.playerSpeed > 0) vars.playerSpeed -= vars.friction;
                if (vars.playerSpeed < 0) vars.playerSpeed = 0;
            }

            // Scroll Road
            vars.roadScroll += vars.playerSpeed;

            // Distance tracking
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

            // Speed dashboard presentation
            const currentKmh = Math.ceil(vars.playerSpeed * 15);
            setSpeedText(`${currentKmh} km/h`);

            // Health tracking
            setHealth(Math.ceil(vars.playerHealth));
            if (vars.playerHealth <= 0) {
                vars.playerHealth = 0;
                setFailReason("Your Maruti/Padmini disintegrated completely due to excessive potholes and crashes!");
                setGameState('CRASHED');
                synthSound('crash');
                return;
            }

            // --- Update & Spawn Obstacles ---
            if (Math.random() < 0.022 && vars.obstacles.length < 6) {
                const lane = Math.floor(Math.random() * 3); // 0, 1, 2
                const types = ['car', 'pothole', 'cow', 'speedbreaker', 'rickshaw'];

                // Stray cows spawn warning
                let type = types[Math.floor(Math.random() * types.length)];
                if (type === 'cow' && vars.cowCooldown > 0) {
                    type = 'rickshaw';
                }

                const newObstacle = {
                    x: vars.roadLeft + (lane * vars.laneWidth) + vars.laneWidth / 2,
                    y: -50,
                    type: type,
                    speed: type === 'car' ? (3 + Math.random() * 4) : type === 'rickshaw' ? (2 + Math.random() * 3) : 0,
                    width: type === 'speedbreaker' ? vars.laneWidth : type === 'rickshaw' ? 38 : 42,
                    height: type === 'cow' ? 44 : type === 'pothole' ? 32 : type === 'speedbreaker' ? 14 : type === 'rickshaw' ? 48 : 58,
                    lane: lane,
                    targetX: vars.roadLeft + (lane * vars.laneWidth) + vars.laneWidth / 2,
                    color: ['#e72929', '#2563eb', '#16a34a', '#a855f7'][Math.floor(Math.random() * 4)],
                    hasBounced: false
                };

                if (type === 'speedbreaker') {
                    newObstacle.x = vars.roadLeft + vars.roadWidth / 2; // cover whole road
                    newObstacle.targetX = vars.roadLeft + vars.roadWidth / 2;
                    newObstacle.width = vars.roadWidth;
                }

                vars.obstacles.push(newObstacle);
                if (type === 'cow') {
                    vars.cowCooldown = 120; // prevent immediate cows
                }
            }

            if (vars.cowCooldown > 0) vars.cowCooldown--;

            // Update obstacles
            for (let i = vars.obstacles.length - 1; i >= 0; i--) {
                const obs = vars.obstacles[i];

                // Active Auto-Rickshaw Aggressive Swerving AI Behavior!
                if (obs.type === 'rickshaw' && !obs.hasBounced && obs.y > 60 && obs.y < 260) {
                    // Rickshaw randomly decides to jump lanes directly into the player's path!
                    if (Math.random() < 0.035) {
                        const playerLane = Math.floor((vars.playerX - vars.roadLeft) / vars.laneWidth);
                        if (playerLane !== obs.lane) {
                            const diff = playerLane - obs.lane;
                            const step = diff > 0 ? 1 : -1;
                            obs.lane += step;
                            obs.targetX = vars.roadLeft + (obs.lane * vars.laneWidth) + vars.laneWidth / 2;
                            obs.hasBounced = true; // swerve once

                            // Screech sound notify
                            synthSound('pothole');
                        }
                    }
                }

                // Smooth slide animation towards target lane x position
                if (obs.targetX !== undefined) {
                    obs.x += (obs.targetX - obs.x) * 0.12; // 12% frame interpolation for smooth lateral slide
                }

                // Scroll obstacle down relative to player speed
                obs.y += (vars.playerSpeed - obs.speed);

                // Check out of bounds
                if (obs.y > canvas.height + 100) {
                    vars.obstacles.splice(i, 1);
                    continue;
                }

                // Collision Detection with Player Car
                const pBox = {
                    x: vars.playerX - 20, // wider car box
                    y: vars.playerY - 30,
                    w: 40,
                    h: 60
                };

                const oBox = {
                    x: obs.x - obs.width / 2,
                    y: obs.y - obs.height / 2,
                    w: obs.width,
                    h: obs.height
                };

                if (pBox.x < oBox.x + oBox.w &&
                    pBox.x + pBox.w > oBox.x &&
                    pBox.y < oBox.y + oBox.h &&
                    pBox.y + pBox.h > oBox.y) {

                    // Collided!
                    if (obs.type === 'cow') {
                        setFailReason("TEST FAILED: You hit a sacred cow! 🐄 Instant driving test failure, RTO suspension, and direct jail sentence!");
                        setGameState('CRASHED');
                        synthSound('crash');
                        return;
                    } else if (obs.type === 'car') {
                        vars.playerHealth -= 25;
                        triggerShake(20, 15);
                        synthSound('pothole');
                        obs.y -= 60;
                        obs.speed = -2;
                    } else if (obs.type === 'rickshaw') {
                        vars.playerHealth -= 35; // auto rickshaw cuts you off and hits hard!
                        triggerShake(25, 20);
                        synthSound('crash');
                        obs.y -= 70;
                        obs.speed = -3;
                    } else if (obs.type === 'pothole') {
                        vars.playerHealth -= 10;
                        triggerShake(15, 10);
                        synthSound('pothole');
                        vars.playerSpeed *= 0.4;
                        vars.obstacles.splice(i, 1); // remove pothole
                    } else if (obs.type === 'speedbreaker') {
                        if (vars.playerSpeed > 3) {
                            vars.playerHealth -= 15;
                            triggerShake(20, 8);
                            synthSound('pothole');
                            vars.playerSpeed *= 0.2;
                        } else {
                            triggerShake(5, 3);
                            vars.playerSpeed *= 0.8;
                        }
                        vars.obstacles.splice(i, 1);
                    }
                }
            }

            // --- Draw Scenery ---
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(shakeX, shakeY);

            // 1. Draw Grass Shoulders (Retro green dithered pattern)
            ctx.fillStyle = '#429346';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw vintage grass trees
            ctx.fillStyle = '#327236';
            const grassOffset = Math.floor(vars.roadScroll) % 50;
            for (let y = -50 + grassOffset; y < canvas.height + 50; y += 50) {
                // left side bushes
                ctx.beginPath();
                ctx.arc(25, y, 18, 0, Math.PI * 2);
                ctx.fill();
                // right side bushes
                ctx.beginPath();
                ctx.arc(canvas.width - 25, y + 25, 18, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. Draw Yellow Road Borders
            ctx.fillStyle = '#ff9900';
            ctx.fillRect(vars.roadLeft - 8, 0, 8, canvas.height);
            ctx.fillRect(vars.roadLeft + vars.roadWidth, 0, 8, canvas.height);

            // 3. Draw Road Concrete (Dusty Light Gray Concrete Road as requested)
            ctx.fillStyle = '#a1a8b0';
            ctx.fillRect(vars.roadLeft, 0, vars.roadWidth, canvas.height);

            // Vintage Concrete Lane Joints/Cracks texture details
            ctx.strokeStyle = '#8d949c';
            ctx.lineWidth = 2;
            const jointsOffset = Math.floor(vars.roadScroll) % 120;
            for (let y = -120 + jointsOffset; y < canvas.height + 120; y += 120) {
                ctx.beginPath();
                ctx.moveTo(vars.roadLeft, y);
                ctx.lineTo(vars.roadLeft + vars.roadWidth, y);
                ctx.stroke();
            }

            // 4. Draw Scrolling Lane Dividers (Dark slate lane marks on light gray concrete)
            ctx.strokeStyle = '#4a5460';
            ctx.lineWidth = 4;
            ctx.setLineDash([25, 25]);
            ctx.lineDashOffset = -vars.roadScroll;

            // Lane 1 divider
            ctx.beginPath();
            ctx.moveTo(vars.roadLeft + vars.laneWidth, 0);
            ctx.lineTo(vars.roadLeft + vars.laneWidth, canvas.height);
            ctx.stroke();

            // Lane 2 divider
            ctx.beginPath();
            ctx.moveTo(vars.roadLeft + vars.laneWidth * 2, 0);
            ctx.lineTo(vars.roadLeft + vars.laneWidth * 2, canvas.height);
            ctx.stroke();

            ctx.setLineDash([]);

            // 5. Draw Obstacles
            vars.obstacles.forEach((obs) => {
                ctx.save();
                ctx.translate(obs.x, obs.y);

                if (obs.type === 'car') {
                    // Retro traffic car representation
                    ctx.fillStyle = obs.color;
                    ctx.fillRect(-16, -26, 32, 52);
                    ctx.fillStyle = '#000';
                    ctx.fillRect(-19, -19, 3, 11);
                    ctx.fillRect(16, -19, 3, 11);
                    ctx.fillRect(-19, 11, 3, 11);
                    ctx.fillRect(16, 11, 3, 11);
                    ctx.fillStyle = '#87ceeb';
                    ctx.fillRect(-13, -13, 26, 11);
                    ctx.fillStyle = '#111';
                    ctx.fillRect(-13, 1, 26, 16);
                    ctx.fillStyle = '#ffffbb';
                    ctx.fillRect(-12, -27, 4, 3);
                    ctx.fillRect(8, -27, 4, 3);
                } else if (obs.type === 'cow') {
                    ctx.fillStyle = '#fff';
                    ctx.font = '36px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🐄', 0, 0);
                } else if (obs.type === 'pothole') {
                    ctx.fillStyle = '#2b2d30'; // dark crater contrast on light gray road
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 20, 11, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#4e5257';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(-20, 0);
                    ctx.lineTo(-26, -2);
                    ctx.moveTo(20, 0);
                    ctx.lineTo(27, 3);
                    ctx.stroke();
                } else if (obs.type === 'speedbreaker') {
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(-obs.width / 2, -7, obs.width, 14);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    for (let x = -obs.width / 2 + 10; x < obs.width / 2; x += 25) {
                        ctx.beginPath();
                        ctx.moveTo(x, -7);
                        ctx.lineTo(x + 10, 7);
                        ctx.stroke();
                    }
                } else if (obs.type === 'rickshaw') {
                    // Auto Rickshaw shape (Retro Indian Yellow & Green)
                    ctx.fillStyle = '#eab308'; // yellow canopy top
                    ctx.fillRect(-15, -20, 30, 24);

                    ctx.fillStyle = '#15803d'; // green lower body
                    ctx.fillRect(-17, 4, 34, 18);

                    // black chassis wheels
                    ctx.fillStyle = '#111';
                    ctx.fillRect(-19, 6, 3, 12);
                    ctx.fillRect(16, 6, 3, 12);
                    ctx.fillRect(-2, -24, 4, 5); // front wheel

                    // back windshield canvas look
                    ctx.fillStyle = '#111';
                    ctx.fillRect(-12, 14, 24, 4);

                    // windshield front
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(-11, -15, 22, 6);

                    // lights
                    ctx.fillStyle = '#ffffbb';
                    ctx.fillRect(-9, -21, 3, 2);
                    ctx.fillRect(6, -21, 3, 2);
                }
                ctx.restore();
            });

            // 6. Draw Player Car
            ctx.save();
            ctx.translate(vars.playerX, vars.playerY);

            // Wheels
            ctx.fillStyle = '#111111';
            ctx.fillRect(-22, -22, 4, 13);
            ctx.fillRect(18, -22, 4, 13);
            ctx.fillRect(-22, 13, 4, 13);
            ctx.fillRect(18, 13, 4, 13);

            // Body shadow
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(-20, -28, 40, 56);

            // Body
            ctx.fillStyle = activeColor.body;
            ctx.fillRect(-18, -30, 36, 60);

            if (selectedCar === 'padmini') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(-18, -4, 36, 34);
                ctx.fillStyle = '#f3c623';
                ctx.fillRect(-14, -20, 28, 20);
            } else if (selectedCar === 'ambassador') {
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(0, -6, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffb300';
                ctx.fillRect(12, -24, 2, 9);
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(14, -28, 4, 4);
            } else if (selectedCar === 'maruti') {
                ctx.fillStyle = '#111111';
                ctx.fillRect(-7, -30, 3, 60);
                ctx.fillRect(4, -30, 3, 60);
            }

            // Windshields
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(-14, -18, 28, 11);
            ctx.fillRect(-14, 16, 28, 9);
            ctx.fillRect(-17, -4, 2, 18);
            ctx.fillRect(15, -4, 2, 18);

            // front grill
            ctx.fillStyle = '#222';
            ctx.fillRect(-11, -30, 22, 3);

            // Headlights beam glow
            ctx.fillStyle = 'rgba(255, 255, 180, 0.45)';
            ctx.beginPath();
            ctx.moveTo(-14, -30);
            ctx.lineTo(-28, -75);
            ctx.lineTo(0, -75);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(14, -30);
            ctx.lineTo(28, -75);
            ctx.lineTo(0, -75);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffeedd';
            ctx.fillRect(-15, -31, 4, 2);
            ctx.fillRect(11, -31, 4, 2);

            ctx.fillStyle = '#ff2222';
            ctx.fillRect(-16, 29, 4, 2);
            ctx.fillRect(12, 29, 4, 2);

            ctx.restore();

            ctx.restore();

            requestRef.current = requestAnimationFrame(loop);
        };

        const triggerShake = (dur, intens) => {
            const vars = gameVars.current;
            vars.shakeDuration = dur;
            vars.shakeIntensity = intens;
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, selectedCar]);

    const handleBribe = () => {
        synthSound('kaching');
        setShowBribeAnim(true);
        setTimeout(() => {
            setBribed(true);
            setShowBribeAnim(false);
            setGameState('PASSED');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 font-mono select-none">
            <audio
                ref={marutiAudioRef}
                src="/Sounds/Maruti.mp3"
                loop
                style={{ display: 'none' }}
            />

            <audio
                ref={padminiAudioRef}
                src="/Sounds/ChandSeParda.mp3"
                loop
                style={{ display: 'none' }}
            />

            <audio
                ref={ambassadorAudioRef}
                src="/Sounds/15Sector.mp3"
                loop
                style={{ display: 'none' }}
            />

            <audio
                ref={crashAudioRef}
                src="/Sounds/KhelKhatamBeta.mp3"
                style={{ display: 'none' }}
            />
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
