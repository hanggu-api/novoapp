import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Clock,
  Calendar,
  DollarSign,
  Star,
  ExternalLink,
  MessageSquare,
  Award,
  Zap
} from 'lucide-react';
import { ServiceRequest, ProviderQuote, UserProfile } from '../types';

interface ClientQuotesComparatorProps {
  request: ServiceRequest;
  onAcceptQuote: (requestId: string, quote: ProviderQuote) => void;
  onOpenMicroPage: (providerId: string) => void;
  onOpenChat: (request: ServiceRequest) => void;
}

export const ClientQuotesComparator: React.FC<ClientQuotesComparatorProps> = ({
  request,
  onAcceptQuote,
  onOpenMicroPage,
  onOpenChat
}) => {
  const quotes = request.quotes || [];

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center animate-pulse">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">Aguardando propostas dos prestadores</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Os profissionais da categoria <strong>{request.category}</strong> já foram notificados sobre o seu pedido de <em>"{request.title}"</em> e estão montando as propostas com valores e horários.
        </p>
      </div>
    );
  }

  // Find lowest price and highest rating for badges
  const lowestPrice = Math.min(...quotes.map((q) => q.price));
  const highestRating = Math.max(...quotes.map((q) => q.providerRating));

  const isAccepted = !!request.selectedQuoteId;
  const acceptedQuote = quotes.find((q) => q.id === request.selectedQuoteId);

  return (
    <div className="space-y-4">
      {/* Top Banner if already accepted */}
      {isAccepted && acceptedQuote && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Contratação Fechada!
              </span>
              <h4 className="text-sm font-bold text-slate-800">
                Você fechou com <strong>{acceptedQuote.providerName}</strong> por R$ {acceptedQuote.price.toFixed(2)}
              </h4>
              <p className="text-xs text-slate-600">
                Agendado para {acceptedQuote.scheduledDate} às {acceptedQuote.scheduledTime}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenChat(request)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Abrir Chat & Rastreamento</span>
          </button>
        </div>
      )}

      {/* Comparison Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Comparador de Orçamentos ({quotes.length} {quotes.length === 1 ? 'proposta' : 'propostas'})
          </h3>
          <p className="text-xs text-slate-500">
            Compare os valores, horários e reputação dos profissionais para escolher o melhor
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.map((quote) => {
          const isSelected = request.selectedQuoteId === quote.id;
          const isBestPrice = quote.price === lowestPrice;
          const isTopRated = quote.providerRating === highestRating;

          return (
            <div
              key={quote.id}
              className={`relative bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              {/* Highlight badge */}
              <div className="absolute -top-2.5 right-4 flex gap-1">
                {isBestPrice && !isSelected && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                    Melhor Preço
                  </span>
                )}
                {isTopRated && !isSelected && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                    Top Avaliado
                  </span>
                )}
                {isSelected && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                    Escolhida por você
                  </span>
                )}
              </div>

              <div>
                {/* Provider info header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="relative">
                    <img
                      src={quote.providerAvatar}
                      alt={quote.providerName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    {quote.providerFacialVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{quote.providerName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        {quote.providerRating}
                      </span>
                      <span>•</span>
                      <span>{quote.providerJobsCount} serviços</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-1.5 py-2.5">
                  {quote.providerFacialVerified && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Biometria Facial
                    </span>
                  )}
                  {quote.providerDocVerified && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-semibold flex items-center gap-1 border border-blue-200">
                      <ShieldCheck className="w-3 h-3" /> Doc Verificado
                    </span>
                  )}
                </div>

                {/* Price & Schedule */}
                <div className="bg-slate-50 rounded-xl p-3 my-2 space-y-1.5 border border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Valor Total:</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      R$ {quote.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {quote.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {quote.scheduledTime} ({quote.estimatedDuration})
                    </span>
                  </div>
                </div>

                {/* Message & Guarantee */}
                <p className="text-xs text-slate-600 italic line-clamp-3 my-2 leading-relaxed">
                  "{quote.message}"
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>{quote.warrantyTerms}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMicroPage(quote.providerId)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ver Micropágina e Avaliações</span>
                </button>

                {isSelected ? (
                  <button
                    onClick={() => onOpenChat(request)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Abrir Chat com {quote.providerName}</span>
                  </button>
                ) : (
                  <button
                    disabled={isAccepted}
                    onClick={() => onAcceptQuote(request.id, quote)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Fechar com este profissional</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
