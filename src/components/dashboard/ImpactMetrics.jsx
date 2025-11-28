import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Gift } from "lucide-react";

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

export default function ImpactMetrics({ donations, beneficiaries }) {
  const topDonationType = useMemo(() => {
    if (donations.length === 0) return "N/A";
    const types = {};
    donations.forEach((donation) => {
      types[donation.donation_type] =
        (types[donation.donation_type] || 0) + 1;
    });
    const topType = Object.entries(types).sort((a, b) => b[1] - a[1])[0];
    return topType ? donationTypeNames[topType[0]] || topType[0] : "N/A";
  }, [donations]);

  const familiesImpacted = useMemo(() => {
    return beneficiaries.reduce(
      (sum, beneficiary) => sum + (beneficiary.family_size || 1),
      0
    );
  }, [beneficiaries]);

  const distributionRate = useMemo(() => {
    if (donations.length === 0) return "0%";
    const distributed = donations.filter(
      (d) =>
        d.status === "fully_distributed" ||
        d.status === "partially_distributed"
    ).length;
    return `${((distributed / donations.length) * 100).toFixed(0)}%`;
  }, [donations]);

  const metrics = [
    {
      label: "Tipo Mais Doado",
      value: topDonationType,
      icon: Gift,
      color: "text-blue-700",
    },
    {
      label: "Vidas Impactadas",
      value: familiesImpacted,
      icon: Users,
      color: "text-emerald-700",
    },
    {
      label: "Taxa de Distribuição",
      value: distributionRate,
      icon: Award,
      color: "text-violet-700",
    },
  ];

  return (
    <Card className="border bg-white rounded-md">
      <CardHeader className="px-6 pb-1">
        <CardTitle className="text-md font-bold text-foreground">
          MÉTRICAS DE IMPACTO
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">

        {/* MÉTRICAS */}
        <div
          className="
            flex flex-col
            md:flex-row md:items-center md:justify-between
            md:divide-x md:divide-border
            gap-6 md:gap-0
          "
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="
                  flex items-center justify-between
                  md:flex-1 md:justify-center
                  gap-3 md:gap-4
                "
              >
                <Icon className={`w-5 h-5 ${metric.color}`} />

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {metric.label}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {metric.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* IMPACTO SOCIAL */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm font-semibold text-blue-700 block mb-1">
            Impacto Social
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A organização já alcançou <b>{familiesImpacted}</b> vidas através de{" "}
            <b>{donations.length}</b> atos generosos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
