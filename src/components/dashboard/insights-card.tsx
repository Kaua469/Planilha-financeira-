import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Calendar, Zap } from "lucide-react"

export function InsightsCard({ transactions = [] }: { transactions?: any[] }) {
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0)
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0)
    
  const currentBalance = totalIncome - totalExpense

  const insights = []

  if (totalExpense > totalIncome) {
    insights.push({ 
      title: "Alerta de Gastos", 
      message: "Suas despesas ultrapassaram suas receitas este mês.", 
      icon: AlertCircle, 
      color: "text-[#C80313]",
      bg: "bg-[#C80313]/10"
    })
  } else if (totalIncome > 0) {
    insights.push({ 
      title: "Boa Economia", 
      message: "Você está economizando bem! Suas receitas são maiores que as despesas.", 
      icon: Zap, 
      color: "text-green-500",
      bg: "bg-green-500/10"
    })
  }

  if (transactions.length > 0) {
    const latestTransaction = transactions[transactions.length - 1]
    insights.push({
      title: "Última Movimentação",
      message: `R$ ${Number(latestTransaction.amount).toFixed(2)} registrado recentemente.`,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    })
  }

  if (insights.length < 3) {
    insights.push({ 
      title: "Organize suas Finanças", 
      message: "Adicione mais contas para que possamos gerar insights precisos.", 
      icon: TrendingUp, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    })
  }

  if (insights.length === 0) {
    insights.push({ 
      title: "Bem-vindo aos Insights", 
      message: "Aguardando movimentações para gerar dicas.", 
      icon: TrendingUp, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {insights.map((insight, idx) => (
        <Card key={idx} className="bg-[#151924] border-[#242938] hover:border-[#C80313]/30 transition-all duration-300">
          <CardContent className="p-4 flex items-start gap-4">
            <div className={`p-2 rounded-lg ${insight.bg} ${insight.color}`}>
              <insight.icon size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{insight.title}</h4>
              <p className="text-xs text-[#9BA3AF]">{insight.message}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

