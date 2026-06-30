"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, Calendar, FileText } from "lucide-react"
import { Card, CardContent } from '@/components/ui/card'
import { useSubscription } from '@/hooks/useSubscription'
import { PremiumLockOverlay } from '@/components/dashboard/premium-lock-overlay'
import { createClient } from '@/lib/supabase/client'
import { useFinancial } from '@/lib/context/financial-context'
import { toast } from 'sonner'

// Importa dinamicamente para evitar problemas de SSR no Next.js
const PDFDownloadButton = dynamic(
  () => import('@/components/reports/pdf-download-button'),
  { ssr: false }
)

const initialMockReports = [
  { id: 1, month: "Abril", year: "2026", type: "Completo", date: "2026-04-30" },
  { id: 2, month: "Março", year: "2026", type: "Completo", date: "2026-03-31" },
  { id: 3, month: "Fevereiro", year: "2026", type: "Completo", date: "2026-02-28" },
]

export default function ReportsPage() {
  const { isPro, loading: loadingSub } = useSubscription()
  const { context } = useFinancial()
  const supabase = createClient()

  const [transactions, setTransactions] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [reports, setReports] = useState(initialMockReports)
  const [loadingData, setLoadingData] = useState(true)

  // Obtém o mês e ano atual em português
  const currentMonthName = new Date().toLocaleString('pt-BR', { month: 'long' })
  const currentYearStr = new Date().getFullYear().toString()
  const formattedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)

  useEffect(() => {
    if (isPro) {
      fetchData()
    }
  }, [context, isPro])

  async function fetchData() {
    setLoadingData(true)
    try {
      // 1. Busca transações
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('context', context)
        .order('date', { ascending: false })

      if (transError) {
        toast.error('Erro ao buscar transações para o relatório')
      } else {
        setTransactions(transData || [])
      }

      // 2. Busca perfil
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profData)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDelete = (id: number) => {
    setReports(reports.filter(r => r.id !== id))
  }

  // Cálculos reais para o PDF
  const revenue = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const balance = revenue - expenses

  const pdfTransactions = transactions.slice(0, 15).map(t => ({
    date: t.date ? new Date(t.date).toLocaleDateString('pt-BR') : '',
    description: t.description || 'Sem descrição',
    category: t.category || 'Geral',
    amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount),
    type: t.type
  }))

  const pdfData = {
    revenue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenue),
    expenses: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expenses),
    balance: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance),
    growth: revenue > expenses ? "Positivo" : "Atenção",
    transactions: pdfTransactions
  }

  if (loadingSub) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px] text-[#9BA3AF]">
          Carregando informações da assinatura...
        </div>
      </DashboardShell>
    )
  }

  if (!isPro) {
    return (
      <DashboardShell>
        <PremiumLockOverlay featureName="Relatórios Financeiros" />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Relatórios Financeiros</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">Gere e gerencie seus relatórios em PDF com dados em tempo real.</p>
          </div>
          
          {!loadingData && (
            <PDFDownloadButton
              userName={profile?.full_name || 'Usuário'}
              month={formattedMonth}
              year={currentYearStr}
              data={pdfData}
              className="bg-[#C80313] hover:bg-[#E1061B] text-white px-4 sm:px-8 h-11 sm:h-12 rounded-xl shadow-[0_0_20px_rgba(200,3,19,0.3)] text-sm sm:text-base w-full sm:w-auto"
            />
          )}
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
                      {/* Permite baixar o relatório simulado daquele mês com o PDF real baseado nos dados atuais */}
                      <PDFDownloadButton
                        userName={profile?.full_name || 'Usuário'}
                        month={report.month}
                        year={report.year}
                        data={pdfData}
                        buttonText=""
                        className="bg-transparent text-[#9BA3AF] hover:text-white border-0 p-2 hover:bg-[#151924]"
                      />
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
                  <FileText size={32} className="text-[#C80313]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase">Geração Dinâmica de PDF</h3>
                <p className="text-[#9BA3AF] mb-8">Todos os dados que você lança no dashboard são consolidados em tempo real no PDF gerado. Baixe para prestação de contas ou controle pessoal.</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-[#242938] text-white cursor-default">Filtro Inteligente Ativo</Button>
                  <Button variant="outline" className="border-[#242938] text-white cursor-default">Formato A4 PDF</Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
