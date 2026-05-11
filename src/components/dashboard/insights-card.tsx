import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Calendar, Zap } from "lucide-react"

export function InsightsCard() {
  const insights = [
    { 
      title: "Insight de Gastos", 
      message: "Você gastou 18% mais em restaurantes este mês.", 
      icon: TrendingUp, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      title: "Meta de Economia", 
      message: "Sua economia aumentou em relação ao mês anterior.", 
      icon: Zap, 
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    { 
      title: "Alerta de Fatura", 
      message: "Gasto em Restaurantes excedeu o limite mensal.", 
      icon: AlertCircle, 
      color: "text-[#C80313]",
      bg: "bg-[#C80313]/10"
    },
    { 
      title: "Próxima Parcela", 
      message: "Meta Carro Novo evoluiu 12% este mês.", 
      icon: Calendar, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
  ]

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
