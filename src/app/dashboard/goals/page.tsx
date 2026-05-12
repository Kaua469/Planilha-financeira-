"use client"

export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, Target, Trash2, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useFinancial } from '@/lib/context/financial-context'

// Barra de progresso customizada
const CustomProgress = ({ value }: { value: number }) => (
  <div className="h-2 w-full bg-[#0F1117] rounded-full overflow-hidden">
    <div 
      className="h-full bg-[#C80313] transition-all duration-500 ease-out" 
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
)

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { context } = useFinancial()
  const supabase = createClient()

  useEffect(() => {
    fetchGoals()
  }, [context])

  async function fetchGoals() {
    setLoading(true)
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('context', context)
      .order('created_at', { ascending: false })

    if (error) toast.error('Erro ao carregar metas')
    else setGoals(data || [])
    setLoading(false)
  }

  async function handleAddGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('goals').insert({
      user_id: user?.id,
      title: formData.get('title'),
      target_amount: parseFloat(formData.get('target') as string),
      current_amount: parseFloat(formData.get('current') as string) || 0,
      deadline: formData.get('deadline'),
      context: context
    })

    if (error) toast.error('Erro ao salvar')
    else {
      toast.success('Meta criada!')
      setOpen(false)
      fetchGoals()
    }
  }

  async function deleteGoal(id: string) {
    if (!window.confirm('Excluir esta meta?')) return
    await supabase.from('goals').delete().eq('id', id)
    fetchGoals()
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Metas Financeiras</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">Defina seus objetivos e acompanhe sua evolução.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(200,3,19,0.3)]">
                <Plus className="mr-2" size={20} /> NOVA META
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#151924] border-[#242938] text-white">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Título do Objetivo</Label>
                  <Input name="title" placeholder="Ex: Viagem, Carro Novo..." className="bg-[#0F1117] border-[#242938]" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor Alvo (R$)</Label>
                    <Input name="target" type="number" step="0.01" className="bg-[#0F1117] border-[#242938]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Atual (R$)</Label>
                    <Input name="current" type="number" step="0.01" defaultValue="0" className="bg-[#0F1117] border-[#242938]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data Limite</Label>
                  <Input name="deadline" type="date" className="bg-[#0F1117] border-[#242938] [color-scheme:dark]" />
                </div>
                <Button type="submit" className="w-full bg-[#C80313] hover:bg-[#E1061B] py-6 mt-4">CRIAR OBJETIVO</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100
            return (
              <div key={goal.id} className="bg-[#151924] border border-[#242938] rounded-2xl p-6 space-y-6 hover:border-[#C80313]/50 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-[#C80313]/10 rounded-xl flex items-center justify-center text-[#C80313]">
                    <Target size={20} />
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-[#9BA3AF] hover:text-[#C80313] opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                  <p className="text-sm text-[#9BA3AF]">Vence em: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9BA3AF]">Progresso</span>
                    <span className="text-white font-bold">{progress.toFixed(0)}%</span>
                  </div>
                  <CustomProgress value={progress} />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-[#9BA3AF] uppercase font-bold tracking-widest">Atual</p>
                    <p className="text-lg font-bold text-emerald-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.current_amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#9BA3AF] uppercase font-bold tracking-widest">Meta</p>
                    <p className="text-lg font-bold text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.target_amount)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
