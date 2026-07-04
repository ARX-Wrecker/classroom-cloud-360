'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const MOCK_DATA = [
  { month: 'Ene', inscripciones: 30 },
  { month: 'Feb', inscripciones: 52 },
  { month: 'Mar', inscripciones: 41 },
  { month: 'Abr', inscripciones: 78 },
  { month: 'May', inscripciones: 63 },
  { month: 'Jun', inscripciones: 95 },
  { month: 'Jul', inscripciones: 112 },
];

interface Props {
  data?: { month: string; inscripciones: number }[];
}

export function ProgressChart({ data = MOCK_DATA }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="colorInsc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '13px',
          }}
          labelStyle={{ color: '#475569', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="inscripciones"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#colorInsc)"
          dot={{ fill: '#6366f1', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
