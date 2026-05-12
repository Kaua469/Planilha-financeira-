"use client"

import React from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileDown, Clock, Download, Trash2, Calendar } from "lucide-react"
import { Card, CardContent } from '@/components/ui/card'

const initialMockReports = [
  { id: 1, month: "Abril", year: "2024", type: "Completo", date: "2024-05-01" },
  { id: 2, month: "Março", year: "2024", type: "Simplificado", date: "2024-04-02" },
  { id: 3, month: "Fevereiro", year: "2024", type: "Completo", date: "2024-03-05" },
]

export default function ReportsPage() {
  const [loading, setLoading] = React.useState(false)
  const [reports, setReports] = React.useState(initialMockReports)

  const handleExport = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Toast notification would go here
    }, 2000)
  }

  const handleDelete = (id: number) => {
    setReports(reports.filter(r => r.id !== id))
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Financial Reports</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">Gere e gerencie seus relatórios em PDF.</p>
          </div>
          <Button 
            onClick={handleExport}
            disabled={loading}
            className="bg-[#C80313] hover:bg-[#E1061B] text-white px-4 sm:px-8 h-11 sm:h-12 rounded-xl shadow-[0_0_20px_rgba(200,3,19,0.3)] text-sm sm:text-base w-full sm:w-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                PROCESSANDO...
              </div>
            ) : (
              <>
                <FileDown className="mr-2" size={20} />
                EXPORTAR PDF MENSAL
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-[#151924] border-[#242938]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[#C80313]" />
                Relatórios Recentes
              </h3>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0F1117] border border-[#242938] hover:border-[#C80313]/30 transition-all">
                    <div>
                      <p className="font-bold text-white">{report.month} {report.year}</p>
                      <p className="text-xs text-[#9BA3AF]">{report.type} • {report.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-[#9BA3AF] hover:text-white">
                        <Download size={18} />
                      </Button>
                      <Button onClick={() => handleDelete(report.id)} variant="ghost" size="icon" className="text-[#9BA3AF] hover:text-[#C80313]">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
                {reports.length === 0 && (
                  <p className="text-center text-[#9BA3AF] py-4">Nenhum relatório encontrado.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-[#151924] border-[#242938]">
             <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
                  <Clock size={32} className="text-[#C80313]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Histórico Completo</h3>
                <p className="text-[#9BA3AF] mb-8">Visualize todos os seus relatórios gerados desde o início da sua conta.</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-[#242938] text-white">Visualizar Todos</Button>
                  <Button variant="outline" className="border-[#242938] text-white">Filtrar por Ano</Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
