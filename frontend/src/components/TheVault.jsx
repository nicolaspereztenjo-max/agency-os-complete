import { useState } from 'react';
import { BentoItem } from '../layouts/BentoLayout';
import { Archive, Download, Filter, Image, Video, FileText, MoreHorizontal } from 'lucide-react';
import { useAgencyStore } from '../store/agencyStore';

export default function TheVault() {
    const { brandDNA } = useAgencyStore();
    const [filter, setFilter] = useState('all');

    // Mock Assets based on active brand context
    const assets = [
        { id: 1, type: 'image', name: 'Methodology_Hero_v2.jpg', date: '2 hrs ago', size: '2.4 MB' },
        { id: 2, type: 'image', name: 'Social_Carousel_01.png', date: '4 hrs ago', size: '1.8 MB' },
        { id: 3, type: 'video', name: 'Launch_Teaser_Final.mp4', date: '1 day ago', size: '45.2 MB' },
        { id: 4, type: 'doc', name: 'Strategy_Q3_Brief.pdf', date: '2 days ago', size: '850 KB' },
        { id: 5, type: 'image', name: 'Instagram_Story_Mock.jpg', date: '2 days ago', size: '1.2 MB' },
        { id: 6, type: 'video', name: 'Behind_Scenes_Raw.mp4', date: '3 days ago', size: '128 MB' },
    ];

    const filteredAssets = filter === 'all' ? assets : assets.filter(a =>
        filter === 'image' ? a.type === 'image' :
            filter === 'video' ? a.type === 'video' :
                a.type === 'doc'
    );

    const getIcon = (type) => {
        switch (type) {
            case 'image': return <Image size={16} className="text-pink-400" />;
            case 'video': return <Video size={16} className="text-blue-400" />;
            case 'doc': return <FileText size={16} className="text-emerald-400" />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2">
            <div className="flex flex-col h-full bg-[#0a0a0a]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Archive size={20} className="text-purple-500" />
                            The Vault
                        </h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Asset Management System</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 transition-colors">
                            <Filter size={16} />
                        </button>
                        <button className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                            <Download size={14} /> Download All
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                    {['all', 'image', 'video', 'doc'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${filter === f
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {f}s
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredAssets.map(asset => (
                            <div key={asset.id} className="group bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-3 transition-all hover:bg-white/[0.04] cursor-pointer relative">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        {getIcon(asset.type)}
                                    </div>
                                    <button className="text-white/20 hover:text-white transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-white/90 truncate">{asset.name}</h4>
                                    <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                                        <span>{asset.size}</span>
                                        <span>{asset.date}</span>
                                    </div>
                                </div>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                                    <Download size={20} className="text-white drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BentoItem>
    );
}
