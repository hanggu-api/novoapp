import React from 'react';
import {
  Wrench,
  ShieldCheck,
  PlusCircle,
  UserCheck,
  Users,
  Search,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  providers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenNewRequest: () => void;
  onOpenRegister: () => void;
  onOpenFacialVerification: () => void;
  onOpenDocVerification: () => void;
  onOpenMicroPage: (provider: UserProfile) => void;
  onOpenVercelModal?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  providers,
  onSelectUser,
  onOpenNewRequest,
  onOpenRegister,
  onOpenFacialVerification,
  onOpenDocVerification,
  onOpenMicroPage,
  onOpenVercelModal,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                ProServiços
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Verificado
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Orçamentos com Validação Facial & Micropáginas
              </p>
            </div>
          </div>

          {/* Search Input (Filters services & providers) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar serviço (ex: trocar lâmpada, cortar grama, vazamento)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-800"
              />
            </div>
          </div>

          {/* Right Action & User Profile Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Vercel & Database Status Button */}
            {onOpenVercelModal && (
              <button
                onClick={onOpenVercelModal}
                className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                title="Configurações de Deploy e Banco de Dados Vercel"
              >
                <span className="font-mono text-[11px] text-amber-400">▲</span>
                <span className="hidden sm:inline">Vercel & BD</span>
              </button>
            )}

            {/* New Request Button */}
            <button
              onClick={onOpenNewRequest}
              className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Pedir Orçamento</span>
            </button>

            {/* User Switcher Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                  {currentUser.role === 'client' ? 'Cliente' : `Prestador (${currentUser.category})`}
                </span>
              </div>

              {/* Selector */}
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = providers.find((p) => p.id === e.target.value);
                  if (found) onSelectUser(found);
                  else if (e.target.value === 'new_user') onOpenRegister();
                  else {
                    // Client Ana
                    onSelectUser({
                      id: 'client-1',
                      name: 'Ana Clara Souza',
                      phone: '(11) 98765-4321',
                      email: 'ana.souza@exemplo.com',
                      role: 'client',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                      facialVerified: true,
                      facialVerificationDate: '2026-03-10'
                    });
                  }
                }}
                className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
              >
                <option value="client-1">👤 Visão: Cliente Ana (Pedir/Comparar)</option>
                <optgroup label="Prestadores Cadastrados:">
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      🔧 Visão: {p.name} ({p.category})
                    </option>
                  ))}
                </optgroup>
                <option value="new_user">➕ Cadastrar Novo Perfil</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
