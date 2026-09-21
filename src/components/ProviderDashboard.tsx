import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  Send,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Copy,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Camera,
  Play
} from 'lucide-react';
import { UserProfile, ServiceRequest, ProviderQuote } from '../types';

interface ProviderDashboardProps {
  provider: UserProfile;
  requests: ServiceRequest[];
  onSubmitQuote: (requestId: string, quote: Omit<ProviderQuote, 'id' | 'createdAt' | 'status'>) => void;
  onOpenMicroPage: (provider: UserProfile) => void;
  onOpenFacialVerification: () => void;
  onOpenDocVerification: () => void;
  onOpenChat: (request: ServiceRequest) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  provider,
  requests,
  onSubmitQuote,
  onOpenMicroPage,
  onOpenFacialVerification,
  onOpenDocVerification,
  onOpenChat
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [price, setPrice] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-03-22');
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [estimatedDuration, setEstimatedDuration] = useState<string>('1h30m');
  const [message, setMessage] = useState<string>('');
  const [warranty, setWarranty] = useState<string>('Garantia de 90 dias com emissão de recibo');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'my_quotes'>('available');

  // Filter requests matching provider's category
  const matchingRequests = requests.filter(
    (req) => !provider.category || req.category.toLowerCase() === provider.category.toLowerCase()
  );

  // Requests where this provider already sent a quote
  const myQuotedRequests = requests.filter((req) =>
    req.quotes.some((q) => q.providerId === provider.id)
  );

  const handleCopyLink = () => {
    const microUrl = `${window.location.origin}/#p/${provider.slug || 'perfil'}`;
    navigator.clipboard.writeText(microUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectRequestToQuote = (req: ServiceRequest) => {
    setSelectedRequest(req);
    // Suggest default smart price based on AI estimate if available
    if (req.aiAnalysis?.priceRangeEstimate) {
      const match = req.aiAnalysis.priceRangeEstimate.match(/R\$\s*(\d+)/);
      if (match) setPrice(match[1]);
    } else {
      setPrice('110');
    }
    setMessage(`Olá ${req.clientName}! Consigo realizar o serviço com pontualidade e levo todo o material e ferramentas necessárias.`);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !price) return;

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert("Por favor, informe um valor válido.");
      return;
    }

    onSubmitQuote(selectedRequest.id, {
      requestId: selectedRequest.id,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatar,
      providerPhone: provider.phone,
      providerRating: provider.rating || 5.0,
      providerJobsCount: provider.completedJobsCount || 10,
      providerFacialVerified: !!provider.facialVerified,
      providerDocVerified: !!provider.documentVerified,
      price: numPrice,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      message,
      warrantyTerms: warranty
    });

    setSelectedRequest(null);
    setActiveTab('my_quotes');
  };

  return (
    <div className="space-y-6">
      {/* Provider Header Card & Verification Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/20 shadow-xs"
              />
              {provider.facialVerified && (
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{provider.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {provider.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {provider.neighborhood}, {provider.city} • ⭐ {provider.rating} ({provider.completedJobsCount} serviços feitos)
              </p>
            </div>
          </div>

          {/* Micro-page link action */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenMicroPage(provider)}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Minha Micropágina Aberta</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Facial status */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            provider.facialVerified
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold block">Validação Facial</span>
                <span className="text-[11px] opacity-80">
                  {provider.facialVerified ? 'Biometria ativa e verificada' : 'Pendente de validação'}
                </span>
              </div>
            </div>
            {provider.facialVerified ? (
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-4 h-4" /> OK
              </span>
            ) : (
              <button
                onClick={onOpenFacialVerification}
                className="px-2.5 py-1 rounded bg-amber-600 text-white font-semibold text-[11px]"
              >
                Validar Rosto
              </button>
            )}
          </div>

          {/* Document status */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            provider.documentVerified
              ? 'bg-blue-50/70 border-blue-200 text-blue-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold block">Documento Pessoal ({provider.documentType || 'RG/CNH'})</span>
                <span className="text-[11px] opacity-80">
                  {provider.documentVerified ? 'Documento homologado pela plataforma' : 'Envio de foto pendente'}
                </span>
              </div>
            </div>
            {provider.documentVerified ? (
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-4 h-4" /> Verificado
              </span>
            ) : (
              <button
                onClick={onOpenDocVerification}
                className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold text-[11px]"
              >
                Enviar Documento
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'available'
              ? 'border-amber-600 text-amber-700 bg-amber-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Pedidos Disponíveis para {provider.category} ({matchingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('my_quotes')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'my_quotes'
              ? 'border-amber-600 text-amber-700 bg-amber-50/40 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Minhas Propostas Enviadas ({myQuotedRequests.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {matchingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Nenhum pedido novo no momento</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Quando clientes de {provider.city} solicitarem serviços de {provider.category}, você receberá a notificação aqui com fotos e detalhes para enviar seu orçamento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {matchingRequests.map((req) => {
                const alreadyQuoted = req.quotes.some((q) => q.providerId === provider.id);
                const isAccepted = req.selectedQuoteId && req.quotes.find(q => q.id === req.selectedQuoteId)?.providerId === provider.id;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            {req.category}
                          </span>
                          {req.aiAnalysis?.urgency && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              Urgência: {req.aiAnalysis.urgency}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString('pt-BR')} às {new Date(req.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{req.clientAddress} (Cliente: <strong>{req.clientName}</strong>)</span>
                        </div>

                        {/* AI Technical Analysis box */}
                        {req.aiAnalysis && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1 mt-2">
                            <span className="font-bold text-slate-700 block">
                              Diagnóstico Prévio da IA:
                            </span>
                            <p className="text-slate-600 text-[11px]">
                              {req.aiAnalysis.technicalSummary}
                            </p>
                            <div className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                              Faixa de valor sugerida para o serviço: {req.aiAnalysis.priceRangeEstimate} • Duração: {req.aiAnalysis.estimatedDuration}
                            </div>
                          </div>
                        )}

                        {/* Media Attachment preview */}
                        {req.mediaUrl && (
                          <div className="pt-2">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                              Foto enviada pelo cliente:
                            </span>
                            <img
                              src={req.mediaUrl}
                              alt="Foto do serviço"
                              className="h-28 w-44 object-cover rounded-xl border border-slate-200 shadow-xs cursor-pointer"
                              onClick={() => window.open(req.mediaUrl, '_blank')}
                            />
                          </div>
                        )}
                      </div>

                      {/* Right action button */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-xs text-slate-500 font-medium">
                          {req.quotes.length} {req.quotes.length === 1 ? 'proposta já enviada' : 'propostas já enviadas'}
                        </div>

                        {isAccepted ? (
                          <button
                            onClick={() => onOpenChat(req)}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Proposta Aprovada! Abrir Chat & Rota</span>
                          </button>
                        ) : alreadyQuoted ? (
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Orçamento Já Enviado</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectRequestToQuote(req)}
                            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
                          >
                            <DollarSign className="w-4 h-4" />
                            <span>Enviar Proposta de Orçamento</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my_quotes' && (
        <div className="space-y-4">
          {myQuotedRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p className="text-xs text-slate-500">Você ainda não enviou propostas de orçamento.</p>
            </div>
          ) : (
            myQuotedRequests.map((req) => {
              const myQuote = req.quotes.find((q) => q.providerId === provider.id);
              const isAccepted = req.selectedQuoteId === myQuote?.id;

              return (
                <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{req.title}</span>
                        {isAccepted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> FECHADO COM VOCÊ!
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            Aguardando decisão do cliente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Cliente: <strong>{req.clientName}</strong> • {req.clientAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Sua Proposta:</span>
                        <span className="text-base font-extrabold text-amber-600">
                          R$ {myQuote?.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Agendado: {myQuote?.scheduledDate} às {myQuote?.scheduledTime}
                        </span>
                      </div>

                      {isAccepted && (
                        <button
                          onClick={() => onOpenChat(req)}
                          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Chat & Rota ao Vivo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quote Submission Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">Responder Orçamento</h3>
                <p className="text-xs text-slate-500">Para: {selectedRequest.title}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor Total Proposto da Mão de Obra (R$):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 110.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-bold text-base text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data que pode ir:</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horário disponível:</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tempo estimado de execução:</label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="Ex: 1 hora a 1 hora e meia"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mensagem para o cliente (explique o diferencial da sua proposta):
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Termos de garantia:</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Orçamento ao Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
