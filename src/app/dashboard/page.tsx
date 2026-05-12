"use client"

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { useFinancial } from '@/lib/context/financial-context'
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { context } = useFinancial()
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    goals: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [context])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      // 1. Buscar todas as transações do contexto
      const { data: transData } = await supabase
        .from('transactions')
        .select('*')
        .eq('context', context)

      // 2. Buscar metas
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('context', context)

      if (transData) {
        const transactions = transData as any[]
        const goals = (goalsData || []) as any[]

        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + Number(t.amount), 0)
        
        const totalExpense = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + Number(t.amount), 0)

        // Cálculo simples de progresso de metas
        let goalsProgress = 0
        if (goals.length > 0) {
          const totalTarget = goals.reduce((acc, g) => acc + Number(g.target_amount), 0)
          const totalCurrent = goals.reduce((acc, g) => acc + Number(g.current_amount), 0)
          goalsProgress = (totalCurrent / totalTarget) * 100
        }

        setStats({
          balance: totalIncome - totalExpense,
          income: totalIncome,
          expense: totalExpense,
          goals: goalsProgress
        })
      }
    } catch (error) {
      toast.error('Erro ao atualizar dashboard')
    }
    setLoading(false)
  }
  
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Visão Geral</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">
              Acompanhando: <span className="text-[#C80313] font-bold uppercase">{context === 'personal' ? '👤 Pessoal' : '🏢 Corporativo'}</span>
            </p>
          </div>
          <AddTransactionDialog />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard 
            title="Saldo Total" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.balance)}
            subtext="Acumulado no período" 
            trend={0}
          />
          <StatCard 
            title="Receitas" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.income)}
            subtext="Entradas totais" 
            type="income"
            trend={0}
          />
          <StatCard 
            title="Despesas" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.expense)}
            subtext="Saídas totais" 
            type="expense"
            trend={0}
          />
          <StatCard 
            title="Metas" 
            value={`${stats.goals.toFixed(0)}%`} 
            subtext="Progresso médio" 
            trend={0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            <BalanceChart />
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest text-[10px]">Sugestões & Alertas</h3>
            <InsightsCard />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
