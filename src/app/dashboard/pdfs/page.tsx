import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function PdfsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial PDFs</h1>
          <p className="text-[#9BA3AF]">Seus documentos e comprovantes exportados.</p>
        </div>

        <Card className="bg-[#151924] border-[#242938] p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
            <FileText size={32} className="text-[#C80313]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">GERENCIADOR DE DOCUMENTOS</h3>
          <p className="text-[#9BA3AF]">Visualize e organize todos os PDFs gerados pelo sistema.</p>
        </Card>
      </div>
    </DashboardShell>
  )
}
