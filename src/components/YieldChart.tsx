import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface YieldChartProps {
  investment: number;
  apy: number;
}

export function YieldChart({ investment = 100, apy = 5.25 }: YieldChartProps) {
  // Generate projected yield data over 12 months
  const data = Array.from({ length: 13 }, (_, month) => {
    const monthlyRate = apy / 100 / 12;
    const projectedValue = investment * Math.pow(1 + monthlyRate, month);
    const earnings = projectedValue - investment;
    
    return {
      month: month === 0 ? 'Now' : `M${month}`,
      value: Number(projectedValue.toFixed(2)),
      earnings: Number(earnings.toFixed(2)),
    };
  });

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Projected Yield</h3>
          <p className="text-sm text-muted-foreground">
            ${investment} invested at {apy}% APY
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            ${data[12]?.value.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            +${data[12]?.earnings.toFixed(2)} earnings
          </p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(220, 20%, 25%)" 
              vertical={false} 
            />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `$${v}`}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(220, 20%, 14%)',
                border: '1px solid hsl(220, 20%, 25%)',
                borderRadius: '8px',
                color: 'hsl(0, 0%, 98%)',
              }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === 'value' ? 'Portfolio Value' : 'Earnings'
              ]}
              labelFormatter={(label) => `${label === 'Now' ? 'Initial' : label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#yieldGradient)"
              name="value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Portfolio Growth</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Compounded Monthly
        </div>
      </div>
    </div>
  );
}
