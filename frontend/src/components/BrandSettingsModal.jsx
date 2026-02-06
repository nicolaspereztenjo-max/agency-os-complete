import { useState, useRef } from 'react';
import { useAgencyStore } from '../store/agencyStore';
import { X, Upload, Check, Palette, RefreshCcw } from 'lucide-react';

export default function BrandSettingsModal({ isOpen, onClose }) {
    const { brandDNA, setCustomBranding, resetToAI } = useAgencyStore();
    const [localDNA, setLocalDNA] = useState({ ...brandDNA });
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleColorChange = (key, value) => {
        setLocalDNA(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setCustomBranding(localDNA);
        onClose();
    };

    const handleReset = () => {
        resetToAI();
        onClose();
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalDNA(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Palette className="text-pink-400" size={20} />
                        Brand DNA Settings
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Brand Logo</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-32 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group"
                        >
                            {localDNA.logo ? (
                                <img src={localDNA.logo} alt="Brand Logo" className="h-20 object-contain" />
                            ) : (
                                <>
                                    <Upload className="text-white/30 group-hover:text-pink-400 mb-2" size={24} />
                                    <span className="text-xs text-white/50">Click to upload logo</span>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoUpload}
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/70">Brand Palette</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-white/40 mb-1 block">Primary</label>
                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded border border-white/10">
                                    <input
                                        type="color"
                                        value={localDNA.primaryColor}
                                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-xs font-mono opacity-70">{localDNA.primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 mb-1 block">Secondary</label>
                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded border border-white/10">
                                    <input
                                        type="color"
                                        value={localDNA.secondaryColor}
                                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-xs font-mono opacity-70">{localDNA.secondaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 mb-1 block">Accent</label>
                                <div className="flex items-center gap-2 bg-white/5 p-1 rounded border border-white/10">
                                    <input
                                        type="color"
                                        value={localDNA.accentColor}
                                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-xs font-mono opacity-70">{localDNA.accentColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
                    <button
                        onClick={handleReset}
                        className="text-white/50 hover:text-white text-xs flex items-center gap-1 transition-colors px-3 py-2 rounded hover:bg-white/5"
                    >
                        <RefreshCcw size={14} />
                        Reset to AI Auto-Detect
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-500/20"
                    >
                        <Check size={16} />
                        Save DNA
                    </button>
                </div>
            </div>
        </div>
    );
}
