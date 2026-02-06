import { useState, forwardRef, useImperativeHandle } from 'react';
import api from '../api';
import { BentoItem } from '../layouts/BentoLayout';
import { Sparkles, Loader2, Image as ImageIcon, Wand2, Zap, Download } from 'lucide-react';

const BananaGenerator = forwardRef(({ brandContext, onCampaignGenerated }, ref) => {
    const [mode, setMode] = useState('manual'); // 'manual' | 'auto'

    // Manual State
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('realistic');

    // Auto State
    const [campaignResult, setCampaignResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    useImperativeHandle(ref, () => ({
        generate: () => {
            console.log("🍌 Auto-Generating with context:", brandContext);
            setMode('auto');
            handleGenerate(null);
        }
    }));

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setGeneratedImage(null);
        setCampaignResult(null);

        try {
            if (mode === 'manual' && e) {
                if (!prompt) return;
                const response = await api.post('/api/v1/generate/image', { prompt, style });
                setGeneratedImage(response.data.url);
            } else {
                // Auto / Campaign Mode
                if (!brandContext) return; // Should show error
                const response = await api.post('/strategy/generate', {
                    brand_context: brandContext,
                    audience: 'General' // Defaulting audience as it is required by StrategyRequest but not in BananaGenerator state
                });
                setCampaignResult(response.data);
                if (onCampaignGenerated) onCampaignGenerated(response.data);
            }
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!campaignResult) return;
        try {
            const response = await api.post('/strategy/export', campaignResult, {
                responseType: 'blob' // Important for binary files
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'strategy_campaign_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-400" />
                    Banana AI Studio
                </h3>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setMode('manual')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${mode === 'manual' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        Manual
                    </button>
                    <button
                        onClick={() => setMode('auto')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${mode === 'auto' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow' : 'text-white/50 hover:text-white'}`}
                    >
                        <Zap size={10} fill="currentColor" />
                        Auto-Pilot
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-full justify-between">
                <form onSubmit={handleGenerate} className="space-y-3 mb-4">
                    {mode === 'manual' ? (
                        <>
                            <textarea
                                placeholder="Describe the image you want..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={2}
                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30 resize-none"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                                >
                                    <option value="realistic">Realistic</option>
                                    <option value="cyberpunk">Cyberpunk</option>
                                    <option value="minimalist">Minimalist</option>
                                    <option value="retro">Retro Pop</option>
                                </select>
                                <GenerateButton loading={loading} />
                            </div>
                        </>
                    ) : (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg space-y-3">
                            <p className="text-sm opacity-80">
                                <span className="font-bold text-purple-300">Context:</span> "{brandContext || 'No brand context detected'}"
                            </p>
                            <p className="text-xs opacity-60">
                                The AI Director will analyze your brand DNA, select the optimal visual style, and generate a cohesive campaign set.
                            </p>
                            <GenerateButton loading={loading} label="Auto-Generate Campaign" />
                        </div>
                    )}
                </form>

                {/* Result Area */}
                <div className="flex-1 min-h-[160px] bg-black/40 rounded-lg border border-white/5 overflow-hidden relative group">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse">
                            <Sparkles size={32} className="text-purple-400" />
                            <span className="text-sm font-mono text-purple-300">
                                {mode === 'auto' ? 'Analyzing Brand DNA...' : 'Dreaming...'}
                            </span>
                        </div>
                    ) : campaignResult ? (
                        <div className="p-2 h-full flex flex-col">
                            {/* DEBUG: Remove later */}
                            {/* <pre className="text-[10px] bg-black/80 p-2 absolute z-50 top-0 left-0 w-full h-full overflow-auto">{JSON.stringify(campaignResult, null, 2)}</pre> */}

                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs p-2 bg-white/5 rounded border border-white/5 flex-1 mr-2">
                                    <span className="text-purple-400 font-bold">Strategy:</span> {campaignResult.strategy_reasoning}
                                </span>
                                <button
                                    onClick={handleExport}
                                    className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white flex items-center gap-1 border border-white/10 transition-colors"
                                    title="Export PDF Report"
                                >
                                    <Download size={14} />
                                    PDF
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1">
                                {campaignResult.assets.map((asset, i) => (
                                    <div key={i} className="relative aspect-square bg-black/50 rounded overflow-hidden group/item">
                                        <img src={asset.url} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} />
                                        <div className="hidden absolute inset-0 bg-red-900/50 p-2 text-[8px] overflow-auto break-all">
                                            BROKEN: {asset.url}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[10px] truncate">
                                            {asset.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : generatedImage ? (
                        <img
                            src={generatedImage}
                            alt="Generated Content"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-30">
                            <Wand2 size={32} />
                            <span className="text-sm">Ready to create</span>
                        </div>
                    )}
                </div>
            </div>
        </BentoItem>
    );
});

function GenerateButton({ loading, label = "Generate" }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-black font-bold px-6 py-2 rounded hover:bg-yellow-300 transition-colors flex items-center gap-2 disabled:opacity-50 justify-center min-w-[120px]"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

export default BananaGenerator;
