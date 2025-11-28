import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#0094d8",
  "#8250f7",
  "#00b176",
  "#f97316",
  "#ec4899",
  "#64748b",
];

const donationTypeNames = {
  monetary: "Monetária",
  food: "Alimentos",
  clothing: "Roupas",
  toys: "Brinquedos",
  books: "Livros",
  electronics: "Eletrônicos",
  medicine: "Medicamentos",
  other: "Outros",
};

export default function DonationTypePieChart({ donations }) {
  const data = useMemo(() => {
    const typeCounts = donations.reduce((acc, donation) => {
      const typeName = donationTypeNames[donation.donation_type] || "Outros";
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [donations]);

  return (
    <Card className="border bg-white rounded-md">
      <CardHeader className="px-6 py-0">
        <CardTitle className="text-md font-bold text-foreground">
          TIPOS DE DOAÇÃO
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-[250px] w-full flex items-center justify-center">
          {data.length === 0 ? (
            <p className="text-muted-foreground">Aguardando dados...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  labelLine={false}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${((value / donations.length) * 100).toFixed(
                      0
                    )}%)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legenda */}
        {data.length > 0 && (
          <div className="pt-3 grid grid-cols-2 gap-2 text-sm">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
