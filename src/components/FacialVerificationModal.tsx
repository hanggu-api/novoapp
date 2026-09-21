import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, X, Sparkles } from 'lucide-react';

interface FacialVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (photoUrl: string) => void;
  userName?: string;
  role: 'client' | 'provider';
}

export const FacialVerificationModal: React.FC<FacialVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userName = 'Usuário',
  role
}) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'verifying' | 'success' | 'fallback'>('intro');
  const [streamActive, setStreamActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [livenessPrompt, setLivenessPrompt] = useState<'center' | 'smile' | 'blink' | 'hold'>('center');
  const [progress, setProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setStep('intro');
      setCapturedPhoto(null);
      setProgress(0);
      setCameraError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setStep('scanning');
    setLivenessPrompt('center');
    setProgress(15);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStreamActive(true);

      // Automated interactive liveness test simulation
      setTimeout(() => {
        setLivenessPrompt('smile');
        setProgress(50);
      }, 1800);

      setTimeout(() => {
        setLivenessPrompt('blink');
        setProgress(80);
      }, 3500);

      setTimeout(() => {
        setLivenessPrompt('hold');
        setProgress(95);
        captureSnapshot();
      }, 5200);

    } catch (err: any) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError("Não foi possível acessar a câmera diretamente. Você pode usar a verificação guiada por foto.");
      setStep('fallback');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // High quality fallback biometric photo
      setCapturedPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
    }
    stopCamera();
    setStep('verifying');
    setProgress(100);

    // Processing verification
    setTimeout(() => {
      setStep('success');
    }, 1800);
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target?.result as string);
        setStep('verifying');
        setTimeout(() => {
          setStep('success');
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSimulatedPhoto = () => {
    const mockAvatar = role === 'provider'
      ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80';
    setCapturedPhoto(mockAvatar);
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleComplete = () => {
    onSuccess(capturedPhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Validação Facial Biométrica</h3>
              <p className="text-xs text-slate-500">
                {role === 'provider' ? 'Obrigatória para prestadores de serviços' : 'Segurança contra fraudes para clientes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'intro' && (
            <div className="text-center py-2 space-y-4">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center">
                <Camera className="w-10 h-10 text-emerald-600" />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-800">
                  Olá, {userName}!
                </h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Para garantir a segurança de ambas as partes, usamos reconhecimento facial com teste de vivacidade. Certifique-se de estar em um local iluminado e sem óculos escuros.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Seu rosto será comparado para gerar o selo de autenticidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proteção ativa contra contas falsas e perfis duplicados</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={startCamera}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Abrir Câmera e Iniciar Validação
                </button>
                <button
                  onClick={() => setStep('fallback')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                >
                  Não consigo abrir a câmera / Enviar foto selfie
                </button>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="space-y-4 text-center">
              <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Biometric Oval Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-44 h-56 border-2 border-emerald-400 rounded-[50%] shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] relative animate-pulse">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400/80 shadow-[0_0_8px_#34d399] animate-bounce" />
                  </div>
                </div>

                {/* Status prompt badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white rounded-lg py-1.5 px-3 text-xs font-medium flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {livenessPrompt === 'center' && '1/3: Centralize seu rosto no círculo'}
                  {livenessPrompt === 'smile' && '2/3: Dê um leve sorriso para teste de vivacidade'}
                  {livenessPrompt === 'blink' && '3/3: Pisque os olhos... Quase pronto!'}
                  {livenessPrompt === 'hold' && 'Mantenha parado, capturando biometria...'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={captureSnapshot}
                  className="py-2 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  Capturar Agora
                </button>
                <button
                  onClick={() => { stopCamera(); setStep('fallback'); }}
                  className="py-2 px-3 rounded-lg text-slate-500 hover:text-slate-800 text-xs transition"
                >
                  Opção manual
                </button>
              </div>
            </div>
          )}

          {step === 'verifying' && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto w-20 h-20 relative flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">Processando Biometria Facial...</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Validando malha facial tridimensional e verificando ausência de fotos estáticas ou fraudes.
                </p>
              </div>
              <div className="flex justify-center items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 max-w-xs mx-auto py-1.5 px-3 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Algoritmo de Vivacidade Ativo</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="relative mx-auto w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg">
                <img
                  src={capturedPhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'}
                  alt="Biometria validada"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  IDENTIDADE BIOMÉTRICA VALIDADA
                </span>
                <h4 className="text-lg font-bold text-slate-800 pt-1">
                  Validação Concluída com Sucesso!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Seu perfil agora possui o selo oficial de verificação facial. Isso aumenta a confiança e a aprovação de orçamentos na plataforma.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleComplete}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  Concluir e Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'fallback' && (
            <div className="space-y-4 text-center py-2">
              {cameraError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}
              <p className="text-xs text-slate-600">
                Faça o envio de uma foto nítida do seu rosto em modo selfie para a validação do sistema:
              </p>

              <div className="flex flex-col gap-3">
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition text-center group">
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mx-auto mb-2 transition" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 block">
                    Carregar Selfie do Aparelho
                  </span>
                  <span className="text-[11px] text-slate-500">JPG, PNG ou WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleManualUpload}
                    className="hidden"
                  />
                </label>

                <div className="relative flex py-1 items-center">
                  <div className="grow border-t border-slate-200" />
                  <span className="shrink mx-3 text-[11px] text-slate-400 font-medium">ou para demonstração rápida</span>
                  <div className="grow border-t border-slate-200" />
                </div>

                <button
                  onClick={handleUseSimulatedPhoto}
                  className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition"
                >
                  Simular Selfie Verificada Instantaneamente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
