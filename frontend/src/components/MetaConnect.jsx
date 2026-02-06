import { useState } from 'react';
import api from '../api';
import { BentoItem } from '../layouts/BentoLayout';
import { Facebook, Loader2, TrendingUp, Users, MousePointerClick } from 'lucide-react';

export default function MetaConnect() {
    const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected
    const [data, setData] = useState(null);

    const handleConnect = async () => {
        setStatus('connecting');
        try {
            // 1. Simulate Auth
            const authRes = await api.post('/api/v1/meta/connect');
            const { account_id } = authRes.data;

            // 2. Fetch Stats
            const statsRes = await api.get('/api/v1/meta/stats', {
                params: { account_id }
            });

            setData(statsRes.data);
            setStatus('connected');
        } catch (error) {
            console.error("Meta connection failed:", error);
            setStatus('disconnected');
        }
    };

    if (status === 'disconnected' || status === 'connecting') {
        return (
            <BentoItem span="col-span-1 md:col-span-2">
                <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-4">
                    <div className="bg-[#1877F2]/20 p-4 rounded-full">
                        <Facebook size={32} className="text-[#1877F2]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Connect Ad Account</h3>
                        <p className="text-sm opacity-60 max-w-xs mx-auto mt-2">
                            Grant permission to analyze campaign performance and generate positioning strategies.
                        </p>
                    </div>
                    <button
                        onClick={handleConnect}
                        disabled={status === 'connecting'}
                        className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 transform active:scale-95"
                    >
                        {status === 'connecting' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Connecting...
                            </>
                        ) : (
                            "Connect with Meta"
                        )}
                    </button>
                </div>
            </BentoItem>
        );
    }

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <Facebook className="text-[#1877F2]" size={24} />
                    <div>
                        <h3 className="font-bold text-lg">Meta Ads Manager</h3>
                        <span className="text-xs opacity-50 block">Last 30 Days • {data.account_id}</span>
                    </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs font-bold border border-emerald-500/20">
                    ACTIVE
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-white/5 p-3 rounded border border-white/5 text-center">
                    <span className="text-xs opacity-50 block mb-1">SPEND</span>
                    <span className="font-mono font-bold text-lg">{data.spend}</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5 text-center">
                    <span className="text-xs opacity-50 block mb-1 flex justify-center gap-1"><MousePointerClick size={12} /> CTR</span>
                    <span className="font-mono font-bold text-lg text-blue-300">{data.ctr}</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5 text-center">
                    <span className="text-xs opacity-50 block mb-1 flex justify-center gap-1"><Users size={12} /> REACH</span>
                    <span className="font-mono font-bold text-lg">{data.impressions}</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-4 rounded-xl border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2 text-indigo-300">
                    <TrendingUp size={16} />
                    <span className="text-xs font-bold tracking-wider uppercase">Strategic Pivot</span>
                </div>
                <p className="text-sm font-light leading-relaxed mb-3 opacity-90">
                    {data.ai_positioning.strategy}
                </p>
                <div className="flex gap-2 text-xs">
                    <span className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-300 border border-indigo-500/20">
                        Focus: {data.ai_positioning.focus_area}
                    </span>
                </div>
            </div>
        </BentoItem>
    );
}
