import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col items-center justify-center p-6 text-center">
      <Logo className="mb-12 scale-150" />
      
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-[#9BA3AF] bg-clip-text text-transparent">
          A nova era da sua <span className="text-[#C80313]">inteligência financeira.</span>
        </h1>
        
        <p className="text-xl text-[#9BA3AF] max-w-xl mx-auto">
          Gestão pessoal e corporativa em um único ecossistema premium. 
          Performance visual, organização extrema e insights de alto nível.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/login">
            <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white px-8 py-7 rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(200,3,19,0.4)] transition-all hover:scale-105">
              COMEÇAR AGORA
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="border-[#242938] text-white px-8 py-7 rounded-xl text-lg hover:bg-[#151924] transition-all">
              SAIBA MAIS
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 sm:mt-24 w-full max-w-5xl aspect-[4/3] sm:aspect-video rounded-2xl sm:rounded-3xl border border-[#242938] bg-[#0F1117] overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent z-10" />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
        </div>
        <div className="p-4 sm:p-8 lg:p-12 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: 'Receitas', val: 'R$ 12k' },
                { label: 'Despesas', val: 'R$ 4k' },
                { label: 'Metas', val: '85%' },
                { label: 'Saldo', val: 'R$ 8k' }
              ].map((item, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#151924] border border-[#242938] flex flex-col justify-center text-left">
                  <span className="text-[8px] sm:text-[10px] text-[#9BA3AF] uppercase tracking-widest">{item.label}</span>
                  <span className="text-base sm:text-xl font-bold text-white">{item.val}</span>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-3 h-32 sm:h-64 rounded-xl sm:rounded-2xl bg-[#151924] border border-[#242938] p-3 sm:p-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#C80313]/20 to-transparent" />
                <div className="flex justify-between items-end h-full gap-1 sm:gap-2">
                  {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60].map((h, i) => (
                    <div key={i} className="w-full bg-[#C80313]/40 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 h-32 sm:h-64 rounded-xl sm:rounded-2xl bg-[#151924] border border-[#242938] p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-6 sm:h-8 w-full bg-[#0F1117] rounded-lg border border-[#242938]" />
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
