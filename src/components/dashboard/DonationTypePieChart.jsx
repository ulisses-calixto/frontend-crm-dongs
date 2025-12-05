import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const donationTypeNames = {
  monetary: "Monetária",
  food: "Alimentos",
  clothing: "Roupas",
  toys: "Brinquedos",
  books: "Livros",
  electronics: "Eletrônicos",
  medicine: "Medicamentos",
  other: "Outros"
};

const typeColors = {
  monetary: "#16a34a",
  food: "#ea580c",
  clothing: "#2563eb",
  toys: "#db2777",
  books: "#7c3aed",
  electronics: "#4b5563",
  medicine: "#dc2626",
  other: "#ca8a04",
};


export default function DonationTypePieChart({ donations }) {
  const data = useMemo(() => {
    const typeCounts = donations.reduce((acc, donation) => {
      const typeKey = donation.donation_type || "other";
      acc[typeKey] = (acc[typeKey] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).map(([key, value]) => ({
      key,
      name: donationTypeNames[key] || "Outros",
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
                      fill={typeColors[entry.key]}
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
                    border: "1px solid #858585",
                    borderRadius: "4px",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legenda */}
        {data.length > 0 && (
          <div className="pt-0 grid grid-cols-2 gap-2 text-sm">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColors[entry.key] }}
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
