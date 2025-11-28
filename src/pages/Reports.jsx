import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";
import {
  format,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import PrintableReport from "../components/reports/PrintableReport";

const formatSafeDate = (dateString, formatStr = "dd/MM/yyyy") => {
  if (!dateString) return "Data não informada";
  const date = new Date(dateString);
  return isValid(date)
    ? format(date, formatStr, { locale: ptBR })
    : "Data inválida";
};

export default function Reports() {
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("donations");
  const [periodType, setPeriodType] = useState("year");

  const componentToPrintRef = useRef();

  const handlePrint = () => window.print();

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Carregar dados iniciais
  const loadData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const [donationsResponse, beneficiariesResponse] = await Promise.all([
        supabase
          .from("donations")
          .select("*")
          .order("donation_date", { ascending: false }),
        supabase
          .from("beneficiaries")
          .select("*")
          .order("registration_date", { ascending: false }),
      ]);

      if (donationsResponse.error) throw donationsResponse.error;
      if (beneficiariesResponse.error) throw beneficiariesResponse.error;

      setDonations(donationsResponse.data || []);
      setBeneficiaries(beneficiariesResponse.data || []);

      // Buscar dados da organização
      if (user && user.user_metadata?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", user.user_metadata.organization_id)
          .single();

        if (orgError && orgError.code !== "PGRST116") throw orgError;
        setOrganization(orgData || null);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  // 🔹 Filtrar dados
  const getFilteredData = () => {
    const now = new Date();
    const startDate =
      periodType === "year" ? startOfYear(now) : startOfMonth(now);
    const endDate = periodType === "year" ? endOfYear(now) : endOfMonth(now);

    const dataSet = reportType === "donations" ? donations : beneficiaries;
    const dateField =
      reportType === "donations" ? "donation_date" : "registration_date";

    return dataSet.filter((item) => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      return isValid(itemDate) && itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filteredData = getFilteredData();

  return (
    <div className="sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Relatórios e Análises
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere relatórios detalhados para prestação de contas e análise de
            impacto
          </p>
        </div>

        {/* 🔹 Filtros */}
        <div className="bg-white rounded-md border p-4 mb-6 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Tipo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Tipo de Relatório
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="donations">Doações</SelectItem>
                  <SelectItem value="beneficiaries">Beneficiados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Período
              </label>
              <Select value={periodType} onValueChange={setPeriodType}>
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Imprimir */}
            <div className="flex flex-col justify-end">
              <Button
                onClick={handlePrint}
                disabled={loading || filteredData.length === 0}
                className="bg-green-700 hover:bg-green-800 w-full md:w-auto rounded-full"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>

        {/* 🔹 Conteúdo */}
        <Card className="border-1 rounded-md bg-white">
          <CardHeader className="print:hidden px-6 pb-2">
            <CardTitle className="text-md font-bold text-foreground">
              PRÉVIA DO RELATÓRIO
            </CardTitle>
          </CardHeader>
            <CardContent className="pt-0 px-6">
              <PrintableReport
                ref={componentToPrintRef}
                reportType={reportType}
                periodType={periodType}
                data={filteredData}
                organization={organization}
                formatSafeDate={formatSafeDate}
              />
            </CardContent>
        </Card>
      </div>

      {/* 🔹 Print Styles */}
      <style>{`
        @media print {

          /* Remove tudo que é layout fora do relatório */
          body * {
            visibility: hidden !important;
          }

          /* Mostra só o conteúdo imprimível */
          .printable-container, 
          .printable-container * {
            visibility: visible !important;
          }

          /* Garante que o relatório ocupe 100% sem sidebar */
          .printable-container {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Remove sidebar, header, footer e navegação */
          .sidebar,
          aside,
          nav,
          header:not(.printable-container header),
          .header,
          .layout,
          .app-sidebar,
          .app-header {
            display: none !important;
            visibility: hidden !important;
          }
        }

      `}</style>
    </div>
  );
}
