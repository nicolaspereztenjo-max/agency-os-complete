import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function KineticText({ children, baseVelocity = 100 }) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Transform velocity to skew
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-30, 30]);
    const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [1.2, 1, 1.2]);

    return (
        <div className="overflow-hidden py-4">
            <motion.h1
                className="text-6xl md:text-9xl font-bold uppercase whitespace-nowrap tracking-tighter"
                style={{
                    skewX,
                    color: 'var(--color-primary)'
                }}
            >
                {children}
            </motion.h1>
        </div>
    );
}
