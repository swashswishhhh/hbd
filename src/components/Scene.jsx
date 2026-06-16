/**
 * Scene.jsx — Themed 3D birthday greeting environment.
 *
 * Layout:
 *   • Warm dark-slate background with mist
 *   • 9 themed, clickable interactive nodes
 *   • Area-based reveals that unlock elements upon exploration
 *   • Multi-source lighting for a warm, celebratory atmosphere
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import Waypoint from './Waypoint';
import CameraRig from './CameraRig';
import KoreanFloor from './KoreanFloor';
import Atmosphere from './Atmosphere';
import CafeInterior from './CafeInterior';
import WallDecorations from './WallDecorations';

// 3D Models
import CakeModel from './models/CakeModel';
import GiftModel from './models/GiftModel';
import FrameModel from './models/FrameModel';
import WishJarModel from './models/WishJarModel';
import CoinFountainModel from './models/CoinFountainModel';
import JukeboxModel from './models/JukeboxModel';
import MenuBoardModel from './models/MenuBoardModel';
import TimeCapsuleModel from './models/TimeCapsuleModel';
import SecretPlantModel from './models/SecretPlantModel';
import MeditationZoneModel from './models/MeditationZoneModel';
import PhotoTimelineModel from './models/PhotoTimelineModel';

// Images
import up1Img from '../images/up1.png';
import up2Img from '../images/up2.png';
import up3Img from '../images/up3.png';

// Songs
import song1 from '../songs/close to you - the carpenters.mp3';
import song2 from '../songs/from the start - laufey.mp3';
import song3 from '../songs/seasons - wave to earth.mp3';
import btsBirthdaySong from '../songs/BTS Singing Happy Birthday.mp3';

// ─── Scene-level colour / layout constants ────────────────────────
export const BG_COLOR = '#1a1a2e';

/**
 * SHAPES — waypoint data array.
 * Controls the camera rig goals, target positions, and basic details.
 */
export const SHAPES = [
  {
    id: 'cake',
    position: [-3.5, 0.5, 0],
    rotation: [0, 0, 0],
    scale: 1,
    speed: 0.15,               // gentle spin
    floatAmp: 0.18,
    floatFreq: 0.8,
    cameraOffset: [3.8, 2.8, 4.8],
  },
  {
    id: 'gift',
    position: [7.6, 1.0, 1.0],
    rotation: [0, -Math.PI / 2, 0],
    scale: 1,
    speed: 0.2,
    floatAmp: 0.22,
    floatFreq: 0.9,
    cameraOffset: [-3.8, 1.6, 0],
    disableSpin: true, // GiftModel manages its own hover-based rotation
  },
  {
    id: 'frame',
    position: [0, 2.5, -8.7],
    rotation: [0, 0, 0],
    scale: 1,
    speed: 0.0,                // stationary wall installation
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [2.5, 1.6, 4.5],
  },
  {
    id: 'wishJar',
    position: [-5.0, 1.5, -8.4],
    rotation: [0, 0, 0],
    scale: 0.95,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [2.8, 1.5, 3.2],
  },
  {
    id: 'coinFountain',
    position: [4.5, -1.3, -1],
    rotation: [0, 0, 0],
    scale: 1.0,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [-3.5, 2.5, 3.8],
  },
  {
    id: 'jukebox',
    position: [-2.5, -1.2, 3],
    rotation: [0, 0.6, 0],
    scale: 0.8,
    speed: 0.0,
    floatAmp: 0.05,
    floatFreq: 0.9,
    cameraOffset: [2.5, 1.8, 3.0],
  },
  {
    id: 'menuBoard',
    position: [4, -0.7, 4.5],
    rotation: [0, -0.6, 0],
    scale: 0.95,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [-3.2, 1.8, 3.2],
  },
  {
    id: 'timeCapsule',
    position: [5, -1.5, -4],
    rotation: [0, -0.8, 0],
    scale: 0.9,
    speed: 0.0,
    floatAmp: 0.08,
    floatFreq: 1.2,
    cameraOffset: [-2.8, 1.8, 3.2],
  },
  {
    id: 'secretPlant',
    position: [8.1, -1.2, -2.5],
    rotation: [0, -Math.PI / 2, 0],
    scale: 1.0,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [-3.2, 1.8, 2.5],
  },
  {
    id: 'meditationZone',
    position: [6.2, -1.4, -6.0],
    rotation: [0, -Math.PI / 4, 0],
    scale: 1.0,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [-2.8, 1.8, 3.0],
  },
  {
    id: 'photoTimeline',
    position: [-8.9, 0.8, -4.0],
    rotation: [0, Math.PI / 2, 0],
    scale: 1.0,
    speed: 0.0,
    floatAmp: 0.0,
    floatFreq: 0.0,
    cameraOffset: [3.4, 1.2, 0.0],
  },
];

// ─── Lighting constants ──────────────────────────────────────────
export const AMBIENT = { intensity: 0.85, color: '#f5ebe0' };
export const DIRECTIONAL = { position: [-6, 12, 5], intensity: 2.2, color: '#FFD4A3', shadowMapSize: 2048 };
export const SPOTLIGHT = { position: [4, 9, 6], intensity: 0.8, color: '#ffead1', angle: Math.PI / 4, penumbra: 0.8, shadowMapSize: 2048 };
export const POINT_LIGHT = { position: [0, 4, 0], intensity: 1.0, color: '#ffe3c4', distance: 20 };

// ─── Main Scene Component ────────────────────────────────────────

export default function Scene() {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isCameraSettled, setIsCameraSettled] = useState(false);

  // Time capsule real-time countdown ticker state
  const [capsuleTicker, setCapsuleTicker] = useState(0);

  useEffect(() => {
    if (activeNodeId === 'timeCapsule') {
      const interval = setInterval(() => {
        setCapsuleTicker((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeNodeId]);

  // Discovery / Exploration states
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [revealedNodes, setRevealedNodes] = useState(new Set(['cake', 'gift', 'frame', 'wishJar', 'coinFountain', 'jukebox', 'secretPlant', 'meditationZone', 'photoTimeline', 'timeCapsule']));

  // Gamification: Coin fountain toss counter
  const [tossCount, setTossCount] = useState(0);

  // Audio / Jukebox soundtrack state
  const [jukeboxTrack, setJukeboxTrack] = useState('none');
  const [isJukeboxPlaying, setIsJukeboxPlaying] = useState(false);
  const audioRef = useRef(null);

  // Voice Note states
  const voiceAudioRef = useRef(null);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);

  // Meditation Zone states
  const [breatheProgress, setBreatheProgress] = useState(0);
  const breatheTimerRef = useRef(null);

  // Proximity sound states
  const [isCloseToSecretPlant, setIsCloseToSecretPlant] = useState(false);

  // Dynamic sub-item content states
  const [subItemStates, setSubItemStates] = useState({
    cake: 'default',
    gift: 'default',
    frame: 'default',
    wishJar: 'default',
    coinFountain: 'default',
    jukebox: 'default',
    menuBoard: 'default',
    timeCapsule: 'default',
    secretPlant: 'default',
    meditationZone: 'default',
    photoTimeline: 'default',
  });

  // Wishes / manifestations state
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_wishes_user');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wishes", e);
      return [];
    }
  });

  // Keep localStorage in sync whenever wishes change
  useEffect(() => {
    try {
      localStorage.setItem('birthday_wishes_user', JSON.stringify(wishes));
    } catch (e) {
      console.error("Failed to save wishes", e);
    }
  }, [wishes]);


  // Clean up audio on unmount and clear timers
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (breatheTimerRef.current) {
        clearInterval(breatheTimerRef.current);
      }
    };
  }, []);

  // Breathing meditation loop controller (10-second inhale/hold/exhale cycle)
  const startBreathingMeditation = useCallback(() => {
    if (breatheTimerRef.current) clearInterval(breatheTimerRef.current);
    setBreatheProgress(0);
    setSubItemStates((prev) => ({ ...prev, meditationZone: 'breathe_inhale' }));

    let timeElapsed = 0;
    const interval = 100;
    const totalDuration = 10000;

    breatheTimerRef.current = setInterval(() => {
      timeElapsed += interval;
      const progress = Math.min(timeElapsed / totalDuration, 1.0);
      setBreatheProgress(progress);

      if (timeElapsed < 4000) {
        setSubItemStates((prev) => ({ ...prev, meditationZone: 'breathe_inhale' }));
      } else if (timeElapsed < 6000) {
        setSubItemStates((prev) => ({ ...prev, meditationZone: 'breathe_hold' }));
      } else if (timeElapsed < 10000) {
        setSubItemStates((prev) => ({ ...prev, meditationZone: 'breathe_exhale' }));
      } else {
        clearInterval(breatheTimerRef.current);
        breatheTimerRef.current = null;
        setSubItemStates((prev) => ({ ...prev, meditationZone: 'breathe_done' }));
        setBreatheProgress(0);
      }
    }, interval);
  }, []);

  // Proactive node reveal function
  const revealNode = useCallback((id) => {
    setRevealedNodes((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // 1. Visually check camera position to reveal nodes dynamically on exploration zoom/pan
  useFrame((state) => {
    const camPos = state.camera.position;

    const distToCapsule = camPos.distanceTo(new THREE.Vector3(5, -1.5, -4));
    const distToMenu = camPos.distanceTo(new THREE.Vector3(4, 0.2, 4.5));

    // If camera gets within a reasonable radius, reveal the elements!
    if (distToCapsule < 6.5) revealNode('timeCapsule');
    if (distToMenu < 6.5) revealNode('menuBoard');

    // ── Proximity Chime cue near secret plant corner ──
    const distToSecret = camPos.distanceTo(new THREE.Vector3(8.1, -1.2, -2.5));
    const isNearSecret = distToSecret < 5.8;
    if (isNearSecret && !isCloseToSecretPlant) {
      setIsCloseToSecretPlant(true);
      const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
      chime.volume = 0.4;
      chime.play().catch(() => { });
    } else if (!isNearSecret && isCloseToSecretPlant) {
      setIsCloseToSecretPlant(false);
    }
  });

  // Soundtrack audio trigger
  const playJukeboxTrack = useCallback((trackId) => {
    const tracks = {
      track1: song1,
      track2: song2,
      track3: song3,
    };

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    if (trackId === 'none') {
      audioRef.current.pause();
      setJukeboxTrack('none');
      setIsJukeboxPlaying(false);
      return;
    }

    const url = tracks[trackId];
    if (url) {
      audioRef.current.src = url;
      audioRef.current.play()
        .then(() => {
          setJukeboxTrack(trackId);
          setIsJukeboxPlaying(true);
        })
        .catch((err) => {
          console.log("Audio play blocked by browser:", err);
          // Still update state for visual effect
          setJukeboxTrack(trackId);
          setIsJukeboxPlaying(true);
        });
    }
  }, []);

  const toggleJukeboxPlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isJukeboxPlaying) {
      audioRef.current.pause();
      setIsJukeboxPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsJukeboxPlaying(true))
        .catch((err) => {
          console.log("Audio play blocked by browser:", err);
          setIsJukeboxPlaying(true);
        });
    }
  }, [isJukeboxPlaying]);

  // Handle click on sub-items or interactive overlays
  const handleSubItemClick = useCallback((nodeId, subItemId, payload) => {
    // ── Voice Note Audio Playback Control ──
    if (nodeId === 'cake') {
      if (subItemId === 'voice') {
        // Pause jukebox if playing
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsJukeboxPlaying(false);
        }
        // Play voice note
        if (!voiceAudioRef.current) {
          voiceAudioRef.current = new Audio(btsBirthdaySong);
          voiceAudioRef.current.addEventListener('timeupdate', () => {
            setVoiceCurrentTime(voiceAudioRef.current.currentTime);
          });
          voiceAudioRef.current.addEventListener('ended', () => {
            setVoiceCurrentTime(0);
            setSubItemStates((prev) => ({ ...prev, cake: 'default' }));
          });
        }
        voiceAudioRef.current.currentTime = 0;
        voiceAudioRef.current.play().catch((err) => {
          console.warn("Voice note audio playback blocked by browser:", err);
        });
      } else {
        // Stop/pause voice note if navigating away from voice page
        if (voiceAudioRef.current) {
          voiceAudioRef.current.pause();
          voiceAudioRef.current.currentTime = 0;
        }
        setVoiceCurrentTime(0);
      }
    }

    // ── Meditation Zone Breathing Trigger ──
    if (nodeId === 'meditationZone' && subItemId === 'start_breathe') {
      startBreathingMeditation();
      return;
    }

    // ── Fountain Coin Toss ──
    if (nodeId === 'coinFountain' && subItemId === 'toss') {
      setSubItemStates((prev) => ({ ...prev, coinFountain: 'tossing' }));
      setTossCount((prev) => prev + 1);

      // Transition to fortune output after coin toss animation finishes (1.2 seconds)
      setTimeout(() => {
        const fortunes = ['fortune1', 'fortune2', 'fortune3', 'fortune4'];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        setSubItemStates((prev) => ({ ...prev, coinFountain: randomFortune }));
      }, 1200);
      return;
    }

    // ── Café Menu Board Drink Ordering ──
    if (nodeId === 'menuBoard' && subItemId.startsWith('order_')) {
      const drinkType = subItemId.split('_')[1]; // e.g. 'matcha'
      setSubItemStates((prev) => ({
        ...prev,
        menuBoard: subItemId,
        cake: `brewed_${drinkType}`, // cross-node: update Tea Station (cake) to show brewed drink!
      }));
      return;
    }

    // ── Jukebox Soundtrack Controls ──
    if (nodeId === 'jukebox') {
      if (subItemId === 'toggle') {
        toggleJukeboxPlay();
        return;
      }
      if (subItemId.startsWith('play_')) {
        const trackId = subItemId.split('_')[1];
        playJukeboxTrack(trackId);
        return;
      }
      if (subItemId === 'stop') {
        playJukeboxTrack('none');
        return;
      }
    }

    // ── Wish Jar Custom Handlers ──
    if (nodeId === 'wishJar') {
      if (subItemId === 'add_wish' && payload) {
        const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#ffc6ff'];
        const newWish = {
          id: 'wish_' + Date.now(),
          text: payload.text,
          category: payload.category || 'Wish',
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        setWishes((prev) => [...prev, newWish]);

        // Play a chime/sparkle sound for visual gratification
        try {
          const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
          chime.volume = 0.4;
          chime.play().catch(() => { });
        } catch (e) {
          console.warn("Sound blocked or not loaded", e);
        }

        setSubItemStates((prev) => ({ ...prev, wishJar: 'default' }));
        return;
      }
      if (subItemId === 'delete_wish' && payload) {
        setWishes((prev) => prev.filter((w) => w.id !== payload.id));
        setSubItemStates((prev) => ({ ...prev, wishJar: 'default' }));
        return;
      }
    }

    setSubItemStates((prev) => ({
      ...prev,
      [nodeId]: subItemId,
    }));
  }, [toggleJukeboxPlay, playJukeboxTrack, startBreathingMeditation, setWishes]);

  // Generate localized text description dynamically based on state
  const getDynamicContent = useCallback((nodeId) => {
    const subId = subItemStates[nodeId] || 'default';

    if (nodeId === 'cake') {
      // Check if a drink has been ordered from the Menu Board
      if (subId === 'brewed_matcha') {
        return {
          title: '🍵 Sweet Birthday Matcha Ready',
          message: 'A freshly whisked cup of Sweet Birthday Matcha is sitting on your tray! Sip it virtually and click below to play a warm voice note.',
          showVoiceTrigger: true,
          showClearDrink: true,
        };
      }
      if (subId === 'brewed_latte') {
        return {
          title: '☕ Forever Young Latte Ready',
          message: 'A freshly brewed cup of Forever Young Latte is sitting on your tray! Sip it virtually and click below to play a warm voice note.',
          showVoiceTrigger: true,
          showClearDrink: true,
        };
      }
      if (subId === 'brewed_tea') {
        return {
          title: '🍵 Endless Joy Tea Ready',
          message: 'A freshly steeped cup of Endless Joy Tea is sitting on your tray! Sip it virtually and click below to play a warm voice note.',
          showVoiceTrigger: true,
          showClearDrink: true,
        };
      }
      if (subId === 'brewed_macchiato') {
        return {
          title: '🍮 Cozy Macchiato Ready',
          message: 'A freshly brewed cup of Cozy Hug Macchiato is sitting on your tray! Sip it virtually and click below to play a warm voice note.',
          showVoiceTrigger: true,
          showClearDrink: true,
        };
      }

      if (subId === 'voice') {
        const mins = Math.floor(voiceCurrentTime / 60);
        const secs = Math.floor(voiceCurrentTime % 60);
        const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        return {
          title: '🎙️ BTS Birthday Greeting (Voice Note)',
          message: '“Happy Birthday! Hope you enjoy this song na nakuha ko sa yt from BTS singing happy birthday to you!”',
          isVoicePlay: true,
          voiceTime: formattedTime,
        };
      }
      return {
        title: '🍵 Tea Station & Warm Wishes',
        message: 'Welcome to the cozy tea corner. Take a slow breath, sip some virtual warm coffee, and click the button below to play a sweet birthday voice note!',
        showVoiceTrigger: true,
      };
    }

    if (nodeId === 'gift') {
      if (subId === 'card') {
        return {
          title: '💌 Cozy Card Letter',
          message: '“Happy Birthday! Thank you for being such an inspiring, kind, and wonderful person. Congrats nasa dean\'s list ka nanaman! 🎉”',
          showBackButton: true,
        };
      }
      if (subId === 'plant') {
        return {
          title: '🌱 Growing Into Your Best Self',
          message: 'Like this little plant, you keep growing and blossoming every single day. Your strength, kindness, and beautiful spirit continue to flourish. Here\'s to a year of endless growth, new beginnings, and becoming even more amazing than you already are!',
          showBackButton: true,
        };
      }
      if (subId === 'present') {
        return {
          title: '🎁 A Gift Celebrating You',
          message: 'You opened the gift! Inside is a reminder of all the beautiful moments you\'ve created, the joy you\'ve brought to those around you, and the amazing person you are. Click other items on the shelf (the card or plant) to explore more about what makes you truly special!',
          showBackButton: true,
        };
      }
      return {
        title: '🎁 Gift Shelf & Display',
        message: 'Instead of a simple red box, here is an artful display of gifts. Click on the items themselves (the plant, the birthday card, or the red package) to interact with them!',
        showBackButton: false,
      };
    }

    if (nodeId === 'frame') {
      if (subId === 'photo1') {
        return {
          title: 'Mga gwapong lalaki',
          message: 'Hindi ko talaga ito mga kilala HAHAHAHA. Nanghula nalang ako kung sino mga bias mo.',
          showPhotoNav: true,
          activeSlide: 1,
        };
      }
      if (subId === 'photo2') {
        return {
          title: 'Edited idols',
          message: 'Basta ang lumalabas lang sa feed ko tuwing mag sha-share ka ay sila jeo ong at seventeen kaya bawal sila mawala HAHAHA',
          showPhotoNav: true,
          activeSlide: 2,
        };
      }
      return {
        title: '🖼️ Memory Photo Shrine',
        message: 'A curated gallery of birthday memories and snapshots. Click on the hanging Polaroid photos on either side of the main frame to inspect each memory!',
        showPhotoNav: true,
        activeSlide: 0,
      };
    }

    if (nodeId === 'wishJar') {
      if (subId === 'write') {
        return {
          title: '✍️ Write a Wish / Manifestation',
          message: 'Fold your thoughts into a paper star. Select a category below, type your heart\'s desire, and cast it into the jar!',
          showWishForm: true,
          wishes: wishes,
        };
      }
      if (subId.startsWith('view_')) {
        const wishId = subId.replace('view_', '');
        const wish = wishes.find((w) => w.id === wishId);
        if (wish) {
          return {
            title: wish.category === 'Manifestation' ? '✨ My Manifestation' : '🌟 My Birthday Wish',
            message: wish.text,
            showWishDetail: true,
            activeWish: wish,
          };
        }
      }
      return {
        title: '✨ Birthday Wish Jar',
        message: 'A soft-glowing jar nestled in the corner. Inside are folded paper stars containing your personal wishes and manifestations.',
        showWishes: true,
        wishes: wishes,
      };
    }

    if (nodeId === 'coinFountain') {
      if (subId === 'tossing') {
        return {
          title: '🪙 Casting Wish...',
          message: 'The gold coin is spinning through the air, heading towards the water basin...',
          isTossing: true,
        };
      }
      if (subId === 'fortune1') {
        return {
          title: '🍀 Blossom Fortune',
          message: 'Your coin landed perfectly! Fortune: “A beautiful rain of cherry blossoms and a year of new, exciting paths await you. Keep walking forward!”',
          showCoinToss: true,
        };
      }
      if (subId === 'fortune2') {
        return {
          title: '☀️ Sunshine Fortune',
          message: 'Your coin landed perfectly! Fortune: “Like warm morning sunshine, your days will be bright and filled with comforting warm drinks and smiles. Enjoy!”',
          showCoinToss: true,
        };
      }
      if (subId === 'fortune3') {
        return {
          title: '🌾 Harmony Fortune',
          message: 'Your coin landed with a soft splash! Fortune: “A year of peaceful steps and beautiful growth is coming. May you grow steadily like a small succulent!”',
          showCoinToss: true,
        };
      }
      if (subId === 'fortune4') {
        return {
          title: '💫 Sparkle Fortune',
          message: 'Your coin landed with a splash! Fortune: “Unexpected joy and sparkling laughter are headed your way. Get ready for sweet surprises!”',
          showCoinToss: true,
        };
      }
      return {
        title: '⛲ Lucky Coin Fountain',
        message: 'Throw a virtual coin into the traditional stone fountain, make a wish, and see what the year holds for you!',
        showCoinToss: true,
      };
    }

    if (nodeId === 'jukebox') {
      return {
        title: '📻 Soundtrack Jukebox',
        message: 'Select a cozy soundtrack to play in the background. The visualizer on the radio cabinet will bounce along to the music!',
        showTracks: true,
        activeTrack: jukeboxTrack,
        isPlaying: isJukeboxPlaying,
      };
    }

    if (nodeId === 'menuBoard') {
      if (subId === 'order_latte') {
        return {
          title: '☕ Forever Young Latte',
          message: 'Brewing espresso, infusing double shots of eternal youth and chocolate curls... Your drink is ready and waiting at the Tea Station! ☕',
          showBackButton: true,
        };
      }
      if (subId === 'order_matcha') {
        return {
          title: '🍵 Sweet Birthday Matcha',
          message: 'Whisking fine stone-ground matcha powder with warm milk and endless wishes... Your drink is ready and waiting at the Tea Station! 🍵',
          showBackButton: true,
        };
      }
      if (subId === 'order_macchiato') {
        return {
          title: '🍮 Cozy Macchiato',
          message: 'Steaming caramel drizzle, warm joy, and soft blanket essence... Your drink is ready and waiting at the Tea Station! 🍮',
          showBackButton: true,
        };
      }
      if (subId === 'order_tea') {
        return {
          title: '🍵 Endless Joy Tea',
          message: 'Steeping fresh green tea leaves with sweet cherry blossom petals... Your drink is ready and waiting at the Tea Station! 🍵',
          showBackButton: true,
        };
      }
      return {
        title: '📋 Chalkboard Menu Board',
        message: 'Hidden off to the side, this blackboard details the cafe Specials. Select a drink below, and watch it brew at the Tea Station!',
        showMenuOptions: true,
      };
    }

    if (nodeId === 'timeCapsule') {
      if (subId === 'open') {
        const targetDate = new Date('2027-05-12T00:00:00');
        const now = new Date();
        if (now >= targetDate) {
          return {
            title: '💌 Message from May 12, 2027',
            message: 'Alam ko inadjust mo date HAHAHAHAH',
            showBackButton: true,
          };
        } else {
          const diffMs = targetDate - now;
          const totalSecs = Math.floor(diffMs / 1000);
          const hours = Math.floor(totalSecs / 3600);
          const seconds = totalSecs % 60;
          return {
            title: '⏳ Capsule Locked',
            message: `⏳ Time remaining: ${hours} hours and ${seconds} seconds.`,
            showBackButton: true,
          };
        }
      }
      if (subId === 'add_note') {
        return {
          title: '✍️ Write a Wish for 2031',
          message: 'Write down a personal goal or wish for the next 5 years. It will be sealed inside this capsule!',
          showCapsuleForm: true,
        };
      }
      if (subId === 'note_sealed') {
        return {
          title: '🔒 Capsule Sealed!',
          message: 'Your wish has been folded and sealed inside the capsule. We will open it again in 2031! Happy Birthday once again.',
          showBackButton: true,
        };
      }
      return {
        title: '⏳ Birthday Time Capsule',
        message: 'Buried in the corner of the floor, you found a sealed birthday capsule. What letters are stored inside?',
        showOpenCapsule: true,
      };
    }

    if (nodeId === 'secretPlant') {
      return {
        title: '🌿 Secret Succulent Corner',
        message: '"Hindi ko sure kung mahahanap mo ito. Parang sulat lang sa ilalim ng ref sa movie ng house of us eh no? HAHAHAHA. Reminder that you don\'t need spotlight to grow beautifully. Your strength blooms in quiet moments, your beauty shines brightest when you\'re true to yourself. Keep growing, keep blooming, keep being wonderful."',
      };
    }

    if (nodeId === 'meditationZone') {
      if (subId === 'breathe_inhale') {
        return {
          title: '🧘 Tea Meditation — Inhale',
          message: 'Breathe in slowly and deeply... Feel the calming warmth of barley tea filling you.',
          showMeditationProgress: true,
          breathePhase: 'inhale',
          breatheProgress,
        };
      }
      if (subId === 'breathe_hold') {
        return {
          title: '🧘 Tea Meditation — Hold',
          message: 'Hold that breath gently... Let the inner quiet settle.',
          showMeditationProgress: true,
          breathePhase: 'hold',
          breatheProgress,
        };
      }
      if (subId === 'breathe_exhale') {
        return {
          title: '🧘 Tea Meditation — Exhale',
          message: 'Breathe out slowly... Release all lingering tension and worries.',
          showMeditationProgress: true,
          breathePhase: 'exhale',
          breatheProgress,
        };
      }
      if (subId === 'breathe_done') {
        return {
          title: '✨ Calmed & Centered',
          message: 'You have completed the brief café meditation. Enjoy the rest of your special day!',
          showBackButton: true,
        };
      }
      return {
        title: '🍵 Tea Meditation Zone',
        message: 'Take a quiet moment. Sit on the traditional floor cushion, watch the steam rise, and practice a 10-second deep breathing sequence.',
        showMeditationControls: true,
      };
    }

    if (nodeId === 'photoTimeline') {
      if (subId === 'timeline_childhood') {
        return {
          title: '👶 1. Childhood (Age 5)',
          message: '“A sunny yard filled with yellow balloons and pure laughter. The beginning of a wonderful journey.”',
          showTimelineNav: true,
          activeSlide: 1,
        };
      }
      if (subId === 'timeline_teenage') {
        return {
          title: '🎒 2. Teenage Years (Age 16)',
          message: '“Pursuing dreams under blue skies, studying hard, and laughing with lifelong friends.”',
          showTimelineNav: true,
          activeSlide: 2,
        };
      }
      if (subId === 'timeline_present') {
        return {
          title: '✨ 3. Present Day',
          message: '“Grounded, wise, and celebrating another beautiful year surrounded by love. Happy Birthday!”',
          showTimelineNav: true,
          activeSlide: 3,
        };
      }
      return {
        title: '🎞️ Photo Timeline Scroll',
        message: 'A wood panel containing photo memories from childhood to present. Click the timeline frames to see each milestone!',
        showTimelineNav: true,
        activeSlide: 0,
      };
    }

    return { title: '', message: '' };
  }, [subItemStates, jukeboxTrack, isJukeboxPlaying, breatheProgress, wishes, capsuleTicker, voiceCurrentTime]);

  /** Toggle selection: click once to select, again to deselect. */
  const handleNodeSelect = useCallback((id) => {
    setIsCameraSettled(false);  // reset — card hides immediately
    setActiveNodeId((prev) => (prev === id ? null : id));
    setSubItemStates((prev) => ({ ...prev, [id]: 'default' }));

    // Stop voice note if any node selection changes
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    setVoiceCurrentTime(0);

    if (breatheTimerRef.current) {
      clearInterval(breatheTimerRef.current);
      breatheTimerRef.current = null;
      setBreatheProgress(0);
    }

    setVisitedNodes((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);

      // Area reveal triggers:
      if (id === 'cake') {
        revealNode('menuBoard');
      }
      if (next.size >= 2) {
        revealNode('timeCapsule');
      }
      // Unlock/reveal the photo timeline once user has visited 4 nodes (fully explored the cafe)
      if (next.size >= 4) {
        revealNode('photoTimeline');
      }

      return next;
    });
  }, [revealNode]);

  /** Close button or click empty space → deselect + hide card. */
  const handleClose = useCallback(() => {
    setIsCameraSettled(false);
    setActiveNodeId(null);
    if (breatheTimerRef.current) {
      clearInterval(breatheTimerRef.current);
      breatheTimerRef.current = null;
      setBreatheProgress(0);
    }
    // Stop voice note
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    setVoiceCurrentTime(0);
  }, []);

  /** Called by CameraRig when the spring comes to rest. */
  const handleCameraRest = useCallback(() => {
    setIsCameraSettled(true);
  }, []);

  return (
    <>
      {/* ====== Background & Fog ====== */}
      <fog attach="fog" args={['#e8dcc8', 16, 38]} />

      {/* ====== Camera Rig (controls + animation) ====== */}
      <CameraRig
        activeNodeId={activeNodeId}
        nodes={SHAPES}
        onRest={handleCameraRest}
      />

      {/* ====== Lighting ====== */}
      <ambientLight intensity={AMBIENT.intensity} color={AMBIENT.color} />
      <directionalLight
        position={DIRECTIONAL.position}
        intensity={DIRECTIONAL.intensity}
        color={DIRECTIONAL.color}
        castShadow
        shadow-mapSize={[DIRECTIONAL.shadowMapSize, DIRECTIONAL.shadowMapSize]}
        shadow-bias={-0.0001}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <spotLight
        position={SPOTLIGHT.position}
        intensity={SPOTLIGHT.intensity}
        color={SPOTLIGHT.color}
        angle={SPOTLIGHT.angle}
        penumbra={SPOTLIGHT.penumbra}
        castShadow
        shadow-mapSize={[SPOTLIGHT.shadowMapSize, SPOTLIGHT.shadowMapSize]}
        shadow-bias={-0.0002}
      />
      <pointLight
        position={POINT_LIGHT.position}
        intensity={POINT_LIGHT.intensity}
        color={POINT_LIGHT.color}
        distance={POINT_LIGHT.distance}
      />

      {/* ====== Atmosphere (particles, lanterns, rolling mist, floating elements) ====== */}
      <Atmosphere activeNodeId={activeNodeId} />

      {/* ====== Cafe Interior ====== */}
      <CafeInterior />

      {/* ====== Wall Decorations (banners, shelves, garlands, lanterns) ====== */}
      <WallDecorations />

      {/* ====== Floor ====== */}
      <KoreanFloor />

      {/* ====== Clickable background (deselects active waypoint) ====== */}
      <mesh
        position={[0, 0, 0]}
        visible={false}
        onClick={handleClose}
      >
        <sphereGeometry args={[50, 8, 8]} />
        <meshBasicMaterial side={2} />
      </mesh>

      {/* ====== Waypoints ====== */}
      {SHAPES.map((shape) => {
        // Map shape ID to the correct model component with custom state overrides
        let model;
        switch (shape.id) {
          case 'cake':
            model = <CakeModel brewedDrink={subItemStates.cake} />;
            break;
          case 'gift':
            model = <GiftModel onSubItemClick={(subId) => handleSubItemClick('gift', subId)} />;
            break;
          case 'frame':
            model = <FrameModel onSubItemClick={(subId) => handleSubItemClick('frame', subId)} />;
            break;
          case 'wishJar':
            model = <WishJarModel wishes={wishes} />;
            break;
          case 'coinFountain':
            model = <CoinFountainModel tossCount={tossCount} />;
            break;
          case 'jukebox':
            model = <JukeboxModel isPlaying={isJukeboxPlaying} />;
            break;
          case 'menuBoard':
            model = <MenuBoardModel />;
            break;
          case 'timeCapsule':
            model = <TimeCapsuleModel />;
            break;
          case 'secretPlant':
            model = <SecretPlantModel isClose={isCloseToSecretPlant} />;
            break;
          case 'meditationZone':
            model = (
              <MeditationZoneModel
                breathePhase={
                  subItemStates.meditationZone.startsWith('breathe_')
                    ? subItemStates.meditationZone.split('_')[1]
                    : 'idle'
                }
                breatheProgress={breatheProgress}
              />
            );
            break;
          case 'photoTimeline':
            model = (
              <PhotoTimelineModel
                activeTimelineSlide={
                  subItemStates.photoTimeline.startsWith('timeline_')
                    ? subItemStates.photoTimeline === 'timeline_childhood'
                      ? 1
                      : subItemStates.photoTimeline === 'timeline_teenage'
                        ? 2
                        : 3
                    : 0
                }
                isUnlocked={true}
              />
            );
            break;
          default:
            model = null;
        }

        return (
          <Waypoint
            key={shape.id}
            {...shape}
            modelElement={model}
            revealed={revealedNodes.has(shape.id)}
            content={getDynamicContent(shape.id)}
            isActive={activeNodeId === shape.id}
            cameraSettled={isCameraSettled}
            onSelect={handleNodeSelect}
            onClose={handleClose}
            onSubItemClick={(subId) => handleSubItemClick(shape.id, subId)}
          />
        );
      })}
    </>
  );
}

