"use client"

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { useFinancial } from '@/lib/context/financial-context'
import { createClient } from '@/lib/supabase/client'

export default function InsightsPage() {
  const { context } = useFinancial()
  const [transactionsData, setTransactionsData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchInsights() {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('context', context)
        .order('date', { ascending: true })

      if (data) {
        setTransactionsData(data)
      }
    }
    fetchInsights()
  }, [context, supabase])

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Insights</h1>
          <p className="text-sm sm:text-base text-[#9BA3AF]">Inteligência artificial analisando suas finanças.</p>
        </div>

        <Card className="bg-[#151924] border-[#242938] p-12 flex flex-col items-center justify-center text-center mb-8">
          <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
            <Lightbulb size={32} className="text-[#C80313]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">INSIGHTS INTELIGENTES</h3>
          <p className="text-[#9BA3AF]">Aqui estão algumas análises sobre a sua movimentação no {context === 'personal' ? 'Pessoal' : 'Corporativo'}.</p>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Suas Análises</h2>
          <InsightsCard transactions={transactionsData} />
        </div>
      </div>
    </DashboardShell>
  )
}

