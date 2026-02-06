import { useState, useRef, useEffect } from 'react';
import { BentoItem } from '../layouts/BentoLayout';
import { Play, Pause, Video, Mic2, Loader2, Music, Film, Edit3, Settings2 } from 'lucide-react';
import api from '../api';

const VOICES = [
    { id: 'alloy', name: 'Professional (Alloy)', tone: 'Balanced' },
    { id: 'nova', name: 'Enthusiastic (Nova)', tone: 'High Energy' },
    { id: 'shimmer', name: 'Minimalist (Shimmer)', tone: 'Soft' },
    { id: 'onyx', name: 'Deep (Onyx)', tone: 'Authority' },
];

export default function VideoStudio({ campaignResult }) {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('alloy');

    const defaultScript = campaignResult?.strategy_reasoning
        ? `Transform your brand with us. ${campaignResult.strategy_reasoning}. Link in bio.`
        : "Discover the future of your brand. Innovative designs, powerful strategies. Link in bio.";

    const [editableScript, setEditableScript] = useState(defaultScript);

    const audioRef = useRef(null);
    const images = campaignResult?.assets?.map(a => a.url) || [];

    // Sync editable script when campaign changes
    useEffect(() => {
        setEditableScript(defaultScript);
        setAudioUrl(null); // Reset audio when campaign changes
    }, [campaignResult, defaultScript]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 3000); // Change image every 3 seconds
            return () => clearInterval(interval);
        }
    }, [isPlaying, images.length]);

    const handleGenerateAudio = async () => {
        setLoadingAudio(true);
        try {
            const res = await api.post('/api/v1/audio/generate', {
                text: editableScript,
                voice: selectedVoice
            });
            const fullUrl = `http://localhost:8000${res.data.url}`;
            setAudioUrl(fullUrl);
        } catch (error) {
            console.error("Audio gen failed", error);
        } finally {
            setLoadingAudio(false);
        }
    };

    const togglePlay = () => {
        if (!audioUrl && !isPlaying) {
            handleGenerateAudio();
            return;
        }

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (audioUrl && !isPlaying) {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    }, [audioUrl]);

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setCurrentImageIndex(0);
    };

    if (!images.length) {
        return (
            <BentoItem span="col-span-1 md:col-span-1 row-span-1 border-dashed border-2 bg-transparent opacity-50 flex items-center justify-center">
                <div className="text-center text-white/30">
                    <Film size={24} className="mx-auto mb-2" />
                    <p className="text-xs">Generate Strategy First</p>
                </div>
            </BentoItem>
        );
    }

    return (
        <BentoItem span="col-span-1 md:col-span-1 row-span-2" className="bg-gray-900 text-white overflow-hidden">
            <div className="h-full flex flex-col p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Video size={18} className="text-pink-500" />
                        Video Studio
                    </h3>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-1.5 rounded transition-colors ${isEditing ? 'bg-pink-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                            title="Edit Script"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={handleGenerateAudio}
                            disabled={loadingAudio}
                            className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
                            title="Generate AI Voiceover"
                        >
                            {loadingAudio ? <Loader2 size={14} className="animate-spin" /> : <Mic2 size={14} />}
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex-1 flex flex-col gap-3 animate-in fade-in duration-300">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-1">
                                <Settings2 size={10} /> Voice Personality
                            </label>
                            <select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs focus:ring-1 ring-pink-500 outline-none"
                            >
                                {VOICES.map(v => (
                                    <option key={v.id} value={v.id} className="bg-gray-900">{v.name} — {v.tone}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <label className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Narration Script</label>
                            <textarea
                                value={editableScript}
                                onChange={(e) => setEditableScript(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs font-light leading-relaxed resize-none focus:ring-1 ring-pink-500 outline-none custom-scrollbar"
                                placeholder="Write the video narration..."
                            />
                        </div>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition-all"
                        >
                            Done Editing
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Preview Window (Vertical 9:16 approx) */}
                        <div className="flex-1 bg-black rounded-lg overflow-hidden relative group border border-white/5 mx-auto w-full max-w-[200px] aspect-[9/16] shadow-2xl">
                            {/* Active Image */}
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                                        }`}
                                    style={{ transitionDuration: '3000ms' }} // Smooth ken burns
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                            ))}

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-end p-4 pointer-events-none">
                                <p className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-md kinetic-in">
                                    {campaignResult?.brand_context || "Your Brand"}
                                </p>
                                <div className="bg-pink-500 text-white text-xs font-bold py-2 rounded-full w-full mb-8 shadow-lg text-center animate-pulse">
                                    Shop Now
                                </div>
                            </div>

                            {/* Play Controls Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={togglePlay}
                                    className="bg-white/20 backdrop-blur rounded-full p-4 hover:bg-white/30 transition-all transform hover:scale-110"
                                >
                                    {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                                </button>
                            </div>
                        </div>

                        {/* Timeline / Progress */}
                        <div className="mt-3 bg-white/5 rounded p-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-pink-500 transition-all duration-300 ${isPlaying ? 'animate-progress' : ''}`}
                                    style={{ width: isPlaying ? '100%' : '0%', transitionDuration: isPlaying ? '15s' : '0s' }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-mono text-white/50">0:15s</span>
                        </div>
                    </div>
                )}

                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={handleAudioEnded}
                    className="hidden"
                />
            </div>
        </BentoItem>
    );
}

