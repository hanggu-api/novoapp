import React, { useState } from 'react';
import {
  Zap,
  Power,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  Share2,
  ExternalLink,
  ShieldCheck,
  Phone,
  Navigation,
  Sparkles,
  Camera,
  Play,
  Volume2
} from 'lucide-react';
import { UserProfile, ServiceRequest, ProviderQuote } from '../types';

interface UberDriverOverlayProps {
  provider: UserProfile;
  incomingRequests: ServiceRequest[];
  onSubmitQuote: (requestId: string, quote: Omit<ProviderQuote, 'id' | 'createdAt' | 'status'>) => void;
  onOpenMicroPage: (provider: UserProfile) => void;
  onOpenChat: (req: ServiceRequest) => void;
  onOpenFacialVerification: () => void;
  onOpenDocVerification: () => void;
}

export const UberDriverOverlay: React.FC<UberDriverOverlayProps> = ({
  provider,
  incomingRequests,
  onSubmitQuote,
  onOpenMicroPage,
  onOpenChat,
  onOpenFacialVerification,
  onOpenDocVerification
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [customPrice, setCustomPrice] = useState<number>(110);
  const [selectedTime, setSelectedTime] = useState('Em 20 min');
  const [hasSentQuote, setHasSentQuote] = useState(false);

  const activeRequest = incomingRequests[0];

  const handleSendQuickBid = (price: number) => {
    if (!activeRequest) return;
    onSubmitQuote(activeRequest.id, {
      requestId: activeRequest.id,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatar,
      providerPhone: provider.phone,
      providerRating: provider.rating || 4.9,
      providerJobsCount: provider.completedJobsCount || 100,
      providerFacialVerified: !!provider.facialVerified,
      providerDocVerified: !!provider.documentVerified,
      price,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: selectedTime,
      estimatedDuration: '1h',
      message: 'Estou no bairro com ferramentas completas e escada. Posso atender imediatamente.',
      warrantyTerms: 'Garantia de 90 dias'
    });
    setHasSentQuote(true);
    setTimeout(() => setHasSentQuote(false), 4000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Driver HUD bar */}
      <div className="pointer-events-auto flex items-center justify-between gap-3 bg-slate-950/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center gap-2 transition ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'ONLINE NO RADAR' : 'OFFLINE'}</span>
          </button>

          <div className="hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-mono">Profissional Conectado</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              {provider.name} • {provider.category}
            </span>
          </div>
        </div>

        {/* Today's Earnings & Verification */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-mono">Ganhos de Hoje</span>
            <span className="text-sm font-black text-emerald-400">R$ 340,00</span>
          </div>

          <button
            onClick={() => onOpenMicroPage(provider)}
            className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Minha Micropágina Aberta</span>
          </button>
        </div>
      </div>

      {/* Floating Alert: INCOMING RIDE / SERVICE OPPORTUNITY */}
      {isOnline && activeRequest && (
        <div className="pointer-events-auto max-w-lg mx-auto w-full bg-slate-900/98 backdrop-blur-xl text-white rounded-3xl p-5 border-2 border-amber-500 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-black text-amber-400 tracking-wider uppercase">
                ⚡ NOVO CHAMADO NO SEU RAIO (1.4 KM)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Expira em 45s
            </span>
          </div>

          {/* Request details */}
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-white leading-tight">
              {activeRequest.title}
            </h3>
            <p className="text-xs text-slate-300">
              {activeRequest.description}
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Cliente em Pinheiros • Estimativa de deslocamento: <strong>4 min</strong></span>
            </div>
          </div>

          {/* AI triage insight */}
          {activeRequest.aiAnalysis && (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>IA Triage:</strong> {activeRequest.aiAnalysis.requiredTools?.join(', ')} • Urgência: {activeRequest.aiAnalysis.urgency}
              </span>
            </div>
          )}

          {/* Feedback message if quote sent */}
          {hasSentQuote ? (
            <div className="p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Orçamento enviado ao cliente! Aguardando aceite...</span>
            </div>
          ) : (
            /* Fast 1-Touch Bidding buttons (like Uber fare bids) */
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">
                Escolha o valor para enviar sua proposta imediata:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSendQuickBid(90)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs transition flex flex-col items-center"
                >
                  <span className="text-[10px] text-slate-400">Rápido</span>
                  <span className="text-sm text-amber-400">R$ 90</span>
                </button>

                <button
                  onClick={() => handleSendQuickBid(110)}
                  className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex flex-col items-center shadow-lg shadow-amber-500/20"
                >
                  <span className="text-[10px] text-slate-900 font-bold">Recomendado</span>
                  <span className="text-sm">R$ 110</span>
                </button>

                <button
                  onClick={() => handleSendQuickBid(135)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs transition flex flex-col items-center"
                >
                  <span className="text-[10px] text-slate-400">Com Material</span>
                  <span className="text-sm text-amber-400">R$ 135</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
