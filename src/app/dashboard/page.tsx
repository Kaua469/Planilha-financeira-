"use client"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import { StatCard } from "@/components/dashboard/stat-card"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFinancial } from "@/lib/context/financial-context"

export default function DashboardPage() {
  const { context } = useFinancial()
  
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-[#9BA3AF]">
              Contexto Ativo: <span className="text-[#C80313] font-bold uppercase">{context === 'personal' ? '👤 Pessoal' : '🏢 Corporativo'}</span>
            </p>
          </div>
          <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(200,3,19,0.3)] transition-all duration-300 hover:scale-[1.05]">
            <Plus className="mr-2" size={20} />
            ADICIONAR TRANSAÇÃO
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Saldo Pessoal Atual" 
            value="R$ 28.751,45" 
            subtext="Conta Corrente e Poupança" 
            trend={12.5}
          />
          <StatCard 
            title="Receitas" 
            value="R$ 15.200,00" 
            subtext="Este mês" 
            type="income"
            trend={8.2}
          />
          <StatCard 
            title="Despesas" 
            value="R$ 8.450,32" 
            subtext="Este mês" 
            type="expense"
            trend={-3.1}
          />
          <StatCard 
            title="Metas" 
            value="65%" 
            subtext="Carro Novo — R$ 45.000,00" 
            trend={5.0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BalanceChart />
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest text-sm">Insights & Alertas</h3>
            <InsightsCard />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
