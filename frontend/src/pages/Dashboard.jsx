import { useState, useEffect, useRef } from 'react';
import { useAgencyStore } from '../store/agencyStore';
import ChameleonEngine from '../components/ChameleonEngine';
import ChameleonInput from '../components/ChameleonInput';
import KineticText from '../components/KineticText';
import BentoLayout, { BentoItem } from '../layouts/BentoLayout';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import SocialAudit from '../components/SocialAudit';
import MetaConnect from '../components/MetaConnect';
import BananaGenerator from '../components/BananaGenerator';
import VideoStudio from '../components/VideoStudio';
import EditorialCalendar from '../components/EditorialCalendar';
import StrategyGenerator from '../components/StrategyGenerator';
import TheVault from '../components/TheVault';
import BrandSettingsModal from '../components/BrandSettingsModal';
import Marketplace from '../components/Marketplace';
import CompetitorSpy from '../components/CompetitorSpy';
import { Settings, ShoppingBag } from 'lucide-react'; // Import Settings icon

export default function Dashboard() {
    const { brandDNA, analyzePurpose } = useAgencyStore();
    const [brandInput, setBrandInput] = useState(brandDNA.purpose || '');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
    const [campaignData, setCampaignData] = useState(null);

    const bananaRef = useRef(null);
    const calendarRef = useRef(null);

    // Sync local input with store purpose on mount
    useEffect(() => {
        if (brandDNA.purpose) {
            setBrandInput(brandDNA.purpose);
        }
    }, [brandDNA.purpose]);

    const handleInputChange = (val) => {
        setBrandInput(val);
        analyzePurpose(val);
    };

    const handleClientAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen transition-colors duration-700 ease-in-out p-8">
            {/* Logic Layer */}
            <ChameleonEngine inputContext={brandInput} />

            {/* Header */}
            <header className="mb-8 flex justify-between items-end">
                <div className="flex items-center gap-4">
                    {brandDNA.logo ? (
                        <img src={brandDNA.logo} alt="Brand Logo" className="h-16 w-16 object-contain rounded-lg border border-white/10" />
                    ) : (
                        <div>
                            <KineticText>Agency OS</KineticText>
                            <p className="text-xl opacity-60 mt-2 max-w-xl font-light">
                                Operating System Active.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsMarketplaceOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-all text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]"
                        >
                            <ShoppingBag size={14} />
                            Solutions
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold uppercase tracking-wider"
                        >
                            <Settings size={14} />
                            Brand DNA
                        </button>
                    </div>

                    <div className="text-right opacity-40 text-sm mt-1">
                        <p>DNA: {brandDNA.fontHeading}</p>
                        <p>MODE: {brandDNA.tone}</p>
                    </div>
                </div>
            </header>

            <BrandSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <Marketplace isOpen={isMarketplaceOpen} onClose={() => setIsMarketplaceOpen(false)} />

            {/* Input Section */}
            <section className="mb-12">
                <ChameleonInput
                    value={brandInput}
                    onChange={handleInputChange}
                    placeholder="Refine your agency DNA..."
                />
            </section>

            {/* Dashboard Grid */}
            <BentoLayout>
                {/* ROW 1: ANALYTICS & ONBOARDING (USER REQUEST) */}
                {/* Meta Connect (Ads & Account) */}
                <MetaConnect />

                {/* AI Strategy (The Context) */}
                <StrategyGenerator
                    brandContext={brandInput}
                    brandDNA={brandDNA}
                    onGenerate={() => {
                        bananaRef.current?.generate();
                        calendarRef.current?.generate();
                    }}
                />

                {/* ROW 2: CONTENT & PLANNING */}
                {/* The Vault (Asset Management) */}
                <TheVault />

                {/* Video Studio (NEW) */}
                <VideoStudio campaignResult={campaignData} />

                {/* Editorial Calendar (Copies & Schedule) */}
                <EditorialCalendar ref={calendarRef} />

                {/* ROW 3: MANAGEMENT & FINANCIALS */}
                {/* Competitor Spy (NEW) */}
                <CompetitorSpy />

                {/* Social Audit */}
                <SocialAudit />

                {/* Client Management */}
                <ClientForm onClientAdded={handleClientAdded} />
                <ClientList key={refreshKey} />

            </BentoLayout>

        </div>
    );
}
