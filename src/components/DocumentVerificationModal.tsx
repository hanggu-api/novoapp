import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Upload, X, ArrowRight, Sparkles } from 'lucide-react';

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (docType: 'RG' | 'CNH', docPhotoUrl: string) => void;
  providerName: string;
}

export const DocumentVerificationModal: React.FC<DocumentVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  providerName
}) => {
  const [docType, setDocType] = useState<'RG' | 'CNH'>('CNH');
  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoDoc = () => {
    setDocPhoto('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80');
  };

  const processDocument = () => {
    if (!docPhoto) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess(docType, docPhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Validação de Documento Pessoal</h3>
              <p className="text-xs text-slate-500">Exigência para prestadores de serviços profissionais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!isVerified && !isVerifying && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>{providerName}</strong>, para liberar o recebimento de pedidos de clientes e ativar sua <strong>micropágina aberta</strong>, envie a foto do seu documento oficial.
                </p>
              </div>

              {/* Document Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Escolha o documento a enviar:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDocType('CNH')}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      docType === 'CNH'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>CNH (Carteira de Motorista)</span>
                    {docType === 'CNH' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType('RG')}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      docType === 'RG'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>RG (Identidade Civil)</span>
                    {docType === 'RG' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Document Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Foto do Documento Aberto ou Frente/Verso:
                </label>

                {docPhoto ? (
                  <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group aspect-video flex items-center justify-center">
                    <img
                      src={docPhoto}
                      alt="Documento enviado"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        onClick={() => setDocPhoto(null)}
                        className="py-1.5 px-3 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                      >
                        Trocar Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition text-center flex flex-col items-center justify-center gap-2 group">
                      <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-600 transition" />
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                        Clique para tirar foto ou carregar arquivo
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Foto nítida com números e foto visíveis
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleUseDemoDoc}
                      className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition text-center"
                    >
                      Usar foto de documento modelo para teste
                    </button>
                  </div>
                )}
              </div>

              <button
                disabled={!docPhoto}
                onClick={processDocument}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Validar Documento com OCR de Segurança</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {isVerifying && (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center border-2 border-dashed border-blue-400 animate-spin">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Verificando Autenticidade do {docType}...</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto pt-1">
                  Checando legibilidade dos dados, caracteres de segurança e cruzamento com a biometria facial.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auditoria Automática de Cadastro</span>
              </div>
            </div>
          )}

          {isVerified && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  DOCUMENTO APROVADO & VERIFICADO
                </span>
                <h4 className="text-lg font-bold text-slate-800 pt-2">
                  Cadastro de Prestador Homologado!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto pt-1">
                  O {docType} foi validado. O selo <strong>"Profissional Verificado"</strong> aparecerá na sua micropágina aberta e em todos os seus orçamentos enviados aos clientes.
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
              >
                Concluir e Acessar Painel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
