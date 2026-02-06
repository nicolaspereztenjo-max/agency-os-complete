import { useState } from 'react';
import api from '../api';
import { BentoItem } from '../layouts/BentoLayout';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function ClientForm({ onClientAdded }) {
    const [formData, setFormData] = useState({
        brand_name: '',
        current_objective: 'Venta',
        tone_of_voice: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.brand_name) return;

        setIsSubmitting(true);
        try {
            await api.post('/clients', formData);
            setFormData({
                brand_name: '',
                current_objective: 'Venta',
                tone_of_voice: '',
                description: ''
            });
            if (onClientAdded) onClientAdded();
        } catch (error) {
            console.error('Error creating client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BentoItem>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle size={20} />
                New Client
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="brand_name"
                    placeholder="Brand Name"
                    value={formData.brand_name}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                />
                <select
                    name="current_objective"
                    value={formData.current_objective}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30"
                >
                    <option value="Venta">Venta</option>
                    <option value="Autoridad">Autoridad</option>
                    <option value="Trafico">Trafico</option>
                </select>
                <textarea
                    name="tone_of_voice"
                    placeholder="Tone (e.g. Professional, Witty)"
                    value={formData.tone_of_voice}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30 resize-none"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition-colors flex justify-center items-center"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Add Client'}
                </button>
            </form>
        </BentoItem>
    );
}
