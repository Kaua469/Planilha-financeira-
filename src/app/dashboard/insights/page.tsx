import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export default function InsightsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Insights</h1>
          <p className="text-sm sm:text-base text-[#9BA3AF]">Inteligência artificial analisando suas finanças.</p>
        </div>

        <Card className="bg-[#151924] border-[#242938] p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
            <Lightbulb size={32} className="text-[#C80313]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">INSIGHTS INTELIGENTES</h3>
          <p className="text-[#9BA3AF]">Nossa IA está processando seus dados para gerar recomendações.</p>
        </Card>
      </div>
    </DashboardShell>
  )
}
