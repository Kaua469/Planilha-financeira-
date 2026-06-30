"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';

interface PremiumLockOverlayProps {
  featureName: string;
}

export function PremiumLockOverlay({ featureName }: PremiumLockOverlayProps) {
  const router = useRouter();

  return (
    <div className="min-h-[400px] w-full bg-[#151924]/60 backdrop-blur-md border border-[#242938] rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl relative overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C80313]/10 blur-[80px] rounded-full -z-10" />

      <div className="w-16 h-16 bg-[#C80313]/10 border border-[#C80313]/30 rounded-2xl flex items-center justify-center text-[#C80313] mb-6 shadow-[0_0_15px_rgba(200,3,19,0.15)] animate-bounce">
        <Lock size={28} />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Acesso Bloqueado
      </h2>
      
      <p className="text-[#9BA3AF] text-sm sm:text-base max-w-md mt-3">
        O recurso <span className="text-white font-bold">{featureName}</span> é exclusivo para assinantes do <span className="text-[#C80313] font-bold">Plano Pro</span>.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-sm justify-center">
        <Button 
          onClick={() => router.push('/dashboard/settings?tab=subscription')}
          className="bg-[#C80313] hover:bg-[#E1061B] text-white px-8 py-6 rounded-xl font-bold w-full sm:w-auto shadow-[0_0_20px_rgba(200,3,19,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> VER PLANOS
        </Button>
        <Button 
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="border-[#242938] text-white hover:bg-[#151924] px-8 py-6 rounded-xl font-bold w-full sm:w-auto"
        >
          VOLTAR AO INÍCIO
        </Button>
      </div>
    </div>
  );
}
