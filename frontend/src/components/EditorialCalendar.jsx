import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { BentoItem } from '../layouts/BentoLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wand2, Loader2, X, Eye } from 'lucide-react';
import api from '../api';
import { useAgencyStore } from '../store/agencyStore';
import MockupPreviewModal from './MockupPreviewModal';

const EditorialCalendar = forwardRef((props, ref) => {
    const { brandDNA } = useAgencyStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState({}); // Keyed by day number (string)
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showMockup, setShowMockup] = useState(false);

    // Reset calendar when client changes
    useEffect(() => {
        setPosts({});
        setSelectedPost(null);
    }, [brandDNA]);

    useImperativeHandle(ref, () => ({
        generate: () => {
            handleAutoFill();
        }
    }));

    const handleAutoFill = async () => {
        if (!brandDNA.purpose) return;
        setLoading(true);
        try {
            const response = await api.post('/posts/generate-batch', {
                brand_context: brandDNA.purpose,
                mode: brandDNA.tone || 'Standard'
            });

            // Map array to object keyed by day
            const newPosts = {};
            response.data.forEach(post => {
                const dayKey = String(post.day);
                if (!newPosts[dayKey]) newPosts[dayKey] = [];
                newPosts[dayKey].push(post);
            });
            setPosts(newPosts);
        } catch (error) {
            console.error("Failed to generate posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'posted': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'scheduled': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default: return 'bg-white/10 text-white/50 border-white/10';
        }
    };

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon size={20} className="text-pink-400" />
                    Editorial Calendar
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleAutoFill}
                        disabled={loading || !brandDNA.purpose}
                        className="text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 px-3 py-1 rounded border border-pink-500/30 flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        Auto-Fill
                    </button>
                    <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-mono w-24 text-center">{monthName} {year}</span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="h-[300px] flex flex-col relative">
                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2 text-center text-xs opacity-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                {/* Days Cells */}
                <div className="grid grid-cols-7 grid-rows-5 gap-1 flex-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-transparent" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dayPosts = posts[String(dayNum)] || [];
                        const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                        return (
                            <div
                                key={dayNum}
                                className={`bg-white/5 border border-white/5 rounded p-1 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group ${isToday ? 'ring-1 ring-pink-500' : ''}`}
                            >
                                <span className={`text-[10px] absolute top-1 right-1 opacity-50 ${isToday ? 'text-pink-500 font-bold opacity-100' : ''}`}>
                                    {dayNum}
                                </span>

                                <div className="mt-4 space-y-1">
                                    {dayPosts.map((post, k) => (
                                        <div
                                            key={k}
                                            onClick={() => setSelectedPost(post)}
                                            className={`text-[8px] px-1 py-0.5 rounded border truncate cursor-pointer hover:opacity-80 ${getStatusColor(post.status)}`}
                                            title={post.title}
                                        >
                                            {post.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Post Detail Modal Overlay */}
                {selectedPost && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center p-4 rounded-xl">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 w-full max-w-sm shadow-2xl relative">
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full"
                            >
                                <X size={16} />
                            </button>

                            <div className="mb-4">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getStatusColor(selectedPost.status)}`}>
                                    {selectedPost.type} • {selectedPost.platform}
                                </span>
                                <h4 className="text-lg font-bold mt-2">{selectedPost.title}</h4>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white/5 p-3 rounded text-sm whitespace-pre-wrap font-light opacity-90 h-32 overflow-y-auto">
                                    {selectedPost.content}
                                </div>
                                <div className="text-xs text-blue-300 font-mono">
                                    {selectedPost.hashtags}
                                </div>

                                <button
                                    onClick={() => setShowMockup(true)}
                                    className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all mt-4"
                                >
                                    <Eye size={14} />
                                    Live Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showMockup && (
                    <MockupPreviewModal
                        post={selectedPost}
                        onClose={() => setShowMockup(false)}
                    />
                )}
            </div>
        </BentoItem>
    );
});

export default EditorialCalendar;

