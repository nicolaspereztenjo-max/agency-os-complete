import { motion } from 'framer-motion';

export const BentoItem = ({ children, className = "", span = "col-span-1" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 overflow-hidden relative group hover:border-white/30 transition-all ${span} ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default function BentoLayout({ children }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] max-w-7xl mx-auto p-4">
            {children}
        </div>
    );
}
