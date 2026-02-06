import { useEffect } from 'react';
import { useAgencyStore } from '../store/agencyStore';

// --- Component ---
export default function ChameleonEngine({ inputContext = '' }) {
  const { brandDNA } = useAgencyStore();

  // 1. Analyze Brand DNA and Apply to CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', brandDNA.primaryColor);
    root.style.setProperty('--color-secondary', brandDNA.secondaryColor);
    root.style.setProperty('--color-accent', brandDNA.accentColor);
    root.style.setProperty('--font-primary', brandDNA.fontHeading);

    // Apply font to body
    document.body.style.fontFamily = brandDNA.fontHeading;
    document.body.style.backgroundColor = brandDNA.secondaryColor;
    document.body.style.color = brandDNA.primaryColor;

  }, [brandDNA]);

  return null; // Headless component
}

