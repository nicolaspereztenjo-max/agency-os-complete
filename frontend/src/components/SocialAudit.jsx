import { useState } from 'react';
import api from '../api';
import { BentoItem } from '../layouts/BentoLayout';
import { Search, Loader2, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function SocialAudit() {
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState('instagram');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAudit = async (e) => {
        e.preventDefault();
        if (!username) return;

        setLoading(true);
        setResult(null); // Reset previous result

        try {
            // Note: Assuming the backend endpoint is GET /api/v1/audit/social?username=...&platform=...
            const response = await api.get(`/api/v1/audit/social`, {
                params: { username, platform }
            });
            setResult(response.data);
        } catch (error) {
            console.error("Audit failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <BentoItem span="col-span-1 md:col-span-2 row-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search size={20} />
                Social Auditor
            </h3>

            <form onSubmit={handleAudit} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">@</span>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-white/30"
                    />
                </div>

                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded px-2 text-sm focus:outline-none focus:border-white/30"
                >
                    <option value="instagram">IG</option>
                    <option value="linkedin">LI</option>
                    <option value="twitter">X</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Go'}
                </button>
            </form>

            {/* Results Area */}
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-bold text-lg">{result.username}</h4>
                            <span className="text-xs opacity-60 uppercase">{result.platform} Analysis</span>
                        </div>
                        <div className={`text-3xl font-mono font-bold ${getScoreColor(result.overall_score)}`}>
                            {result.overall_score}/100
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 p-3 rounded border border-white/5">
                            <span className="text-xs opacity-50 block mb-1">ENGAGEMENT RATE</span>
                            <span className="text-xl font-semibold">{result.engagement_rate}</span>
                        </div>

                        <div>
                            <span className="text-xs opacity-50 block mb-2 font-bold tracking-wider">AI INSIGHTS</span>
                            <ul className="space-y-1">
                                {result.analysis.map((point, i) => (
                                    <li key={i} className="text-sm flex gap-2 items-start">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span className="opacity-80">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <span className="text-xs opacity-50 block mb-2 font-bold tracking-wider text-green-400">ACTION PLAN</span>
                            <ul className="space-y-1">
                                {result.action_items.map((item, i) => (
                                    <li key={i} className="text-sm flex gap-2 items-start bg-green-500/10 p-2 rounded">
                                        <span className="text-green-400">✓</span>
                                        <span className="opacity-90">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </BentoItem>
    );
}
