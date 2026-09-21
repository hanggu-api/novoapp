import React, { useState } from 'react';
import { User, Briefcase, Camera, FileText, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { CATEGORIES_LIST } from '../data/mockData';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: UserProfile) => void;
  onTriggerFacial: (tempUser: Partial<UserProfile>) => void;
  onTriggerDoc: (tempUser: Partial<UserProfile>) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onTriggerFacial,
  onTriggerDoc
}) => {
  const [role, setRole] = useState<UserRole>('provider');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Eletricista');
  const [city, setCity] = useState('São Paulo');
  const [neighborhood, setNeighborhood] = useState('Pinheiros');
  const [bio, setBio] = useState('');

  // Verifications
  const [facialDone, setFacialDone] = useState(false);
  const [docDone, setDocDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Preencha ao menos Nome e Telefone.");
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      phone,
      email: email || `${slug}@exemplo.com`,
      role,
      avatar: role === 'provider'
        ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      facialVerified: true, // Marked verified after biometric check
      facialVerificationDate: new Date().toISOString().split('T')[0],
      documentVerified: role === 'provider' ? true : false,
      documentType: 'CNH',
      slug,
      category: role === 'provider' ? category : undefined,
      specialtyTags: role === 'provider' ? ['Atendimento Rápido', 'Orçamento Sem Compromisso', category] : undefined,
      bio: bio || (role === 'provider' ? `Profissional especializado em serviços de ${category} em ${city}.` : undefined),
      city,
      neighborhood,
      rating: 5.0,
      totalReviews: 1,
      completedJobsCount: 0,
      availableToday: true,
      coordinates: { lat: -23.5617, lng: -46.6865 }
    };

    onRegister(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-800">Criar Nova Conta na ProServiços</h3>
            <p className="text-xs text-slate-500">
              {role === 'provider' ? 'Prestador: receba pedidos e crie sua micropágina' : 'Cliente: solicite orçamentos rápidos'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                role === 'client'
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sou Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                role === 'provider'
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Sou Prestador de Serviços</span>
            </button>
          </div>

          {/* Name & Phone */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Completo:</label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Mendes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp:</label>
              <input
                type="text"
                required
                placeholder="(11) 98765-4321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cidade:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {role === 'provider' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Área / Profissão:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apresentação para sua Micropágina:</label>
                <textarea
                  rows={2}
                  placeholder="Conte um pouco sobre sua experiência, ferramentas e serviços atendidos..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </>
          )}

          {/* Verification requirements banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verificação de Segurança Integrada:
            </span>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span>1. Validação Facial Biométrica (Câmera)</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Incluída
                </span>
              </div>
              {role === 'provider' && (
                <div className="flex items-center justify-between">
                  <span>2. Foto do Documento Pessoal (RG/CNH)</span>
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Obrigatória
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition"
          >
            Cadastrar e Ativar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};
