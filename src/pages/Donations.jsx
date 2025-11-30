import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import DonationForm from "../components/donations/DonationForm";
import DonationList from "../components/donations/DonationList";
import DonationFilters from "../components/donations/DonationFilters";
import DistributionForm from "../components/donations/DistributionForm";
import DeleteConfirmationDialog from "../components/shared/DeleteConfirmationDialog";

import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} from "@/services/donations";

import { createDistribution } from "@/services/distributions";

import { supabase } from "@/lib/supabase";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDistributionForm, setShowDistributionForm] = useState(false);

  const [editingDonation, setEditingDonation] = useState(null);
  const [donationToDistribute, setDonationToDistribute] = useState(null);
  const [donationToDelete, setDonationToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "all", status: "all" });

  // Carregamento inicial
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const donationsData = await getDonations();

      const { data: beneficiariesData, error: bError } = await supabase
        .from("beneficiaries")
        .select("*")
        .order("name", { ascending: true });

      if (bError) throw bError;

      setDonations(donationsData || []);
      setBeneficiaries(beneficiariesData || []);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const reloadDonations = async () => {
    try {
      const data = await getDonations();
      setDonations(data || []);
    } catch {
      toast.error("Não foi possível atualizar a lista.");
    }
  };

  //Formulario
  const handleFormSubmit = async (donationData) => {
    try {
      const payload = {
        ...donationData,
        value: parseFloat(donationData.value || 0),
        quantity: parseInt(donationData.quantity || 0),
        remaining_quantity: parseInt(
          donationData.remaining_quantity || donationData.quantity || 0
        ),
      };

      if (editingDonation) {
        await updateDonation(editingDonation.id, payload);
        toast.success("Doação atualizada com sucesso!");
      } else {
        await createDonation(payload);
        toast.success("Doação registrada!");
      }

      setShowForm(false);
      setEditingDonation(null);
      reloadDonations();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a doação.");
    }
  };

  //Confirmação do deletar
  const confirmDelete = async () => {
    if (!donationToDelete) return;

    try {
      await deleteDonation(donationToDelete.id);
      toast.success("Doação excluída.");
      setDonationToDelete(null);
      reloadDonations();
    } catch {
      toast.error("Erro ao excluir doação.");
    }
  };

  //Distribuição
  const handleDistributionSubmit = async (distributionData) => {
    try {
      const { donation_id, quantity } = distributionData;
      const donation = donations.find((d) => d.id === donation_id);

      if (!donation) return;

      if (quantity > donation.remaining_quantity) {
        toast.error("Quantidade excede o estoque.");
        return;
      }

      await createDistribution(distributionData);

      const newRemaining = donation.remaining_quantity - quantity;
      const newStatus =
        newRemaining > 0 ? "partially_distributed" : "fully_distributed";

      await updateDonation(donation.id, {
        remaining_quantity: newRemaining,
        status: newStatus,
      });

      toast.success("Distribuição registrada!");
      setShowDistributionForm(false);
      setDonationToDistribute(null);
      reloadDonations();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar distribuição.");
    }
  };

  //Lista filtrada
  const filteredDonations = donations.filter((d) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      (d.donor_name || "").toLowerCase().includes(s) ||
      (d.description || "").toLowerCase().includes(s);

    const matchesType =
      filters.type === "all" || d.donation_type === filters.type;

    const matchesStatus =
      filters.status === "all" || d.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="sm:p-6 md:p-8">
      <div className="mx-auto space-y-10">

        {/*Cabeçalho principal*/}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestão de Doações
            </h1>
            <p className="text-muted-foreground mt-1">
              Distribua e acompanhe as doações recebidas.
            </p>
          </div>

          <Button
            className="flex items-center bg-blue-700 hover:bg-blue-900 gap-2 px-6 py-5 rounded-md"
            onClick={() => {
              setEditingDonation(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5" /> Nova Doação
          </Button>
        </div>

        {/*Cabeçalho filtro*/}
        <div className="bg-white rounded-md border p-4 mb-6">
          <DonationFilters
            filters={filters}
            searchTerm={searchTerm}
            onFiltersChange={setFilters}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/*Chamada formulario doação*/}
        {showForm && (
          <DonationForm
            key={editingDonation ? editingDonation.id : "new"}
            donation={editingDonation}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingDonation(null);
            }}
          />
        )}

        {/*Chamada formulario distribuição*/}
        {showDistributionForm && (
          <DistributionForm
            donation={donationToDistribute}
            beneficiaries={beneficiaries}
            onSubmit={handleDistributionSubmit}
            onCancel={() => setShowDistributionForm(false)}
          />
        )}

        {/*Confirmação delete */}
        <DeleteConfirmationDialog
          isOpen={!!donationToDelete}
          onClose={() => setDonationToDelete(null)}
          onConfirm={confirmDelete}
          title="Excluir Doação"
          description="Esta ação é irreversível."
        />

        {/* Listagem dos doadores*/}
        <DonationList
          donations={filteredDonations}
          loading={loading}
          onEdit={(d) => {
            setEditingDonation(d);
            setShowForm(true);
          }}
          onDelete={setDonationToDelete}
          onDistribute={(d) => {
            setDonationToDistribute(d);
            setShowDistributionForm(true);
          }}
        />
      </div>
    </div>
  );
}
