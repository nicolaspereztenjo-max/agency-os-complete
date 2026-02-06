const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const strategyService = {
    /**
     * Generates a creative strategy.
     * @param {string} brandContext 
     * @param {string} audience 
     */
    async generateStrategy(brandContext, brandDNA = null, feedback = null) {
        const response = await fetch(`${API_URL}/strategy/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                brand_context: brandContext,
                brand_dna: brandDNA,
                feedback: feedback
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate strategy');
        }

        return await response.json();
    },

    /**
     * Exports the strategy as a PDF.
     * @param {object} strategyData 
     */
    async exportPDF(strategyData) {
        const response = await fetch(`${API_URL}/strategy/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(strategyData),
        });

        if (!response.ok) {
            throw new Error('Failed to export PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AgencyOS_Strategy_Report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};
