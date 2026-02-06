import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgencyStore } from '../store/agencyStore';
import { motion } from 'framer-motion';

const Onboarding = () => {
    const navigate = useNavigate();
    const [purpose, setPurpose] = useState('');
    const { analyzePurpose, brandDNA } = useAgencyStore();

    const handlePurposeChange = (e) => {
        const text = e.target.value;
        setPurpose(text);
        analyzePurpose(text); // Triggers Real-time Chameleon Effect
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-black overflow-hidden relative">
            {/* Background Blobs reflecting brand colors */}
            <motion.div
                animate={{ backgroundColor: brandDNA.primaryColor }}
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 transition-colors duration-700"
            />
            <motion.div
                animate={{ backgroundColor: brandDNA.accentColor }}
                className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 transition-colors duration-700"
            />

            <div className="z-10 w-full max-w-2xl">
                <motion.h1
                    className="text-5xl md:text-7xl font-display font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Agency OS
                </motion.h1>

                <motion.p
                    className="text-center text-xl text-gray-400 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Install the Gem. Define your Purpose.
                </motion.p>

                <motion.div
                    className="glass-panel p-8 rounded-[30px]"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                        What is your agency's mission?
                    </label>
                    <textarea
                        value={purpose}
                        onChange={handlePurposeChange}
                        placeholder="e.g. A disruptive digital marketing agency for cyberpunk fashion brands..."
                        className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                    />

                    <div className="mt-8 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 uppercase">Primary</span>
                                <div className="w-8 h-8 rounded-full border border-white/20 transition-colors duration-500" style={{ backgroundColor: brandDNA.primaryColor }} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 uppercase">Accent</span>
                                <div className="w-8 h-8 rounded-full border border-white/20 transition-colors duration-500" style={{ backgroundColor: brandDNA.accentColor }} />
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-200"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
              Initialize OS ->
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Onboarding;
