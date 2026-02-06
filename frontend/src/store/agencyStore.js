import { create } from 'zustand';

export const useAgencyStore = create((set, get) => ({
    activeClientId: null,
    brandDNA: {
        name: '',
        purpose: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e293b',
        accentColor: '#f43f5e',
        fontHeading: 'Space Grotesk',
        fontBody: 'Inter',
        tone: 'neutral',
        logo: null,
        isCustomized: false,
    },

    setActiveClient: (client) => {
        set({
            activeClientId: client.id,
            brandDNA: {
                ...get().brandDNA,
                name: client.brand_name,
                purpose: client.description || client.current_objective,
                tone: client.tone_of_voice || 'neutral',
                isCustomized: false // Reset customization when switching to allow AI detection or manual setup
            }
        });

        // Trigger AI analysis for the new client context automatically if not customized
        const purpose = client.description || client.current_objective;
        if (purpose) {
            get().analyzePurpose(purpose);
        }
    },

    updateBrandDNA: (dna) => set((state) => ({
        brandDNA: { ...state.brandDNA, ...dna }
    })),

    setCustomBranding: (customData) => set((state) => ({
        brandDNA: { ...state.brandDNA, ...customData, isCustomized: true }
    })),

    resetToAI: () => set((state) => ({
        brandDNA: { ...state.brandDNA, isCustomized: false }
    })),

    // Simulates AI analysis of the purpose text to generate DNA
    analyzePurpose: async (purposeText) => {
        // TODO: Replace with real AI call
        console.log("Analyzing purpose:", purposeText);

        // If customized, only update the purpose text, don't touch style
        // We accesses state via get() if outside, but here we are inside create which doesn't expose get directly in the object usually unless using set callback pattern deeply.
        // Actually, we can check state inside the set updater if we want to be atomic, but analyzePurpose is async/complex.
        // For simple store, we can just proceed.

        // Mock Chameleon Logic
        let dna = {};
        const text = purposeText.toLowerCase();

        if (text.includes("eco") || text.includes("nature") || text.includes("plantas") || text.includes("jardin")) {
            dna = { primaryColor: '#10b981', secondaryColor: '#064e3b', accentColor: '#f59e0b', fontHeading: 'Outfit' };
        } else if (text.includes("tech") || text.includes("cyber") || text.includes("tecnologia")) {
            dna = { primaryColor: '#6366f1', secondaryColor: '#0f172a', accentColor: '#ec4899', fontHeading: 'Space Mono' };
        } else if (text.includes("luxury") || text.includes("premium") || text.includes("lujo")) {
            dna = { primaryColor: '#d4af37', secondaryColor: '#1a1a1a', accentColor: '#e5e5e5', fontHeading: 'Playfair Display' };
        } else if (text.includes("cafe") || text.includes("coffee") || text.includes("cafeteria") || text.includes("comida")) {
            dna = { primaryColor: '#432818', secondaryColor: '#faedcd', accentColor: '#d4a373', fontHeading: 'Merriweather' };
        }

        set((state) => {
            if (state.brandDNA.isCustomized) {
                // Only update purpose, keep visual style
                return { brandDNA: { ...state.brandDNA, purpose: purposeText } };
            }

            // Otherwise apply AI detected style
            if (Object.keys(dna).length > 0) {
                return { brandDNA: { ...state.brandDNA, ...dna, purpose: purposeText } };
            } else {
                return { brandDNA: { ...state.brandDNA, purpose: purposeText } };
            }
        });

    }
}));
