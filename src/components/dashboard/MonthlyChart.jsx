import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ data }) {
  return (
    <Card className="border bg-white rounded-2xl">
      <CardHeader className="px-6 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Doações por Mês
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 px-6">
        <div className="h-[340px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={300}
            minHeight={300}
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                fontWeight={500}
                tickMargin={10}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                fontWeight={500}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value} doações`, "Quantidade"]}
              />

              {/* Gradiente atualizado para harmonizar com o dashboard */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="donations"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
