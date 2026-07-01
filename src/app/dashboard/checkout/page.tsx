"use client"

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Sparkles, Copy, CheckCheck, Landmark, QrCode } from "lucide-react";
import { PLAN_DETAILS, PlanType } from '@/types/subscription';
import { paymentService } from '@/services/payment';
import { toast } from 'sonner';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = (searchParams.get('plan') || 'pro') as PlanType;
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPlan] = useState(PLAN_DETAILS[planParam] ? planParam : 'pro');

  const planInfo = PLAN_DETAILS[selectedPlan];
  const pixKey = "kauabiscalchini@gmail.com"; // Chave Pix para recebimento manual livre de taxas

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success('Chave PIX copiada para a área de transferência!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    toast.info('Registrando solicitação de pagamento...');

    const result = await paymentService.processCheckout(selectedPlan);
    
    if (result.success) {
      toast.success('Solicitação enviada! Seu plano será ativado após confirmarmos o PIX.');
      router.push('/dashboard/settings?tab=subscription');
    } else {
      toast.error(result.error || 'Erro ao registrar solicitação');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/settings?tab=subscription" className="text-[#9BA3AF] hover:text-white transition-colors p-2 bg-[#151924] border border-[#242938] rounded-xl">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Finalizar Assinatura</h1>
          <p className="text-sm sm:text-base text-[#9BA3AF]">Adquira seu plano de forma rápida, segura e totalmente livre de taxas extras.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Detalhes do Plano */}
        <Card className="lg:col-span-2 bg-[#151924] border-[#242938] text-white shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C80313] to-red-500" />
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold">{planInfo.name}</CardTitle>
            <CardDescription className="text-[#9BA3AF]">Acesso completo aos recursos</CardDescription>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">{planInfo.price}</span>
              <span className="text-[#9BA3AF] text-sm">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 border-t border-[#242938] space-y-4">
            <ul className="space-y-3">
              {planInfo.features.slice(0, 7).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#F5F7FA]">
                  <Check className="text-emerald-500 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              {planInfo.features.length > 7 && (
                <li className="text-[11px] text-[#9BA3AF] italic">
                  + {planInfo.features.length - 7} recursos adicionais no painel.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Pagamento via Pix (Sem Taxa) */}
        <Card className="lg:col-span-3 bg-[#151924] border-[#242938] text-white shadow-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Landmark size={20} className="text-emerald-500" /> Pagamento via PIX (Sem Taxas)
            </CardTitle>
            <CardDescription className="text-[#9BA3AF]">
              Realize a transferência direta via PIX. Sem taxas de intermediação de gateways.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6 border-t border-[#242938]">
            {/* QR Code Placeholder/Visual */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#0F1117] p-5 rounded-xl border border-[#242938]">
              <div className="bg-white p-3 rounded-lg flex items-center justify-center w-32 h-32 flex-shrink-0">
                <QrCode size={108} className="text-slate-900" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  Taxa R$ 0,00 (Grátis)
                </span>
                <h4 className="font-bold text-white text-sm">Escaneie o QR Code ao lado</h4>
                <p className="text-xs text-[#9BA3AF] leading-relaxed">
                  Abra o app do seu banco, escolha pagar via Pix com QR Code e aponte a câmera para a imagem.
                </p>
              </div>
            </div>

            {/* Copiar Chave Pix */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Ou pague com a Chave PIX (E-mail):</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#0F1117] border border-[#242938] px-4 py-3.5 rounded-xl font-mono text-sm text-white select-all overflow-x-auto whitespace-nowrap scrollbar-thin">
                  {pixKey}
                </div>
                <Button 
                  type="button" 
                  onClick={handleCopyKey}
                  className="bg-[#242938] hover:bg-[#32394e] border border-[#3b435b] text-white px-4 rounded-xl flex items-center justify-center gap-2 flex-shrink-0"
                >
                  {copied ? <CheckCheck size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <Button 
                disabled={loading}
                onClick={handleConfirmPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {loading ? (
                  'REGISTRANDO SOLICITAÇÃO...'
                ) : (
                  <>
                    <Sparkles size={18} /> JÁ FIZ O PAGAMENTO VIA PIX
                  </>
                )}
              </Button>
              <p className="text-[11px] text-[#9BA3AF] text-center">
                Após clicar, seu pagamento será verificado manualmente. O plano Pro será ativado em até 24h após a confirmação do PIX.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div className="text-center text-[#9BA3AF] py-12">Carregando detalhes do pagamento...</div>}>
        <CheckoutContent />
      </Suspense>
    </DashboardShell>
  );
}
