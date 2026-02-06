import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Briefcase, BarChart3, Globe, Shield, Users } from 'lucide-react';

const solutions = [
    {
        id: 'sol-1',
        title: 'Legal AI Guardian',
        description: 'Automated contract review and compliance monitoring tailored for creative agencies.',
        icon: Shield,
        category: 'Intelligence',
        price: '$199/mo',
        active: false,
    },
    {
        id: 'sol-2',
        title: 'Payroll Autopilot',
        description: 'Sync your project hours directly to payroll. Handle invoices and contractor payments automatically.',
        icon: Users,
        category: 'Operations',
        price: '$299/mo',
        active: false,
    },
    {
        id: 'sol-3',
        title: 'SEO Dominator',
        description: 'Real-time keyword tracking and competitor analysis integrated into your content calendar.',
        icon: Globe,
        category: 'Growth',
        price: '$149/mo',
        active: true,
    },
    {
        id: 'sol-4',
        title: 'Financial Forecast',
        description: 'AI-driven cash flow projections based on current pipeline and historical closure rates.',
        icon: BarChart3,
        category: 'Intelligence',
        price: '$399/mo',
        active: false,
    },
];

export default function Marketplace({ isOpen, onClose }) {
    const [activeSolutions, setActiveSolutions] = useState(
        solutions.reduce((acc, sol) => (sol.active ? { ...acc, [sol.id]: true } : acc), {})
    );

    const toggleSolution = (id) => {
        setActiveSolutions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-white/5 to-transparent">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-white mb-2">
                                    Corporate Solutions
                                </h2>
                                <p className="text-white/50 text-base max-w-lg">
                                    Expand your agency's capabilities. Activate modules to automate operations and intelligence.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {solutions.map((sol) => {
                                    const isActive = activeSolutions[sol.id];
                                    const Icon = sol.icon;

                                    return (
                                        <div
                                            key={sol.id}
                                            className={`
                                                relative p-6 rounded-2xl border transition-all duration-300 group
                                                ${isActive
                                                    ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]'
                                                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50 group-hover:text-white'}`}>
                                                    <Icon size={24} />
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded-full border ${isActive ? 'border-blue-500/30 text-blue-300' : 'border-white/10 text-white/30'}`}>
                                                    {sol.category}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2">{sol.title}</h3>
                                            <p className="text-sm text-white/50 mb-6 leading-relaxed">
                                                {sol.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-white font-medium">{sol.price}</span>
                                                <button
                                                    onClick={() => toggleSolution(sol.id)}
                                                    className={`
                                                        px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                                                        ${isActive
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-white text-black hover:bg-gray-200'
                                                        }
                                                    `}
                                                >
                                                    {isActive ? (
                                                        <>
                                                            <Check size={16} /> Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            Activate
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/20 text-center">
                            <p className="text-xs text-white/30 uppercase tracking-widest">
                                Agency OS Marketplace • Secured by Blockchain • Powered by Banana AI
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
