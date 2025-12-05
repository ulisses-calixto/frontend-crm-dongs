import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

const donationTypeColors = {
  monetary: "bg-green-600 text-green-100",
  food: "bg-orange-600 text-orange-100",
  clothing: "bg-blue-600 text-blue-100",
  toys: "bg-pink-600 text-pink-100",
  books: "bg-purple-600 text-purple-100",
  electronics: "bg-gray-600 text-slate-100",
  medicine: "bg-red-600 text-red-100",
  other: "bg-yellow-600 text-yellow-100",
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

/* 🔥 Correção do bug de datas voltando 1 dia */
const formatSafeDate = (dateString, formatStr = "dd/MM") => {
  if (!dateString) return "Data não informada";
  
  const date = new Date(dateString);
  if (!isValid(date)) return "Data inválida";

  // Corrige conversão UTC ➝ Local sem perder o dia
  const localDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  return format(localDate, formatStr, { locale: ptBR });
};

export default function RecentActivity({ donations, beneficiaries }) {
  return (
    <Card className="border rounded-md bg-white">
      <CardHeader className="px-6">
        <CardTitle className="text-md font-bold text-foreground">
          ATIVIDADE RECENTE
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">
        <div className="space-y-8">

          {/* Últimas Doações */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">
              ÚLTIMAS DOAÇÕES
            </h3>

            <div className="space-y-3">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-white border-b rounded-md"
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
                        className={`${donationTypeColors[donation.donation_type] || donationTypeColors.other} px-3 rounded-md`}
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
                  Nenhuma doação registrada
                </p>
              )}
            </div>
          </div>

          {/* Beneficiados recentes */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">
              BENEFICIADOS RECENTES
            </h3>

            <div className="space-y-3">
              {beneficiaries.length > 0 ? (
                beneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="flex items-center justify-between p-4 bg-white border-b rounded-md"
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
                        className={`px-3 rounded-md ${
                          beneficiary.priority_level === "high"
                            ? "bg-red-600 text-red-100"
                            : beneficiary.priority_level === "medium"
                            ? "bg-yellow-600 text-yellow-100"
                            : "bg-blue-600 text-blue-100"
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
                  Nenhum beneficiado cadastrado
                </p>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
