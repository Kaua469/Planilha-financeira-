"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

const data = [
  { name: 'Jan', value: 4500 },
  { name: 'Fev', value: 5200 },
  { name: 'Mar', value: 4800 },
  { name: 'Abr', value: 6100 },
  { name: 'Mai', value: 5900 },
  { name: 'Jun', value: 7200 },
]

export function BalanceChart() {
  return (
    <div className="h-[400px] w-full bg-[#151924] border border-[#242938] rounded-2xl p-6 shadow-xl hover:border-[#C80313]/50 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Evolução de Saldo Pessoal</h3>
        <p className="text-sm text-[#9BA3AF]">Valores em Reais (R$)</p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242938" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9BA3AF', fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            width={80}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9BA3AF', fontSize: 11 }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#0F1117' }}
            contentStyle={{ 
              backgroundColor: '#151924', 
              borderColor: '#242938', 
              borderRadius: '12px',
              color: '#F5F7FA'
            }}
            itemStyle={{ color: '#C80313' }}
          />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 0, 0]}
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#C80313" 
                className="hover:fill-[#E1061B] transition-all duration-300 cursor-pointer drop-shadow-[0_0_10px_rgba(200,3,19,0.3)]"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
