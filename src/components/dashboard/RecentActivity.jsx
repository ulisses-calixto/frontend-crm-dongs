import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

const donationTypeColors = {
  monetary: "bg-green-100 text-green-700",
  food: "bg-orange-100 text-orange-700",
  clothing: "bg-blue-100 text-blue-700",
  toys: "bg-pink-100 text-pink-700",
  books: "bg-purple-100 text-purple-700",
  electronics: "bg-gray-100 text-gray-700",
  medicine: "bg-red-100 text-red-700",
  other: "bg-yellow-100 text-yellow-700",
};

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

const formatSafeDate = (dateString, formatStr = "dd/MM") => {
  if (!dateString) return "Data não informada";
  const date = new Date(dateString);
  return isValid(date)
    ? format(date, formatStr, { locale: ptBR })
    : "Data inválida";
};

export default function RecentActivity({ donations, beneficiaries }) {
  return (
    <Card className="border rounded-2xl bg-white">
      <CardHeader className="px-6 pb-3">
        <CardTitle className="text-lg font-bold text-foreground">
          Atividade Recente
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">

        <div className="space-y-10">
          {/* Últimas Doações */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              Últimas Doações
            </h3>

            <div className="space-y-3">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {donation.donor_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {donation.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${donationTypeColors[donation.donation_type] || donationTypeColors.other} px-3 py-1 rounded-lg`}
                      >
                        {donationTypeNames[donation.donation_type] || donation.donation_type}
                      </Badge>

                      <span className="text-xs text-gray-500">
                        {formatSafeDate(donation.donation_date)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma doação registrada ainda
                </p>
              )}
            </div>
          </div>

          {/* Beneficiados Recentes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              Beneficiados Recentes
            </h3>

            <div className="space-y-3">
              {beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {beneficiary.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Família de {beneficiary.family_size}{" "}
                        {beneficiary.family_size > 1 ? "pessoas" : "pessoa"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-3 py-1 rounded-lg ${
                          beneficiary.priority_level === "high"
                            ? "bg-red-100 text-red-700"
                            : beneficiary.priority_level === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {beneficiary.priority_level === "high"
                          ? "Alta"
                          : beneficiary.priority_level === "medium"
                          ? "Média"
                          : "Baixa"}{" "}
                        prioridade
                      </Badge>

                      <span className="text-xs text-gray-500">
                        {formatSafeDate(beneficiary.registration_date)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhum beneficiado cadastrado ainda
                </p>
              )}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
