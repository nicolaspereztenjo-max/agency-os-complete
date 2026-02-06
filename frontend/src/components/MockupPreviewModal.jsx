import { X, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useAgencyStore } from '../store/agencyStore';

export default function MockupPreviewModal({ post, onClose }) {
    const { brandDNA } = useAgencyStore();

    if (!post) return null;

    const isInstagram = post.platform === 'instagram';
    const isLinkedIn = post.platform === 'linkedin';

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 md:top-4 md:right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
                >
                    <X size={20} className="text-white" />
                </button>

                {/* Left: Image Area */}
                <div className="aspect-square bg-black flex items-center justify-center relative group">
                    <img
                        src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop`}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-[10px] text-white/60 uppercase tracking-widest font-mono">Generated Asset Preview</span>
                    </div>
                </div>

                {/* Right: Social Shell */}
                <div className="flex flex-col h-full bg-[#121212] border-l border-white/5">
                    {/* Shell Top: User Info */}
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-inner"
                            style={{ backgroundColor: brandDNA.primaryColor || '#ec4899' }}
                        >
                            {brandDNA.logo ? (
                                <img src={brandDNA.logo} alt="Logo" className="w-6 h-6 object-contain" />
                            ) : (
                                <span className="text-xs font-bold text-white">{brandDNA.name?.charAt(0) || 'A'}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">{brandDNA.name || 'Your Agency'}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-tighter">Sponsored • {post.platform}</p>
                        </div>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        <div className="space-y-2">
                            <p className="text-sm text-white/90 leading-relaxed font-light">
                                {post.content}
                            </p>
                            <p className="text-sm text-blue-400 font-mono">
                                {post.hashtags}
                            </p>
                        </div>
                    </div>

                    {/* Shell Bottom: Interactions */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-4">
                                <Heart size={22} className="text-white/40 hover:text-pink-500 cursor-pointer transition-colors" />
                                <MessageCircle size={22} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                                <Send size={22} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <Bookmark size={22} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-white">4,231 likes</p>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.1em]">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
