"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, AlertCircle, Calendar } from "lucide-react"
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

export default function PdfsPage() {
  const { isPro, loading: loadingSub } = useSubscription()
  const { context } = useFinancial()
  const supabase = createClient()

  const [transactions, setTransactions] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isPro) {
      fetchData()
    }
  }, [context, isPro])

  async function fetchData() {
    setLoadingData(true)
    try {
      // 1. Busca todas as transações
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('context', context)
        .order('date', { ascending: false })

      if (transError) {
        toast.error('Erro ao buscar dados das transações')
      } else {
        setTransactions(transData || [])
      }

      // 2. Busca informações do perfil do usuário
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

  // Agrupar transações por mês/ano para gerar a lista de PDFs geráveis
  const getGroupedMonths = () => {
    const groups: Record<string, { month: string; year: string; transactions: any[] }> = {}

    transactions.forEach(t => {
      if (!t.date) return
      // Corrige timezone na conversão de string YYYY-MM-DD para Date
      const dateParts = t.date.split('-')
      let dateObj = new Date()
      if (dateParts.length === 3) {
        dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
      } else {
        dateObj = new Date(t.date)
      }
      
      const monthName = dateObj.toLocaleString('pt-BR', { month: 'long' })
      const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
      const yearStr = dateObj.getFullYear().toString()
      const key = `${formattedMonth} ${yearStr}`

      if (!groups[key]) {
        groups[key] = {
          month: formattedMonth,
          year: yearStr,
          transactions: []
        }
      }
      groups[key].transactions.push(t)
    })

    return Object.values(groups)
  }

  const groupedMonths = getGroupedMonths()

  // Prepara os dados de receita/despesa consolidados do grupo/mês
  const getPdfDataForGroup = (groupTransactions: any[]) => {
    const revenue = groupTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0)

    const expenses = groupTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0)

    const balance = revenue - expenses

    const formattedTransactions = groupTransactions.slice(0, 15).map(t => ({
      date: t.date ? new Date(t.date + 'T12:00:00').toLocaleDateString('pt-BR') : '',
      description: t.description || 'Sem descrição',
      category: t.category || 'Geral',
      amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount),
      type: t.type
    }))

    return {
      revenue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenue),
      expenses: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expenses),
      balance: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance),
      growth: revenue > expenses ? "Positivo" : "Atenção",
      transactions: formattedTransactions
    }
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
        <PremiumLockOverlay featureName="PDFs Financeiros" />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">PDFs Financeiros</h1>
          <p className="text-sm sm:text-base text-[#9BA3AF]">Exporte relatórios consolidados em PDF das suas movimentações mensais.</p>
        </div>

        {loadingData ? (
          <div className="text-center text-[#9BA3AF] py-12">Carregando seus documentos...</div>
        ) : groupedMonths.length === 0 ? (
          <Card className="bg-[#151924] border-[#242938] p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
              <FileText size={32} className="text-[#9BA3AF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">NENHUM PDF DISPONÍVEL</h3>
            <p className="text-[#9BA3AF] max-w-md">
              Para gerar os PDFs de relatórios mensais, você precisa cadastrar pelo menos uma transação no sistema.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedMonths.map((group, idx) => {
              const pdfData = getPdfDataForGroup(group.transactions)
              return (
                <Card key={idx} className="bg-[#151924] border-[#242938] hover:border-[#C80313]/30 transition-all shadow-xl">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-[#C80313] flex-shrink-0">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">Relatório Mensal</h4>
                        <p className="text-sm text-[#9BA3AF] flex items-center gap-1.5 mt-0.5">
                          <Calendar size={14} />
                          {group.month} de {group.year}
                        </p>
                      </div>
                    </div>
                    
                    <PDFDownloadButton
                      userName={profile?.full_name || 'Usuário'}
                      month={group.month}
                      year={group.year}
                      data={pdfData}
                      buttonText=""
                      className="bg-[#242938] hover:bg-[#C80313] text-white p-3 rounded-xl border-0 flex items-center justify-center h-12 w-12 hover:shadow-[0_0_15px_rgba(200,3,19,0.3)] transition-all flex-shrink-0"
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="bg-[#0F1117] border border-[#242938] p-6 rounded-2xl flex gap-4 text-sm text-[#9BA3AF] items-start">
          <AlertCircle className="text-[#C80313] w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-white mb-1">Sobre os PDFs exportados</h5>
            <p className="leading-relaxed">
              Os PDFs são gerados inteiramente no seu navegador de forma segura. A tabela de transações do PDF exibe até 15 lançamentos ordenados cronologicamente, juntamente com o balanço geral e os insights inteligentes calculados para o respectivo período.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
