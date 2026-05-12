import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtext: string
  trend?: number
  type?: 'default' | 'income' | 'expense'
}

export function StatCard({ title, value, subtext, trend, type = 'default' }: StatCardProps) {
  return (
    <Card className="bg-[#151924] border-[#242938] overflow-hidden group hover:border-[#C80313] transition-all duration-300 shadow-xl">
      <CardContent className="p-6 relative">
        <div className="space-y-1">
          <p className="text-[10px] sm:text-sm font-medium text-[#9BA3AF] uppercase tracking-wider">{title}</p>
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</h3>
          <p className="text-[10px] sm:text-xs text-[#AFAFAF] hidden sm:block">{subtext}</p>
        </div>
        
        {trend !== undefined && (
          <div className={cn(
            "absolute right-6 top-6 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend > 0 ? "bg-green-500/10 text-green-500" : "bg-[#C80313]/10 text-[#C80313]"
          )}>
            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}

        {type !== 'default' && (
          <div className={cn(
            "absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:h-2",
            type === 'income' ? "bg-green-500 w-1/3" : "bg-[#C80313] w-2/3"
          )} />
        )}
      </CardContent>
    </Card>
  )
}
