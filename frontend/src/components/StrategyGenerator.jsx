import { useState, useRef, useEffect } from 'react';
import { BentoItem } from '../layouts/BentoLayout';
import { strategyService } from '../services/strategyService';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Wand2, Send, TrendingUp, ChevronRight, MessageSquare, Download, RefreshCw } from 'lucide-react';

export default function StrategyGenerator({ brandContext, brandDNA, onGenerate }) {
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState(null);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [investment, setInvestment] = useState(5000);
    const chatEndRef = useRef(null);

    // Reset strategy when client context changes
    useEffect(() => {
        setStrategy(null);
    }, [brandContext, brandDNA]);

    const scaledROISeries = strategy?.roi_series?.map(item => {
        const baseSpend = strategy.roi_series[0].spend || 1;
        const multiplier = investment / baseSpend;
        return {
            ...item,
            revenue: item.revenue * multiplier,
            spend: item.spend * multiplier
        };
    }) || [];

    const handleGenerate = async (refiningFeedback = null) => {
        if (!brandContext) return;

        if (refiningFeedback) setIsRefining(true);
        else setLoading(true);

        setError(null);
        try {
            const result = await strategyService.generateStrategy(brandContext, brandDNA, refiningFeedback);
            setStrategy(result);
            if (refiningFeedback) setFeedback('');
            if (onGenerate) onGenerate(result);
        } catch (err) {
            setError('Failed to generate strategy. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
            setIsRefining(false);
        }
    };

    const handleExport = async () => {
        if (!strategy) return;
        try {
            await strategyService.exportPDF(strategy);
        } catch (err) {
            console.error(err);
            setError('Failed to download PDF.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && feedback.trim()) {
            e.preventDefault();
            handleGenerate(feedback);
        }
    };

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2" className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                            <Wand2 size={16} className="text-pink-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">AI Creative Director</h3>
                    </div>
                    {strategy && (
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${strategy.selected_style === 'cyberpunk' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                strategy.selected_style === 'minimalist' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                }`}>
                                {strategy.selected_style}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {!strategy ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl group">
                            {loading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-pink-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin"></div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-1">Synthesizing DNA</p>
                                        <p className="text-xs text-white/40">Aligning creative clusters for "{brandContext}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center group-hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-pink-500/50 transition-colors">
                                        <MessageSquare size={24} className="text-white/20 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                    <p className="text-sm text-white/40 font-light">Enter brand purpose above to begin</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                            {/* Strategy Reasoning */}
                            <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrendingUp size={16} className="text-pink-500/30" />
                                </div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-pink-500/70 mb-4 flex items-center gap-2">
                                    <TrendingUp size={12} /> Strategic Rationale
                                </h4>
                                <p className="text-sm text-white/80 leading-relaxed font-light mb-6 italic">
                                    "{strategy.strategy_reasoning}"
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-white/40 uppercase mb-1">Projected Lift</p>
                                        <p className="text-2xl font-display font-bold text-white">{strategy.financial_projection?.lift || "+15%"}</p>
                                    </div>
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-white/40 uppercase mb-1">Confidence Score</p>
                                        <p className="text-2xl font-display font-bold text-white">92%</p>
                                    </div>
                                </div>
                            </div>

                            {/* ROI Predictor Chart */}
                            {strategy.roi_series && strategy.roi_series.length > 0 && (
                                <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Growth Projection (6 Months)</h4>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-white/30 uppercase">Monthly Budget</span>
                                            <span className="text-sm font-bold text-white">${investment.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={scaledROISeries}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                                    itemStyle={{ color: '#ec4899' }}
                                                    formatter={(value) => [`$${Math.round(value).toLocaleString()}`, '']}
                                                />
                                                <Area type="monotone" dataKey="revenue" stroke="#ec4899" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="spend" stroke="#ffffff40" fill="transparent" strokeDasharray="5 5" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Investment Slider */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                                            <span>Scale Investment</span>
                                            <span className="text-pink-500/50">Simulate ROI</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="100000"
                                            step="1000"
                                            value={investment}
                                            onChange={(e) => setInvestment(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all"
                                        />
                                        <div className="flex justify-between text-[10px] text-white/20">
                                            <span>$1k</span>
                                            <span>$100k</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] text-white/30 pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-500"></div> Revenue Proj.
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full border border-white/40 border-dashed"></div> Ad Spend
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Assets Preview Blocks */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Proposed Campaign Pillars</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {strategy.assets.map((asset, idx) => (
                                        <div key={idx} className="group/asset flex items-center justify-between bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-xs font-mono text-white/20 border border-white/5 group-hover/asset:text-pink-500/50 transition-colors">
                                                    0{idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{asset.type}</p>
                                                    <p className="text-[10px] text-white/30 truncate max-w-[200px]">{asset.prompt_used}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-white/10 group-hover/asset:text-white/40 transform group-hover/asset:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls & Refinement Chat */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    {!strategy ? (
                        <button
                            onClick={() => handleGenerate()}
                            disabled={loading || !brandContext}
                            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : null}
                            {loading ? 'Thinking...' : 'Generate Visual Strategy'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            {/* Refinement Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MessageSquare size={16} className="text-white/20 group-focus-within:text-pink-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isRefining}
                                    placeholder="Refine this strategy (e.g. 'Make it more minimal')"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 ring-pink-500/50 focus:bg-white/[0.08] transition-all"
                                />
                                <button
                                    onClick={() => handleGenerate(feedback)}
                                    disabled={!feedback.trim() || isRefining}
                                    className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-0 transition-all"
                                >
                                    {isRefining ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleGenerate()}
                                    className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={14} /> New Strategy
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                    title="Export PDF"
                                >
                                    <Download size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BentoItem>
    );
}

