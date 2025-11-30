import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import BeneficiaryForm from "../components/beneficiaries/BeneficiaryForm";
import BeneficiaryList from "../components/beneficiaries/BeneficiaryList";
import BeneficiaryFilters from "../components/beneficiaries/BeneficiaryFilters";
import DeleteConfirmationDialog from "../components/shared/DeleteConfirmationDialog";

import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "@/services/beneficiaries";

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all", priority: "all" });

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    setLoading(true);
    try {
      const data = await getBeneficiaries();
      setBeneficiaries(data || []);
    } catch (error) {
      console.error("Erro ao carregar beneficiados:", error);
      toast.error("Erro ao carregar beneficiados. Tente novamente mais tarde.");
    }
    setLoading(false);
  };

  const handleFormSubmit = async (beneficiaryData) => {
    try {
      if (editingBeneficiary) {
        // Atualizar no Supabase
        await updateBeneficiary(editingBeneficiary.id, beneficiaryData);
        toast.success("Beneficiado atualizado com sucesso!");
      } else {
        // Criar no Supabase
        await createBeneficiary(beneficiaryData);
        toast.success("Beneficiado cadastrado com sucesso!");
      }

      setShowForm(false);
      setEditingBeneficiary(null);
      loadBeneficiaries();
    } catch (error) {
      console.error("Erro ao salvar beneficiado:", error);
      toast.error("Erro ao salvar beneficiado. Verifique os dados.");
    }
  };

  const handleEdit = (beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!beneficiaryToDelete) return;

    try {
      await deleteBeneficiary(beneficiaryToDelete.id);
      toast.success("Beneficiado excluído com sucesso.");

      setBeneficiaryToDelete(null);
      loadBeneficiaries();
    } catch (error) {
      console.error("Erro ao excluir beneficiado:", error);
      toast.error("Erro ao excluir beneficiado. Verifique se ele não possui distribuições ativas.");
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const matchesSearch =
      (beneficiary.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (beneficiary.address || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || beneficiary.status === filters.status;

    const matchesPriority =
      filters.priority === "all" ||
      beneficiary.priority_level === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="sm:p-6 md:p-8">
      <div className="mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Gestão de Beneficiados</h1>
            <p className="text-slate-500 mt-1">
              Gerencie as pessoas e famílias que recebem apoio da organização
            </p>
          </div>

          <Button
            className="flex items-center bg-blue-700 hover:bg-blue-900 gap-2 px-6 py-5 rounded-md"
            onClick={() => {
              setEditingBeneficiary(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5" /> Novo Beneficiado
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-md border p-4 mb-6">
          <BeneficiaryFilters
            filters={filters}
            searchTerm={searchTerm}
            onFiltersChange={setFilters}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Formulário */}
        {showForm && (
          <BeneficiaryForm
            key={editingBeneficiary ? editingBeneficiary.id : "new"}
            beneficiary={editingBeneficiary}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBeneficiary(null);
            }}
          />
        )}

        {/* Modal de exclusão */}
        <DeleteConfirmationDialog
          isOpen={!!beneficiaryToDelete}
          onClose={() => setBeneficiaryToDelete(null)}
          onConfirm={confirmDelete}
          title="Excluir Beneficiado"
          description="Tem certeza que deseja excluir este beneficiado? Esta ação não pode ser desfeita."
        />

        {/* Lista */}
        <BeneficiaryList
          beneficiaries={filteredBeneficiaries}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(beneficiary) => setBeneficiaryToDelete(beneficiary)}
        />
      </div>
    </div>
  );
}
