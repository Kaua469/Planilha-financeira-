import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, Brain, ArrowLeft } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      title: "Segurança Enterprise",
      desc: "Proteção de dados com criptografia de ponta a ponta e autenticação robusta via Supabase.",
      icon: Shield
    },
    {
      title: "Alta Performance",
      desc: "Interface ultra-rápida construída com Next.js 15 e Turbopack para uma experiência sem lags.",
      icon: Zap
    },
    {
      title: "Inteligência Financeira",
      desc: "Insights automáticos e relatórios detalhados para você tomar decisões baseadas em dados.",
      icon: Brain
    }
  ]

  return (
    <div className="min-h-screen bg-[#07090D] text-white p-8 md:p-24">
      <div className="max-w-5xl mx-auto space-y-24">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" className="text-[#9BA3AF] hover:text-white">
              <ArrowLeft className="mr-2" size={18} /> Voltar
            </Button>
          </Link>
        </div>

        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Elevando o padrão da sua <span className="text-[#C80313]">gestão financeira.</span>
          </h1>
          <p className="text-xl text-[#9BA3AF]">
            O Kadron Finance não é apenas uma planilha. É um ecossistema completo para quem exige organização extrema e performance visual.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-[#151924] border border-[#242938] hover:border-[#C80313]/50 transition-all group">
              <div className="w-12 h-12 bg-[#C80313]/10 rounded-xl flex items-center justify-center text-[#C80313] mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-[#9BA3AF] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-3xl bg-gradient-to-br from-[#151924] to-[#07090D] border border-[#242938] text-center space-y-8">
          <h2 className="text-3xl font-bold">Pronto para assumir o controle?</h2>
          <Link href="/register">
            <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white px-8 py-6 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(200,3,19,0.3)]">
              CRIAR MINHA CONTA AGORA
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
