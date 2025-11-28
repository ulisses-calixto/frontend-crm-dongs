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
    <Card className="border bg-white rounded-md">
      <CardHeader className="px-6 py-0">
        <CardTitle className="text-md font-bold text-foreground">
          DOAÇÕES MENSAIS
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
                  border: "1px solid #858585",
                  borderRadius: "4px",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.377)",
                }}
                formatter={(value) => [`${value} doações`, "Quantidade"]}
              />

              {/* Gradiente atualizado para harmonizar com o dashboard */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="donations"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
