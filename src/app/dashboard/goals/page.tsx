import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"

export default function GoalsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Goals</h1>
          <p className="text-[#9BA3AF]">Acompanhe suas metas financeiras.</p>
        </div>

        <Card className="bg-[#151924] border-[#242938] p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
            <Target size={32} className="text-[#C80313]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">GERENCIAMENTO DE METAS</h3>
          <p className="text-[#9BA3AF]">Esta funcionalidade está sendo preparada para você.</p>
        </Card>
      </div>
    </DashboardShell>
  )
}
