import { motion } from 'framer-motion';

export default function ChameleonInput({ value, onChange, placeholder = "Describe your brand..." }) {
    return (
        <div className="relative w-full max-w-2xl mx-auto mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-20 blur-xl rounded-lg animate-pulse" />
            <motion.textarea
                whileFocus={{ scale: 1.01 }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="relative w-full p-6 text-2xl font-light bg-white/10 backdrop-blur-md border border-white/20 rounded-xl outline-none focus:border-[var(--color-primary)] transition-colors shadow-xl resize-none min-h-[150px]"
                style={{
                    color: 'var(--color-primary)',
                    caretColor: 'var(--color-primary)'
                }}
            />
        </div>
    );
}
