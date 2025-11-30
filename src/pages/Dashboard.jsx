import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";

import { HandHeart, Users, DollarSign, Gift } from "lucide-react";
import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCard from "@/components/dashboard/StatsCard";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ImpactMetrics from "@/components/dashboard/ImpactMetrics";
import DonationTypePieChart from "@/components/dashboard/DonationTypePieChart";

export default function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      const organization_id = profile?.organization_id;
      if (!organization_id) {
        setLoading(false);
        return;
      }

      const { data: statsData } = await supabase.rpc(
        "get_dashboard_stats",
        { p_organization_id: organization_id }
      );
      setStats(statsData?.[0] || {});

      const [{ data: donationsData }, { data: beneficiariesData }] =
        await Promise.all([
          supabase.from("donations").select("*").eq("organization_id", organization_id),
          supabase.from("beneficiaries").select("*").eq("organization_id", organization_id),
        ]);

      setDonations(donationsData || []);
      setBeneficiaries(beneficiariesData || []);

      const { data: orgData } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", organization_id)
        .single();
      setOrganization(orgData);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(currentYear, 0, 1)),
      end: endOfYear(new Date(currentYear, 11, 31)),
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthDonations = donations.filter((donation) => {
        if (!donation.donation_date) return false;
        const d = new Date(donation.donation_date);
        return isValid(d) && d >= monthStart && d <= monthEnd;
      });

      return {
        month: format(month, "MMM", { locale: ptBR }),
        donations: monthDonations.length,
      };
    });
  }, [donations]);

  const totalDonationValue = useMemo(
    () => donations.reduce((sum, d) => sum + (d.value || 0), 0),
    [donations]
  );

  const distributedDonationsCount = useMemo(
    () =>
      donations.filter(
        (d) =>
          d.status === "fully_distributed" ||
          d.status === "partially_distributed"
      ).length,
    [donations]
  );

  const thisMonthDonationsCount = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return donations.filter((d) => {
      const date = new Date(d.donation_date);
      return isValid(date) && date >= monthStart && date <= monthEnd;
    }).length;
  }, [donations]);

  const activeBeneficiariesCount = useMemo(
    () => beneficiaries.filter((b) => b.status === "active").length,
    [beneficiaries]
  );

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted-foreground/10 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto space-y-10">

        {/*Cabeçalho*/}
        <header className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-foreground">Painel de Controle</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe as métricas da{" "}
            <strong>{organization?.name || "sua organização"}</strong>.
          </p>
        </header>
        
        {/*Componentes*/}
        {/*Cards*/}
        <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total de Doações"
            value={donations.length}
            icon={Gift}
            color="blue"
            trend={`+${thisMonthDonationsCount} este mês`}
          />

          <StatsCard
            title="Valor Total"
            value={`R$ ${totalDonationValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={DollarSign}
            color="green"
            trend="Doações monetárias acumuladas"
          />

          <StatsCard
            title="Beneficiados Ativos"
            value={activeBeneficiariesCount}
            icon={Users}
            color="purple"
            trend={`${beneficiaries.length} cadastrados`}
          />

          <StatsCard
            title="Doações Distribuídas"
            value={distributedDonationsCount}
            icon={HandHeart}
            color="pink"
            trend={`${(
              (distributedDonationsCount / (donations.length || 1)) *
              100
            ).toFixed(0)}% do total`}
          />
        </section>

        {/*Gráfico mesnal*/}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyChart data={monthlyData} />
          </div>
          <DonationTypePieChart donations={donations} />
        </section>

        {/*Métricas de impacto*/}
        <ImpactMetrics donations={donations} beneficiaries={beneficiaries} />

        {/*Atividades recentes*/}
        <RecentActivity
          donations={donations.slice(0, 5)}
          beneficiaries={beneficiaries.slice(0, 3)}
        />

      </div>
    </div>
  );
}
