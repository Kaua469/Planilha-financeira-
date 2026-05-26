"use client"

import React, { useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileDown, Clock, Download, Trash2, Calendar } from "lucide-react"
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useFinancial } from '@/lib/context/financial-context'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const { context } = useFinancial()
  const supabase = createClient()
  const [reports, setReports] = useState([
    { id: 1, month: "Mês Atual", year: new Date().getFullYear().toString(), type: "Completo", date: new Date().toISOString().split('T')[0] },
  ])

  const handleExport = async () => {
    setLoading(true)
    try {
      const { data: transData, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('context', context)
        .order('date', { ascending: false })

      if (error) throw error

      if (!transData || transData.length === 0) {
        toast.error('Nenhuma transação encontrada para gerar relatório.')
        setLoading(false)
        return
      }

      const doc = new jsPDF()
      
      doc.setFontSize(20)
      doc.text(`Relatório Financeiro - ${context === 'personal' ? 'Pessoal' : 'Corporativo'}`, 14, 22)
      doc.setFontSize(11)
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30)

      const tableData = transData.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.description,
        t.category,
        t.type === 'income' ? 'Receita' : 'Despesa',
        `R$ ${Number(t.amount).toFixed(2)}`
      ])

      autoTable(doc, {
        startY: 40,
        head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [200, 3, 19] },
      })

      doc.save(`relatorio-${context}-${new Date().getTime()}.pdf`)
      toast.success('Relatório gerado com sucesso!')

      // Adicionar ao histórico local (temporário para visualização)
      const newReport = {
        id: Date.now(),
        month: "Exportado",
        year: new Date().getFullYear().toString(),
        type: "Completo",
        date: new Date().toISOString().split('T')[0]
      }
      setReports([newReport, ...reports])

    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar relatório.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    setReports(reports.filter(r => r.id !== id))
    toast.success('Relatório removido do histórico.')
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
                      <Button variant="ghost" size="icon" className="text-[#9BA3AF] hover:text-[#C80313]" onClick={() => handleDelete(report.id)}>
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

