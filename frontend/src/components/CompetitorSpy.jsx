import { useState } from 'react';
import { BentoItem } from '../layouts/BentoLayout';
import { Search, ShieldAlert, Target, TrendingUp, Loader2, ArrowRight } from 'lucide-react';

export default function CompetitorSpy() {
    const [url, setUrl] = useState('');
    const [scanning, setScanning] = useState(false);
    const [report, setReport] = useState(null);

    const handleScan = () => {
        if (!url) return;
        setScanning(true);
        setReport(null);

        // Simulate scanning
        setTimeout(() => {
            setScanning(false);
            setReport({
                competitor: url.replace('https://', '').replace('www.', '').split('.')[0],
                archetype: 'The Ruler', // Simulated AI result
                weakness: 'Their content is too corporate and lacks human connection. They completely ignore Gen Z platforms.',
                opportunity: 'Launch a raw, behind-the-scenes content series to build trust where they fail.',
                adSpend: '$45,000/mo',
                keywords: ['premium', 'exclusive', 'legacy']
            });
        }, 2000); // 2 second mock scan
    };

    return (
        <BentoItem span="col-span-1 md:col-span-1 row-span-1">
            <div className="flex flex-col h-full bg-[#0a0a0a]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Target size={20} className="text-red-500" />
                        Competitor Spy
                    </h3>
                    {report && <span className="text-[10px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase tracking-wider">Analysis Complete</span>}
                </div>

                {!report ? (
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Target Competitor</label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-3 text-white/20" />
                                <input
                                    type="text"
                                    placeholder="Enter URL (e.g. nike.com)"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleScan}
                            disabled={scanning || !url}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {scanning ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                            {scanning ? 'Injecting Spiders...' : 'Initialize Scan'}
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Weakness Card */}
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <ShieldAlert size={40} className="text-red-500" />
                            </div>
                            <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Detected Weakness</h4>
                            <p className="text-sm text-white/80 font-medium leading-relaxed">
                                {report.weakness}
                            </p>
                        </div>

                        {/* Opportunity Card */}
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <TrendingUp size={12} /> Counter-Strategy
                            </h4>
                            <p className="text-xs text-white/70 italic mb-2">
                                "{report.opportunity}"
                            </p>
                            <button className="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                                Apply to Strategy <ArrowRight size={10} />
                            </button>
                        </div>

                        <button onClick={() => setReport(null)} className="text-[10px] text-white/20 hover:text-white/50 uppercase underline w-full text-center">
                            Scan Another
                        </button>
                    </div>
                )}
            </div>
        </BentoItem>
    );
}
