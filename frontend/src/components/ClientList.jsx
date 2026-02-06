import { useEffect, useState } from 'react';
import api from '../api';
import { BentoItem } from '../layouts/BentoLayout';
import { Users, CheckCircle } from 'lucide-react';
import { useAgencyStore } from '../store/agencyStore';

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { activeClientId, setActiveClient } = useAgencyStore();

    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await api.get('/clients');
                setClients(response.data);

                // Set first client as active if none selected
                if (response.data.length > 0 && !activeClientId) {
                    setActiveClient(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchClients();
    }, [activeClientId, setActiveClient]);

    return (
        <BentoItem span="col-span-1 md:col-span-2" className="bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                    <Users size={14} className="text-pink-500" />
                    Portfolio
                </h3>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{clients.length} Clients</span>
            </div>

            {loading ? (
                <div className="space-y-2">
                    <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                    <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                </div>
            ) : (
                <div className="overflow-y-auto max-h-64 space-y-2 pr-2 custom-scrollbar">
                    {clients.length === 0 ? (
                        <p className="text-xs opacity-50 italic text-center py-4">No clients found.</p>
                    ) : (
                        clients.map((client) => {
                            const isActive = activeClientId === client.id;
                            return (
                                <div
                                    key={client.id}
                                    onClick={() => setActiveClient(client)}
                                    className={`p-4 rounded-xl border transition-all duration-300 flex justify-between items-center group cursor-pointer ${isActive
                                            ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-pink-500 animate-pulse' : 'bg-white/10'}`}></div>
                                        <div>
                                            <div className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                                                {client.brand_name}
                                            </div>
                                            <div className="text-[10px] opacity-40 uppercase tracking-tighter">{client.status}</div>
                                        </div>
                                    </div>
                                    {isActive && <CheckCircle size={14} className="text-pink-500" />}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </BentoItem>
    );
}
