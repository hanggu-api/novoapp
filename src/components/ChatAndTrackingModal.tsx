import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  X,
  Navigation,
  Car,
  ShieldCheck,
  Share2,
  AlertCircle
} from 'lucide-react';
import { ServiceRequest, ChatMessage, UserProfile } from '../types';

interface ChatAndTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest;
  currentUser: UserProfile;
  provider: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (requestId: string, text: string, isLocation?: boolean) => void;
  onUpdateStatus: (requestId: string, newStatus: ServiceRequest['status']) => void;
}

export const ChatAndTrackingModal: React.FC<ChatAndTrackingModalProps> = ({
  isOpen,
  onClose,
  request,
  currentUser,
  provider,
  messages,
  onSendMessage,
  onUpdateStatus
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'tracking'>('chat');
  const [providerCoords, setProviderCoords] = useState<{ lat: number; lng: number }>(
    provider.coordinates || { lat: -23.5617, lng: -46.6865 }
  );
  const [distanceKm, setDistanceKm] = useState<number>(2.4);
  const [etaMinutes, setEtaMinutes] = useState<number>(8);
  const [isSimulatingMove, setIsSimulatingMove] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(request.id, inputText.trim());
    setInputText('');
  };

  const handleShareLocation = () => {
    onSendMessage(request.id, '📍 Localização exata compartilhada com o profissional.', true);
  };

  const handleSimulateMovement = () => {
    setIsSimulatingMove(true);
    onUpdateStatus(request.id, 'provider_en_route');

    // Simulate car moving closer to destination
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDistanceKm((prev) => Math.max(0.2, Number((prev - 0.5).toFixed(1))));
      setEtaMinutes((prev) => Math.max(1, prev - 2));

      if (step >= 4) {
        clearInterval(interval);
        setIsSimulatingMove(false);
        setDistanceKm(0.0);
        setEtaMinutes(0);
        onUpdateStatus(request.id, 'in_progress');
        onSendMessage(request.id, '🚗 O prestador chegou ao endereço e iniciou o atendimento.');
      }
    }, 1500);
  };

  const selectedQuote = request.quotes.find((q) => q.id === request.selectedQuoteId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.role === 'client' ? provider.avatar : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {currentUser.role === 'client' ? provider.name : request.clientName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {request.status === 'completed' ? 'Concluído' : 'Orçamento Fechado'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {request.title} • R$ {selectedQuote?.price.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct WhatsApp Call */}
            <a
              href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Estou falando sobre o serviço de ${request.title} no ProServiços.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Tracker */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs flex items-center justify-between overflow-x-auto gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Etapa Atual:</span>
            {request.status === 'accepted' && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                1. Agendado para {selectedQuote?.scheduledDate} às {selectedQuote?.scheduledTime}
              </span>
            )}
            {request.status === 'provider_en_route' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                <Car className="w-3.5 h-3.5 animate-bounce" /> 2. Prestador em deslocamento
              </span>
            )}
            {request.status === 'in_progress' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                3. Prestador no local (Em execução)
              </span>
            )}
            {request.status === 'completed' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4. Serviço finalizado com sucesso
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {request.status !== 'completed' ? (
              <button
                onClick={() => onUpdateStatus(request.id, 'completed')}
                className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
              >
                Concluir Serviço
              </button>
            ) : (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Finalizado
              </span>
            )}
          </div>
        </div>

        {/* Tab Selector (Mobile / Split view on desktop) */}
        <div className="flex border-b border-slate-200 bg-white md:hidden">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 ${
              activeTab === 'chat' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500'
            }`}
          >
            Chat de Mensagens
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 ${
              activeTab === 'tracking' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500'
            }`}
          >
            Geolocalização & Rota
          </button>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Chat Messages Column */}
          <div
            className={`md:col-span-7 flex flex-col h-full border-r border-slate-100 bg-white ${
              activeTab === 'chat' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {messages.map((msg) => {
                const isMe =
                  (currentUser.role === 'client' && msg.senderRole === 'client') ||
                  (currentUser.role === 'provider' && msg.senderRole === 'provider');

                if (msg.isSystemUpdate) {
                  return (
                    <div key={msg.id} className="text-center py-1">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200/80 text-slate-700">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                      {msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-amber-500 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Form */}
            <div className="p-3 border-t border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareLocation}
                  className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition"
                >
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>Enviar Minha Localização</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('Tudo certo! Estou no aguardo.')}
                  className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition hidden sm:inline"
                >
                  "Tudo certo! Estou no aguardo"
                </button>
              </div>

              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva uma mensagem..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Interactive Geolocation & Map Column */}
          <div
            className={`md:col-span-5 flex flex-col h-full bg-slate-100 ${
              activeTab === 'tracking' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Map Header details */}
            <div className="p-4 bg-white border-b border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  Rastreamento e Geolocalização
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  GPS Ativo
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Distância Estimada:</span>
                  <strong className="text-slate-800 font-bold">{distanceKm} km</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Tempo de Deslocamento:</span>
                  <strong className="text-slate-800 font-bold">{etaMinutes} min</strong>
                </div>
              </div>
            </div>

            {/* Interactive Vector Map Canvas Simulation */}
            <div className="flex-1 relative overflow-hidden bg-slate-200 flex items-center justify-center p-4">
              {/* Map Graphic representation */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Road lines SVG */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-300" strokeWidth="6" fill="none">
                <path d="M 50 350 Q 180 260 220 180 T 320 80" strokeDasharray="6,6" />
                <path d="M 30 120 L 360 160" />
                <path d="M 120 40 L 160 380" />
              </svg>

              {/* Active animated Route */}
              <svg className="absolute inset-0 w-full h-full stroke-amber-500" strokeWidth="4" fill="none">
                <path
                  d="M 140 280 Q 200 220 240 160 T 260 110"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>

              {/* Pin: Client Location */}
              <div className="absolute top-16 right-16 flex flex-col items-center group cursor-pointer">
                <div className="p-2 rounded-full bg-red-600 text-white shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="bg-slate-900/90 text-white text-[10px] font-bold py-1 px-2 rounded mt-1 shadow-md whitespace-nowrap">
                  Local do Serviço (Cliente)
                </div>
              </div>

              {/* Pin: Provider Location */}
              <div
                className={`absolute transition-all duration-1000 flex flex-col items-center group cursor-pointer ${
                  distanceKm === 0 ? 'top-16 right-28' : 'bottom-20 left-16'
                }`}
              >
                <div className="p-2 rounded-full bg-blue-600 text-white shadow-lg ring-4 ring-blue-400/30">
                  <Car className="w-5 h-5" />
                </div>
                <div className="bg-blue-900/90 text-white text-[10px] font-bold py-1 px-2 rounded mt-1 shadow-md whitespace-nowrap">
                  {provider.name} ({distanceKm > 0 ? `${distanceKm} km` : 'No Local'})
                </div>
              </div>
            </div>

            {/* Map Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
              <button
                disabled={isSimulatingMove || distanceKm === 0}
                onClick={handleSimulateMovement}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                <span>
                  {isSimulatingMove
                    ? 'Simulando Deslocamento em Rota...'
                    : distanceKm === 0
                    ? 'Prestador já está no local'
                    : 'Simular Prestador a Caminho (GPS)'}
                </span>
              </button>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geolocalização criptografada e disponível apenas durante o serviço.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
