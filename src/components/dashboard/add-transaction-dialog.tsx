"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useFinancial } from '@/lib/context/financial-context'

export function AddTransactionDialog() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState('pix')
  const { context } = useFinancial()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const type = formData.get('type') as 'income' | 'expense'
    const method = formData.get('payment_method') as string
    const installments = parseInt(formData.get('installments') as string || '1')
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0]

    const { data: { user } } = await supabase.auth.getUser()

    const { data: transData, error } = await supabase.from('transactions').insert({
      user_id: user?.id,
      amount,
      description,
      type,
      context,
      payment_method: method,
      installments: method === 'credit' ? installments : 1,
      date: date
    }).select()

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
    } else {
      // Se for crédito, gera as parcelas automaticamente
      if (method === 'credit' && transData) {
        const instList = []
        const baseAmount = amount / installments
        
        for (let i = 1; i <= installments; i++) {
          // Usa a data selecionada como base para as parcelas
          const dueDate = new Date(date + 'T12:00:00')
          dueDate.setMonth(dueDate.getMonth() + i)
          
          instList.push({
            transaction_id: transData[0].id,
            user_id: user?.id,
            description: `${description} (${i}/${installments})`,
            amount: baseAmount,
            installment_number: i,
            total_installments: installments,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pending',
            context: context
          })
        }
        
        const { error: instError } = await supabase.from('installments').insert(instList)
        if (instError) toast.error('Erro ao gerar parcelas: ' + instError.message)
      }

      toast.success('Transação registrada!')
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(200,3,19,0.3)] transition-all duration-300 hover:scale-[1.05]">
          <Plus className="mr-2" size={20} />
          ADICIONAR
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#151924] border-[#242938] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input name="description" placeholder="Ex: Aluguel ou Venda" className="bg-[#0F1117] border-[#242938]" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input name="amount" type="number" step="0.01" placeholder="0.00" className="bg-[#0F1117] border-[#242938]" required />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select name="type" className="w-full bg-[#0F1117] border border-[#242938] rounded-md h-10 px-3 outline-none focus:border-[#C80313]">
                <option value="expense">Despesa (Saída)</option>
                <option value="income">Receita (Entrada)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Data da Transação</Label>
            <Input 
              name="date" 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]} 
              className="bg-[#0F1117] border-[#242938] text-white [color-scheme:dark]" 
              required 
            />
          </div>

          
          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <select 
              name="payment_method" 
              className="w-full bg-[#0F1117] border border-[#242938] rounded-md h-10 px-3 outline-none focus:border-[#C80313]"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="pix">PIX</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="debit">Cartão de Débito</option>
              <option value="cash">Dinheiro</option>
            </select>
          </div>

          {paymentMethod === 'credit' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label>Número de Parcelas</Label>
              <Input name="installments" type="number" min="1" defaultValue="1" className="bg-[#0F1117] border-[#242938]" required />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#C80313] hover:bg-[#E1061B] py-6 mt-4 font-bold">
            {loading ? 'SALVANDO...' : 'CONFIRMAR'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
